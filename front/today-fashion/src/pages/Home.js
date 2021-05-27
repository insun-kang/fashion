import CustomSignIn from '../components/CustomSignIn';
import UserInfoForm from '../components/UserInfoForm';
import 'react-datepicker/dist/react-datepicker.css';
import { SERVER_URL } from '../config';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import { useLocalStorage } from '../customHooks/useLocalStorage';
import { PCButton } from '../ui-components/@material-extend';

const Home = ({ location, history }) => {
  const [token, setToken] = useLocalStorage('access_token', null);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  const { from } = location.state || { from: { pathname: '/main' } };

  const handleSignUp = useCallback(
    async (data) => {
      try {
        const res = await axios.post(SERVER_URL + '/sign-up', data);
        setToken(res.data.accessToken);
        setOpenSignUp(false);
        history.push('/main');
        //로그인 시켜준 후 게임 화면으로 이동
      } catch (error) {
        if (error.response.data.errorCode === 'alr_signed_email') {
          alert(error.response.data.msg);
          setOpenSignUp(false);
          setOpenSignIn(true);
        } else if (error.response.data.errorCode === 'alr_signed_nickname') {
          alert(error.response.data.msg);
        } else if (error.response.data.errorCode === 'invalid_pw') {
          alert(error.response.data.msg);
        } else {
          alert(error);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history]
  );

  const handleCustomSignIn = useCallback(
    async (data) => {
      try {
        const res = await axios.post(SERVER_URL + '/sign-in', data);
        setToken(res.data.accessToken);
        setOpenSignIn(false);
        history.push('/main');
      } catch (error) {
        if (error.response.data.errorCode === 'not_exists') {
          alert(error.response.data.msg);
        } else if (error.response.data.errorCode === 'missing_email') {
          alert(error.response.data.msg);
        } else if (error.response.data.errorCode === 'missing_pw') {
          alert(error.response.data.msg);
        } else if (error.response.data.errorCode === 'incorrect_pw') {
          alert(error.response.data.msg);
        } else {
          alert(error);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history]
  );

  useEffect(() => {
    return () => {
      setOpenSignIn(false);
      setOpenSignUp(false);
      //unmount memory leak 에러 방지용
    };
  }, []);

  if (token) {
    return <Redirect to={from} />;
    //로그인 된 상태라면 직전에 있었던 페이지 혹은 main으로 redirect된다.
  }

  return (
    <div className="home-container">
      {!openSignIn && !openSignUp && (
        <div>
          <div style={{ height: '80vh' }}></div>
          <div className="home-button-group">
            <PCButton
              color="primary"
              variant="contained"
              value="Sign In"
              onClick={() => {
                setOpenSignIn(!openSignIn);
              }}
            >
              Sign In
            </PCButton>
            <PCButton
              color="secondary"
              variant="contained"
              value="Sign Up"
              onClick={() => {
                setOpenSignUp(!openSignUp);
              }}
            >
              Sign Up
            </PCButton>
          </div>
        </div>
      )}
      {openSignIn && (
        <div className="signin-modal">
          <CustomSignIn handleCustomSignIn={handleCustomSignIn} />
          <button
            type="button"
            onClick={() => {
              setOpenSignIn(!openSignIn);
            }}
          >
            &#10006;
          </button>
        </div>
      )}
      {openSignUp && (
        <div className="signup-modal">
          <UserInfoForm handleUserInfoForm={handleSignUp} />
          <button
            type="button"
            onClick={() => {
              setOpenSignUp(!openSignUp);
            }}
          >
            &#10006;
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
