import CustomSignIn from '../components/CustomSignIn';

const Home = () => {
  return (
    <div className="home-container">
      <input type="button" value="Sign In" />
      <CustomSignIn />
      <input type="button" value="Sign Up" />
    </div>
  );
};

export default Home;
