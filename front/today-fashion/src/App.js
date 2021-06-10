import './App.css';
import React, { useEffect, useCallback } from 'react';
import { Route, Switch, useLocation, useHistory } from 'react-router-dom';
import Home from './pages/Home';
import Main from './pages/Main';
import AuthRoute from './AuthRoute';
import { SERVER_URL } from './config';
import axios from 'axios';
import { useLocalStorage } from './customHooks/useLocalStorage';
import UserInfo from './pages/UserInfo';
import WithDraw from './pages/Withdraw';
import Game from './pages/Game';
import MyPageIntro from './pages/MyPageIntro';
import ComponentsChart from './pages/ComponentsChart';
import Wardrobe from './pages/Wardrobe';
import SharedWardrobe from './pages/SharedWardrobe';

function App() {
  const location = useLocation();
  const history = useHistory();

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
      // setToken(null);
      //위 코드 없어도 에러 안 날것 같아서 일단 주석. 에러 나면 주석해제하기
      history.push('/');
      // // //로그아웃 된다는 모달? alert 띄워주기?
      localStorage.removeItem('access_token');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      checkTokenState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  //페이지가 변할때마다 로그인 여부 확인

  return (
    <Switch>
      <Route path="/" exact render={(props) => <Home {...props} />} />
      {/* login 되어있다면 main("/main"), 되어있지 않다면 home("/")으로 처리 */}
      <AuthRoute
        path={['/main/:asin', '/main']}
        render={(props) => <Main {...props} />}
      />
      <AuthRoute
        path="/mypage"
        exact
        render={(props) => <MyPageIntro {...props} />}
      />
      <AuthRoute
        path="/mypage/userinfo"
        render={(props) => <UserInfo {...props} />}
      />
      <AuthRoute
        path="/mypage/withdraw"
        render={(props) => <WithDraw {...props} />}
      />
      <AuthRoute path="/game" render={(props) => <Game {...props} />} />
      <Route
        path="/wardrobe"
        exact
        render={(props) => <Wardrobe {...props} />}
      />
      <Route
        path="/wardrobe/:items"
        render={(props) => <SharedWardrobe {...props} />}
      />
      <Route path="/components" component={ComponentsChart} />
    </Switch>
  );
}

export default App;
