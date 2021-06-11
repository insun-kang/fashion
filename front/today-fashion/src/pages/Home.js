import CustomSignIn from '../components/CustomSignIn';
import UserInfoForm from '../components/UserInfoForm';
import { SERVER_URL } from '../config';
import axios from 'axios';
import React, { useCallback, useEffect, useState, forwardRef } from 'react';
import { Redirect } from 'react-router';
import { useLocalStorage } from '../customHooks/useLocalStorage';
import { PCButton, KakaoButton } from '../ui-components/@material-extend';
import {
  Slide,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Grid,
} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/core/Alert';
import '../theme/BlurCard.css';

const Home = ({ location, history }) => {
  const [token, setToken] = useLocalStorage('access_token', null);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [catchError, setCatchError] = useState({
    state: false,
    msg: '',
  });

  const vertical = 'top';
  const horizontal = 'center';

  const handleClose = () => {
    setOpenSignIn(false);
    setOpenSignUp(false);
  };

  const errorClear = () => {
    setCatchError({
      state: false,
      msg: '',
    });
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

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
        switch (error.response?.data?.errorCode) {
          case 'alr_signed_email':
            setCatchError({ state: true, msg: error.response.data.msg });
            setOpenSignUp(false);
            setOpenSignIn(true);
            break;
          case 'alr_signed_nickname':
            setCatchError({ state: true, msg: error.response.data.msg });
            break;
          default:
            setCatchError({ state: true, msg: error });
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
        switch (error.response?.data?.errorCode) {
          case 'not_exists':
            // alert(error.response.data.msg);
            setCatchError({ state: true, msg: error.response.data.msg });
            break;
          case 'missing_email':
            setCatchError({ state: true, msg: error.response.data.msg });
            break;
          case 'missing_pw':
            setCatchError({ state: true, msg: error.response.data.msg });
            break;
          case 'incorrect_pw':
            setCatchError({ state: true, msg: error.response.data.msg });
            break;
          default:
            setCatchError({ state: true, msg: error });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history]
  );
  const handleClickKaKaoOAuth = () => {
    window.location.replace(SERVER_URL + '/oauth/url');
  };

  const handleKaKaoSignIn = useCallback(async (queryString) => {
    const code = new URLSearchParams(queryString).get('code');
    try {
      const res = await axios.post('/oauth', { code });
      console.log(res);
      setToken(res.data.accessToken);
      setOpenSignIn(false);
      history.push('/main');
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

  useEffect(() => {
    return errorClear();
  }, [openSignIn]);

  if (token) {
    return <Redirect to={from} />;
    //로그인 된 상태라면 직전에 있었던 페이지 혹은 main으로 redirect된다.
  }

  // const KakaoLoginButton = <PCButton style={{ backgroundColor: '#fee500' }} />;
  console.log(openSignIn);
  console.log(catchError.state);
  return (
    <div className="App" height={window.innderHeight}>
      {openSignIn && (
        <Dialog
          open={openSignIn}
          // TransitionComponent={catchError.state ? undefined : Transition}
          keepMounted
          fullWidth
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          style={{ marginTop: '20vh' }}
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
          <DialogContent style={{ textAlign: 'center' }}>
            <CustomSignIn handleCustomSignIn={handleCustomSignIn} />
            <br />
            <PCButton color="secondary" variant="text" onClick={handleClose}>
              Close
            </PCButton>
          </DialogContent>
        </Dialog>
      )}
      {openSignUp && (
        <Dialog
          open={openSignUp}
          // TransitionComponent={Transition}
          keepMounted
          fullWidth
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

          <DialogContent style={{ textAlign: 'center' }}>
            <UserInfoForm handleUserInfoForm={handleSignUp} />
            <br />
            <PCButton color="secondary" variant="text" onClick={handleClose}>
              Close
            </PCButton>
          </DialogContent>
        </Dialog>
      )}
      <Grid height={window.innerHeight * 0.67}>
        <div
          style={{ justifyContent: 'center', display: 'flex', padding: '20vh' }}
        >
          <img src="./image/logo2.png" width="500px" />
        </div>
      </Grid>
      <Grid>
        <KakaoButton
          color="kakao"
          variant="contained"
          value="Login Kakao"
          startIcon={<img src="/image/kakao.png" height="22px" />}
          onClick={handleClickKaKaoOAuth}
        >
          Login with Kakao
        </KakaoButton>
        <br />
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
      <Snackbar
        open={catchError.state}
        onClose={errorClear}
        TransitionComponent={Transition}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert
          variant="filled"
          severity="error"
          onClose={errorClear}
          width="30%"
        >
          {catchError.msg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Home;
