import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import TagsInput from '../components/TagsInput';
import { SERVER_URL } from '../config';

const Main = () => {
  const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
  // const [inputValue, setInputValue] = useState('');
  // const [selectedItem, setSelectedItem] = useState([]);
  // const [autoCompleteItems, setAutoCompleteItems] = useState([
  //   'apple',
  //   'pear',
  //   'peach',
  //   'grape',
  //   'orange',
  //   'banana',
  // ]);

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

  const handleSelectedTags = (items) => {
    console.log(items);
    //items 목록에 따라 키워드 검색 결과 보여주기
  };

  useEffect(() => {
    getRecommendationResults();
    //onmount 시점에 추천결과 보여주기
  }, []);

  return (
    <>
      Main Page
      <LogoutButton />
      <Link to="/mypage">마이페이지</Link>
      <TagsInput
        selectedTags={handleSelectedTags}
        fullWidth
        variant="outlined"
        id="tags"
        name="tags"
        placeholder="add Tags"
        label="tags"
        // inputValue={inputValue}
        // setInputValue={setInputValue}
        // selectedItem={selectedItem}
        // setSelectedItem={setSelectedItem}
        // autoCompleteItems={autoCompleteItems}
        // setAutoCompleteItems={setAutoCompleteItems}
      />
    </>
  );
};

export default Main;
