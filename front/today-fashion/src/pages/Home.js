import CustomSignIn from '../components/CustomSignIn';
import UserInfoForm from '../components/UserInfoForm';
import 'react-datepicker/dist/react-datepicker.css';
import { SERVER_URL } from '../config';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import {
  loggedinState,
  signInModalOpenState,
  signUpModalOpenState,
} from '../states/state';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedinState);
  const [openSignIn, setOpenSignIn] = useRecoilState(signInModalOpenState);
  const [openSignUp, setOpenSignUp] = useRecoilState(signUpModalOpenState);

  const handleSignUp = async (data) => {
    const res = await axios.post(SERVER_URL + '/sign-up', data);
    console.log(res);
  }; //회원가입 요청

  const handleSignIn = async (data) => {
    const res = await axios.post(SERVER_URL + '/sign-in', data);
    console.log(res);
  }; //로그인 요청

  return (
    <div className="home-container">
      {!openSignIn && !openSignUp ? (
        <div className="home-button-group">
          <input
            type="button"
            value="Sign In"
            onClick={() => {
              setOpenSignIn(!openSignIn);
            }}
          />
          <input
            type="button"
            value="Sign Up"
            onClick={() => {
              setOpenSignUp(!openSignUp);
            }}
          />
        </div>
      ) : null}
      {openSignIn ? (
        <div className="signin-modal">
          <CustomSignIn />
          <button
            type="button"
            onClick={() => {
              setOpenSignIn(!openSignIn);
            }}
          >
            &#10006;
          </button>
        </div>
      ) : null}
      {openSignUp ? (
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
      ) : null}
    </div>
  );
};

export default Home;
