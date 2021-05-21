import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import UserInfoField from '../components/UserInfoField';
import UserInfoForm from '../components/UserInfoForm';
import { SERVER_URL } from '../config';

const MyPage = () => {
  //비밀번호 입력
  //회원정보 보기 , 회원정보 수정
  //회원탈퇴 -> 페이지 새로 만들어야 할듯
  const [password, setPassword] = useState('');
  const history = useHistory();

  const confirmUser = useCallback(async () => {
    const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
    try {
      const res = await axios.post(
        SERVER_URL + '/mypage',
        { pw: password },
        {
          headers: {
            Authorization: AuthStr,
          },
        }
      );
      console.log(res);
      history.push('/mypage/userinfo');
    } catch (error) {
      console.log(error);
    }
  }, [history, password]);

  return (
    <div className="container">
      <div>
        <h2>비밀번호를 입력해주세요</h2>
        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
        />
        <input type="button" value="확인" onClick={confirmUser} />
      </div>
    </div>
  );
};
export default MyPage;
