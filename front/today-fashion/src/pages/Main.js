import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import TagsInput from '../components/TagsInput';
import { SERVER_URL } from '../config';
import { Container, Grid } from '@material-ui/core';
import { PCButton } from '../ui-components/@material-extend';

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
      <Container>
        <Grid item xs={12}>
          <Grid container spacing={1} style={{ marginTop: '10px' }}>
            <Grid>
              <img
                src="/image/navlogo.png"
                style={{ height: '30px', marginTop: '10px' }}
              />
            </Grid>
            <Grid item xs={8}></Grid>
            <Grid item xs={1}>
              <LogoutButton />
            </Grid>
            <Grid item xs={1}>
              <Link to="/mypage" style={{ textDecoration: 'none' }}>
                <PCButton>My Page</PCButton>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <TagsInput
        selectedTags={handleSelectedTags}
        fullWidth
        variant="outlined"
        id="tags"
        name="tags"
        placeholder="Search Item by Keyword"
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
