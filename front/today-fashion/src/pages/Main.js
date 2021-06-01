import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import TagsInput from '../components/TagsInput';
import { SERVER_URL } from '../config';
import { Container, Grid } from '@material-ui/core';
import { PCButton } from '../ui-components/@material-extend';
import ProductCard from '../components/ProductCard';
import InfiniteProducts from '../components/InfiniteProducts';

const Main = () => {
  const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
  const [mainProducts, setMainProducts] = useState();
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
  axios.defaults.baseURL = SERVER_URL;
  axios.defaults.headers.common['Authorization'] = AuthStr;

  const getRecommendationResults = useCallback(async () => {
    try {
      const res = await axios.get('/result-cards');
      setMainProducts(res.data.products);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSelectedTags = (items) => {
    console.log(items);
    //items 목록에 따라 키워드 검색 결과 재호출해서 보여주기
  };

  const infiniteScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight) {
      console.log('scroll end');
      //새로운 데이터 불러오기
    }
  };

  useEffect(() => {
    getRecommendationResults();
    window.addEventListener('scroll', infiniteScroll, true);
    return () => {
      window.removeEventListener('scroll', infiniteScroll);
    };
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
      <div className="products-container">
        {mainProducts &&
          mainProducts.map((product, index) => (
            <div key={index}>
              <ProductCard productData={product} />
            </div>
          ))}
      </div>
    </>
  );
};

export default Main;
