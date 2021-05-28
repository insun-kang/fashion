import { NavLink } from 'react-router-dom';

const MypageNav = () => {
  return (
    <>
      <NavLink
        to="/mypage/withdraw"
        activeStyle={{ color: 'black', textDecoration: 'none' }}
      >
        withdraw
      </NavLink>
      <NavLink
        to="/mypage/userinfo"
        activeStyle={{ color: 'black', textDecoration: 'none' }}
      >
        user info
      </NavLink>
    </>
  );
};
export default MypageNav;
