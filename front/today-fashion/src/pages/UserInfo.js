import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserInfoField from '../components/UserInfoField';
import UserInfoForm from '../components/UserInfoForm';
import { SERVER_URL } from '../config';

const UserInfo = () => {
  const [editInfo, setEditInfo] = useState(false);
  const [userValues, setUserValues] = useState();

  const getUserInfo = useCallback(async () => {
    //userValues 여기서 구하기
    const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
    try {
      const res = await axios.get(SERVER_URL + '/modification', {
        headers: {
          Authorization: AuthStr,
        },
      });
      const value = res.data;
      value['pw'] = '';
      value['confirmPw'] = '';
      let formatBirth = new Date(value['birth']);
      value['birth'] = formatBirth.toISOString().slice(0, 10);
      setUserValues(value);
    } catch (error) {
      alert('Unable to bring user information');
    }
  }, []);

  const handleUpdateUserInfo = async (data) => {
    const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
    try {
      const res = await axios.post(SERVER_URL + '/modification', data, {
        headers: {
          Authorization: AuthStr,
        },
      });
      console.log(res);
    } catch (error) {
      if (error.response.data.errorCode === 'failed_change_info') {
        alert(error.response.data.msg);
      } else {
        alert(error);
      }
    }
    setEditInfo(false);
  };

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo, editInfo]);

  if (!userValues) {
    return null;
  }

  return (
    <>
      <Link to="/mypage/signout">
        <button>sign out</button>
      </Link>
      <button disabled>user info</button>
      {editInfo ? (
        <>
          <UserInfoForm
            handleUserInfoForm={handleUpdateUserInfo}
            initialValues={userValues}
          />
          <input
            type="button"
            value="close"
            onClick={() => {
              setEditInfo(false);
            }}
          />
        </>
      ) : (
        //   회원정보 수정
        <>
          <UserInfoField userValues={userValues} />
          <input
            type="button"
            value="수정하기"
            onClick={() => {
              setEditInfo(true);
            }}
          />
        </>
      )}
    </>
  );
};
export default UserInfo;
