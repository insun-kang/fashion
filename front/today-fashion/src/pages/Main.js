import axios from 'axios';
import { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import { SERVER_URL } from '../config';

const Main = () => {
  const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;

  useEffect(() => {
    getRecommendationResults();
  }, []);

  const getRecommendationResults = useCallback(async () => {
    try {
      const res = await axios.get(SERVER_URL + '/result-cards', {
        headers: {
          Authorization: AuthStr,
        },
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }, [AuthStr]);
  //onmount 시점에 추천결과 보여주기
  //검색창에 무언가 입력하면 검색결과 보여주기
  return (
    <>
      Main Page
      <LogoutButton />
      <Link to="/mypage">마이페이지</Link>
    </>
  );
};

export default Main;
