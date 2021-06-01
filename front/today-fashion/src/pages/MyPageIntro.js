import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SERVER_URL } from '../config';

const MyPageIntro = () => {
  //비밀번호 입력
  //회원정보 보기 , 회원정보 수정
  //회원탈퇴 -> 페이지 새로 만들어야 할듯
  const [password, setPassword] = useState('');
  const history = useHistory();
  const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;

  axios.defaults.baseURL = SERVER_URL;
  axios.defaults.headers.common['Authorization'] = AuthStr;

  const confirmUser = useCallback(async () => {
    try {
      const res = await axios.post('/mypage', { pw: password });
      console.log(res);
      history.push('/mypage/userinfo');
    } catch (error) {
      if (error.response.data.errorCode === 'incorrect_pw') {
        alert(error.response.data.msg);
      } else if (error.response.data.errorCode === 'missing_pw') {
        alert(error.response.data.msg);
      } else {
        alert(error);
      }
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
export default MyPageIntro;
