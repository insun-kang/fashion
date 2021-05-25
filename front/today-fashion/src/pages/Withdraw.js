import axios from 'axios';
import { useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { SERVER_URL } from '../config';
import { userNick } from '../states/state';

const WithDraw = () => {
  // const [user, setUser] = useRecoilState(userNick);
  const history = useHistory();
  const handleWithdrawal = useCallback(async () => {
    const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
    try {
      await axios.get(SERVER_URL + '/withdrawal', {
        headers: {
          Authorization: AuthStr,
        },
      });
      alert('withdraw completed');
      localStorage.removeItem('access_token');
      history.push('/');
    } catch (error) {
      alert(error);
    }
  }, [history]);
  return (
    <>
      <button disabled>withdraw</button>
      <Link to="/mypage/userinfo">
        <button>user info</button>
      </Link>
      <div className="withdraw-container">
        {/* <h3>{user}, I thought we were friends...</h3> */}
        {/* 위 내용은 protect api에서 userNick을 줘야 사용할 수 있음. */}
        <p>Are you sure you want to withdraw?</p>
        <button onClick={handleWithdrawal}>yes</button>
        <Link to="/main">
          <button>no</button>
        </Link>
      </div>
    </>
  );
};

export default WithDraw;
