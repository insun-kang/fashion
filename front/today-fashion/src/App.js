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
      console.log(res);
    } catch (error) {
      // alert(error);
      setToken(null);
      //위 코드 없으면 에러남...(왜...? 아래와 중복된 코드 아닌가...?)
      // //로그아웃 된다는 모달? alert 띄워주기?
      localStorage.removeItem('access_token');
    }
  }, [setToken]);
  console.log(token);

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      console.log(token);
      console.log('check token state');
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
        <AuthRoute path="/mypage" render={(props) => <MyPage {...props} />} />
        {/* login 필요한 경로들은 AuthRoute로 배정하기 */}
      </Switch>
    </div>
  );
}

export default App;
