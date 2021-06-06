import React from 'react';
import { withRouter } from 'react-router';
import { PCButton } from '../ui-components/@material-extend';

const LogoutButton = ({ history }) => {
  const handleLogout = () => {
    // accesstoken 빼기, setLogout false?...할 필요 없을듯
    localStorage.removeItem('access_token');
    history.push('/');
  };
  return <PCButton onClick={handleLogout}>Sign Out</PCButton>;
};

export default withRouter(LogoutButton);
// 의미 찾아보기
