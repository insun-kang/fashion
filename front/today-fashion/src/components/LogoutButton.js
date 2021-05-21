import React from 'react';
import { withRouter } from 'react-router';

const LogoutButton = ({ history }) => {
  const handleLogout = () => {
    // accesstoken 빼기, setLogout false?...할 필요 없을듯
    localStorage.removeItem('access_token');
    history.push('/');
  };
  return <button onClick={handleLogout}>Logout</button>;
};

export default withRouter(LogoutButton);
// 의미 찾아보기
