import CustomSignIn from '../components/CustomSignIn';
import UserInfoForm from '../components/UserInfoForm';
import { SERVER_URL } from '../config';
import axios from 'axios';
<<<<<<< HEAD
import { useRecoilState } from 'recoil';
import { userNick } from '../states/state';
import React, { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import { useLocalStorage } from '../customHooks/useLocalStorage';

const Home = ({ location, history }) => {
  const [user, setUser] = useRecoilState(userNick);
=======
import React, { useCallback, useEffect, useState, forwardRef } from 'react';
import { Redirect } from 'react-router';
import { useLocalStorage } from '../customHooks/useLocalStorage';
import { PCButton } from '../ui-components/@material-extend';
import {
  Slide,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from '@material-ui/core';

const Home = ({ location, history }) => {
>>>>>>> feature_UI/UX
  const [token, setToken] = useLocalStorage('access_token', null);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

<<<<<<< HEAD
=======
  const Transition = forwardRef((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
  ));

>>>>>>> feature_UI/UX
  const { from } = location.state || { from: { pathname: '/main' } };

  const handleSignUp = useCallback(
    async (data) => {
      try {
        const res = await axios.post(SERVER_URL + '/sign-up', data);
<<<<<<< HEAD
        setToken(res.data.access_token);
        setUser(res.data.nickname);
=======
        setToken(res.data.accessToken);
>>>>>>> feature_UI/UX
        setOpenSignUp(false);
        history.push('/main');
        //로그인 시켜준 후 게임 화면으로 이동
      } catch (error) {
<<<<<<< HEAD
        if (error.response.data.errorCode === 'Alr_Signed_email') {
          alert(error.response.data.msg);
          setOpenSignUp(false);
          setOpenSignIn(true);
        } else if (error.response.data.errorCode === 'Alr_Signed_nickname') {
          alert(error.response.data.msg);
        } else if (error.response.data.errorCode === 'Invalid_pw') {
=======
        if (error.response.data.errorCode === 'alr_signed_email') {
          alert(error.response.data.msg);
          setOpenSignUp(false);
          setOpenSignIn(true);
        } else if (error.response.data.errorCode === 'alr_signed_nickname') {
          alert(error.response.data.msg);
        } else if (error.response.data.errorCode === 'invalid_pw') {
>>>>>>> feature_UI/UX
          alert(error.response.data.msg);
        } else {
          alert(error);
        }
      }
    },
<<<<<<< HEAD
    [history, setToken, setUser]
=======
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history]
>>>>>>> feature_UI/UX
  );

  const handleCustomSignIn = useCallback(
    async (data) => {
      try {
        const res = await axios.post(SERVER_URL + '/sign-in', data);
<<<<<<< HEAD
        setToken(res.data.access_token);
        setUser(res.data.nickname);
        setOpenSignIn(false);
        history.push('/main');
      } catch (error) {
        if (error.response.data.errorCode === 'Not_Exists') {
          alert(error.response.data.msg);
        } else if (error.response.data.errorCode === 'Missing_email') {
          alert(error.response.data.msg);
        } else if (error.response.data.errorCode === 'Missing_pw') {
=======
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
>>>>>>> feature_UI/UX
          alert(error.response.data.msg);
        } else {
          alert(error);
        }
      }
    },
<<<<<<< HEAD
    [history, setToken, setUser]
=======
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history]
>>>>>>> feature_UI/UX
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
      <img
        src="/image/logo.png"
        style={{ marginTop: '10vh', marginLeft: '35vw', height: '20vw' }}
      />
      {/* 이부분 꼭 있어야하는 부분인가요? */}
      {/* {!openSignIn && !openSignUp && ( */}
      <div>
        <div style={{ height: '40vh' }}></div>
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
<<<<<<< HEAD
      ) : null}
      {openSignIn ? (
        <div className="signin-modal">
          <CustomSignIn handleCustomSignIn={handleCustomSignIn} />
          <button
            type="button"
            onClick={() => {
              setOpenSignIn(!openSignIn);
=======
      </div>
      {/* )} */}
      {openSignIn && (
        <Dialog
          open={openSignIn}
          TransitionComponent={Transition}
          keepMounted
          onClose={openSignIn}
          style={{ marginTop: '37vh' }}
        >
          <DialogTitle
            id="alert-dialog-slide-title"
            style={{
              textAlign: 'center',
              marginTop: '1rem',
              marginBottom: '2rem',
>>>>>>> feature_UI/UX
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

        // <div className="signin-modal">

        // </div>
      )}
      {openSignUp && (
        <Dialog
          open={openSignUp}
          TransitionComponent={Transition}
          keepMounted
          onClose={openSignUp}
          style={{ height: '800px', marginTop: '13vh' }}
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

        // <div className="signup-modal">
        //   <UserInfoForm handleUserInfoForm={handleSignUp} />
        //   <button
        //     type="button"
        //     onClick={() => {
        //       setOpenSignUp(!openSignUp);
        //     }}
        //   >
        //     &#10006;
        //   </button>
        // </div>
      )}
    </div>
  );
};

export default Home;
