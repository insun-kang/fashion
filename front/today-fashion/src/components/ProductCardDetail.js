import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../config';
const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;

axios.defaults.baseURL = SERVER_URL;
axios.defaults.headers.common['Authorization'] = AuthStr;

const ProductCardDetail = ({ asin }) => {
  const [data, setData] = useState();

  const fetchCardDetail = async (data) => {
    try {
      const res = await axios.post('/details', data);
      setData(res.data.datas);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCardDetail({ asin });
  }, []);

  if (!data) {
    return null;
  }
  return <>"여기에 data 변수의 값들로 세부 화면 구성하기!"</>;
};

export default ProductCardDetail;
