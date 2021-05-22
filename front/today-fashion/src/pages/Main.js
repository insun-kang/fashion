import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

const Main = () => {
  return (
    <>
      Main Page
      <LogoutButton />
      <Link to="/mypage">마이페이지</Link>
    </>
  );
};

export default Main;
