import { useRecoilState } from 'recoil';
import { loggedinState } from './states/state';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({ component: Component, render, ...rest }) => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedinState);
  //로그인이 필요한 경로를 다룬다
  console.log(isLoggedIn);
  //로그인 되지 않은 경우 로그인이 가능한 home("/")으로 이동하게 되는 route
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          render ? (
            render(props)
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )
      }
    />
  );
};

export default AuthRoute;
