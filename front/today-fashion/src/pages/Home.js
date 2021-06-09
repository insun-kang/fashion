import CustomSignIn from '../components/CustomSignIn';
import UserInfoForm from '../components/UserInfoForm';
import { SERVER_URL } from '../config';
import axios from 'axios';
import React, {
  useCallback,
  useEffect,
  useState,
  forwardRef,
  Suspense,
} from 'react';
import { Redirect } from 'react-router';
import { useLocalStorage } from '../customHooks/useLocalStorage';
import { PCButton } from '../ui-components/@material-extend';
import {
  Slide,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Grid,
} from '@material-ui/core';

const Home = ({ location, history }) => {
  const [token, setToken] = useLocalStorage('access_token', null);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  const Transition = forwardRef((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
  ));

  const { from } = location.state || { from: { pathname: '/main' } };

  axios.defaults.baseURL = SERVER_URL;

  const handleSignUp = useCallback(
    async (data) => {
      try {
        const res = await axios.post('/sign-up', data);
        setToken(res.data.accessToken);
        setOpenSignUp(false);
        history.push('/game');
        //회원가입이 되면 바로 로그인 + 게임 화면으로 이동
      } catch (error) {
        switch (error.response.data.errorCode) {
          case 'alr_signed_email':
            alert(error.response.data.msg);
            setOpenSignUp(false);
            setOpenSignIn(true);
            break;
          case 'alr_signed_nickname':
            alert(error.response.data.msg);
            break;
          default:
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
        const res = await axios.post('/sign-in', data);
        setToken(res.data.accessToken);
        setOpenSignIn(false);
        history.push('/main');
      } catch (error) {
        switch (error.response.data.errorCode) {
          case 'not_exists':
            alert(error.response.data.msg); //적절하게 메세지 수정하기
            break;
          case 'missing_email':
            alert(error.response.data.msg);
            break;
          case 'missing_pw':
            alert(error.response.data.msg);
            break;
          case 'incorrect_pw':
            alert(error.response.data.msg);
            break;
          default:
            alert(error);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history]
  );
  const handleClickKaKaoOAuth = () => {
    //window.location.replace(SERVER_URL+"")
    //카카오 로그인 요청하는 백엔드 경로로 이동
  };
  const handleKaKaoSignIn = useCallback(async (queryString) => {
    //코드 백엔드로 보내는 요청
    const authCode = new URLSearchParams(queryString).get('code');
    //https://www.sitepoint.com/get-url-parameters-with-javascript/
    try {
      // const res = await axios.get('/kakao-Sign-in',{authCode})
      // setToken(res.data.accessToken);
      // setOpenSignIn(false);
      // history.push('/main');
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (window.location.search && !token) {
      handleKaKaoSignIn(window.location.search);
      history.push({ search: '' });
    }
  }, [token]);

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
    <div className="App">
      {openSignIn && (
        <Dialog
          open={openSignIn}
          TransitionComponent={Transition}
          keepMounted
          onClose={openSignIn}
          style={{ marginTop: '40vh' }}
        >
          <DialogTitle
            id="alert-dialog-slide-title"
            style={{
              textAlign: 'center',
              marginTop: '1rem',
              marginBottom: '2rem',
            }}
          >
            Sign In
          </DialogTitle>
          <DialogContent>
            <CustomSignIn handleCustomSignIn={handleCustomSignIn} />
          </DialogContent>
          <DialogActions>
            <PCButton
              color="secondary"
              variant="text"
              onClick={() => {
                setOpenSignIn(!openSignIn);
              }}
            >
              Close
            </PCButton>
          </DialogActions>
        </Dialog>
      )}
      {openSignUp && (
        <Dialog
          open={openSignUp}
          TransitionComponent={Transition}
          keepMounted
          onClose={openSignUp}
          style={{ marginTop: '10vh' }}
        >
          <DialogTitle
            id="alert-dialog-slide-title"
            style={{
              textAlign: 'center',
              marginTop: '1rem',
              marginBottom: '2rem',
            }}
          >
            Sign Up
          </DialogTitle>

          <DialogContent>
            <UserInfoForm handleUserInfoForm={handleSignUp} />
          </DialogContent>
          <DialogActions>
            <PCButton
              color="secondary"
              variant="text"
              onClick={() => {
                setOpenSignUp(!openSignUp);
              }}
            >
              Close
            </PCButton>
          </DialogActions>
        </Dialog>
      )}
      <Grid style={{ height: '80vh' }}></Grid>
      <Grid>
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
      </Grid>
    </div>
  );
};

export default Home;
