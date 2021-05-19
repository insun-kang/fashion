import React from 'react';
import { withRouter } from 'react-router';
import { useRecoilState } from 'recoil';
import { loggedinState } from '../states/state';

const LogoutButton = ({ history }) => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedinState);
  const handleLogout = () => {
    // accesstoken 빼기, setLogout false?...할 필요 없을듯
    setIsLoggedIn(false);
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_token');
    history.push('/');
  };
  return <button onClick={handleLogout}>Logout</button>;
};

export default withRouter(LogoutButton);
