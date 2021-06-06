import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MypageNav from '../components/MypageNav';
import UserInfoField from '../components/UserInfoField';
import UserInfoForm from '../components/UserInfoForm';
import { SERVER_URL } from '../config';

const UserInfo = () => {
  const [editInfo, setEditInfo] = useState(false);
  const [userValues, setUserValues] = useState();
  const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;

  axios.defaults.baseURL = SERVER_URL;
  axios.defaults.headers.common['Authorization'] = AuthStr;

  const getUserInfo = useCallback(async () => {
    //userValues 여기서 구하기
    try {
      const res = await axios.get('/modification');
      const value = res.data;
      value['pw'] = '';
      value['confirmPw'] = '';
      let formatBirth = new Date(value['birth']);
      value['birth'] = formatBirth.toISOString().slice(0, 10);
      setUserValues(value);
    } catch (error) {
      alert('Unable to bring user information');
    }
  }, [AuthStr]);

  const handleUpdateUserInfo = useCallback(async (data) => {
    try {
      await axios.post('/modification', data);
    } catch (error) {
      if (error.response.data.errorCode === 'failed_change_info') {
        alert(error.response.data.msg);
      } else {
        alert(error);
      }
    }
    setEditInfo(false);
  }, []);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo, editInfo]);

  if (!userValues) {
    return null;
  }

  return (
    <>
      <MypageNav />
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
