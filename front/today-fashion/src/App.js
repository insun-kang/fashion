import './App.css';
import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Main from './pages/Main';
import AuthRoute from './AuthRoute';
import { SERVER_URL } from './config';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { loggedinState } from './states/state';
function App() {
  const location = useLocation();
  const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedinState);

  const checkLoggedState = async () => {
    const res = await axios.get(SERVER_URL + '/protected', {
      headers: {
        Authorization: AuthStr,
      },
    });
    console.log(res);
    if (res.data.status === 200) {
      setIsLoggedIn(true);
    } else {
      //refresh 가능한지 아닌지 여부에 따라 다르게 행동하기
      //일단은 전부 강제 로그아웃
      setIsLoggedIn(false);
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('access_token');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      checkLoggedState();
    }
  }, [location]);
  //페이지가 변할때마다 로그인 여부 확인
  console.log(isLoggedIn);
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact render={(props) => <Home {...props} />} />
        {/* login 되어있다면 main, 되어있지 않다면 home으로 처리 */}
        <AuthRoute path="/main" render={(props) => <Main {...props} />} />
        {/* login 필요한 경로들은 authroute로 배정하기 */}
      </Switch>
    </div>
  );
}

export default App;
