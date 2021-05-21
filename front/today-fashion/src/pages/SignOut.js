import axios from 'axios';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';

const SignOut = () => {
  const handleDoSignOut = useCallback(async () => {
    // const res = await axios.post();
  }, []);
  return (
    <>
      <Link to="/mypage/signout">
        <button>sign out</button>
      </Link>
      <button disabled>user info</button>
      <div className="signout-container">
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
