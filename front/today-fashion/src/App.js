import './App.css';
import React, { useEffect, useCallback } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Main from './pages/Main';
import AuthRoute from './AuthRoute';
import { SERVER_URL } from './config';
import axios from 'axios';
import MyPage from './pages/MyPage';
import { useLocalStorage } from './customHooks/useLocalStorage';
import UserInfo from './pages/UserInfo';
import WithDraw from './pages/Withdraw';
function App() {
  const location = useLocation();

  const [token, setToken] = useLocalStorage('access_token', null);

  const checkTokenState = useCallback(async () => {
    const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
    try {
      const res = await axios.get(SERVER_URL + '/protected', {
        headers: {
          Authorization: AuthStr,
        },
      });
    } catch (error) {
      alert(error);
      setToken(null);
      // // //로그아웃 된다는 모달? alert 띄워주기?
      localStorage.removeItem('access_token');
    }
  }, [setToken]);

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      checkTokenState();
    }
  }, [location, token, checkTokenState]);
  //페이지가 변할때마다 로그인 여부 확인

  return (
    <div className="App">
      <Switch>
        <Route path="/" exact render={(props) => <Home {...props} />} />
        {/* login 되어있다면 main("/main"), 되어있지 않다면 home("/")으로 처리 */}
        <AuthRoute path="/main" render={(props) => <Main {...props} />} />
        <AuthRoute
          path="/mypage"
          exact
          render={(props) => <MyPage {...props} />}
        />
        <AuthRoute
          path="/mypage/userinfo"
          render={(props) => <UserInfo {...props} />}
        />
        <AuthRoute
          path="/mypage/signout"
          render={(props) => <WithDraw {...props} />}
        />
        {/* login 필요한 경로들은 AuthRoute로 배정하기 */}
      </Switch>
    </div>
  );
}

export default App;
