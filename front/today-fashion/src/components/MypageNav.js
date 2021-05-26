import { Link, useLocation } from 'react-router-dom';

const MypageNav = () => {
  const location = useLocation();

  return (
    <>
      <Link to="/mypage/withdraw">
        <button disabled={location.pathname === '/mypage/withdraw'}>
          withdraw
        </button>
      </Link>
      <Link to="/mypage/userinfo">
        <button disabled={location.pathname === '/mypage/userinfo'}>
          user info
        </button>
      </Link>
    </>
  );
};
export default MypageNav;
