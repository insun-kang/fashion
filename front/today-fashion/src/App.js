import './App.css';
import React, { useEffect, useCallback } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Main from './pages/Main';
import AuthRoute from './AuthRoute';
import { SERVER_URL } from './config';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { loggedinState } from './states/state';
import MyPage from './pages/MyPage';
function App() {
  const location = useLocation();
  const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedinState);

  const checkLoggedState = useCallback(async () => {
    try {
      const res = await axios.get(SERVER_URL + '/protected', {
        headers: {
          Authorization: AuthStr,
        },
      });
      console.log(res);
      setIsLoggedIn(true);
    } catch (error) {
      alert(error);
      //로그아웃 된다는 모달? alert 띄워주기?
      setIsLoggedIn(false);
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('access_token');
    }
  }, [AuthStr, setIsLoggedIn]);

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      checkLoggedState();
    }
  }, [location, checkLoggedState]);
  //페이지가 변할때마다 로그인 여부 확인
  console.log(isLoggedIn);
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact render={(props) => <Home {...props} />} />
        {/* login 되어있다면 main("/main"), 되어있지 않다면 home("/")으로 처리 */}
        <AuthRoute path="/main" render={(props) => <Main {...props} />} />
        <AuthRoute path="/mypage" render={(props) => <MyPage {...props} />} />
        {/* login 필요한 경로들은 AuthRoute로 배정하기 */}
      </Switch>
    </div>
  );
}

export default App;
