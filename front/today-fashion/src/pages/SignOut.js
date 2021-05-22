import axios from 'axios';
import { useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { SERVER_URL } from '../config';
import { userNick } from '../states/state';

const SignOut = () => {
  const [user, setUser] = useRecoilState(userNick);
  const history = useHistory();
  const handleDoSignOut = useCallback(async () => {
    const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
    try {
      const res = await axios.get(SERVER_URL + '/withdrawal', {
        headers: {
          Authorization: AuthStr,
        },
      });
      alert('탈퇴가 완료되었습니다.');
      localStorage.removeItem('access_token');
      history.push('/');
    } catch (error) {
      alert(error);
    }
    // const res = await axios.post();
  }, [history]);
  return (
    <>
      <Link to="/mypage/signout">
        <button>sign out</button>
      </Link>
      <button disabled>user info</button>
      <div className="signout-container">
        {/* <h3>{user}, I thought we were friends...</h3> */}
        {/* 위 내용은 protect api에서 userNick을 줘야 사용할 수 있음. */}
        <p>Are you sure you want to sign out?</p>
        <button onClick={handleDoSignOut}>yes</button>
        <Link to="/main">
          <button>no</button>
        </Link>
      </div>
    </>
  );
};

export default SignOut;
