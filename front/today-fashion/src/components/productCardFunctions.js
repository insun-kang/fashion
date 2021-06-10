import axios from 'axios';
import React from 'react';
import { SERVER_URL } from '../config';
const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
axios.defaults.baseURL = SERVER_URL;
axios.defaults.headers.common['Authorization'] = AuthStr;

export const handleBookMark = async (data) => {
  try {
    await axios.post('/bookmark', data);
  } catch (error) {
    console.log(error);
  }
};
