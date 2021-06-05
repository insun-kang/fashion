import axios from 'axios';
import { useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import MypageNav from '../components/MypageNav';
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

      <MypageNav />
      <div className="withdraw-container">

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
