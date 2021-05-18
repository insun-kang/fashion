import CustomLogIn from '../components/CustomLogIn';

const Home = () => {
  return (
    <div className="home-container">
      <input type="button" value="로그인" />
      <CustomLogIn />
      <input type="button" value="회원가입" />
    </div>
  );
};

export default Home;
