import CustomSignIn from '../components/CustomSignIn';
import SignUp from '../components/SignUp';

const Home = () => {
  return (
    <div className="home-container">
      <input type="button" value="Sign In" />
      <CustomSignIn />
      <input type="button" value="Sign Up" />
      <SignUp />
    </div>
  );
};

export default Home;
