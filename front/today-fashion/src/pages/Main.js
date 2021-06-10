import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import TagsInput from '../components/TagsInput';
import { SERVER_URL } from '../config';
import { Container, Grid } from '@material-ui/core';
import { PCButton } from '../ui-components/@material-extend';
import ProductCard from '../components/ProductCard';
import InfiniteProductsMobile from '../components/InfiniteProductsMobile';
import InfiniteProductsTablet from '../components/InfiniteProductsTablet';
import InfiniteProductsPC from '../components/InfiniteProductsPC';

const Main = (props) => {
  // const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;

  // axios.defaults.baseURL = SERVER_URL;
  // axios.defaults.headers.common['Authorization'] = AuthStr;
  const [searchKeywords, setSearchKeywords] = useState([]);
  const [screenSize, getScreenSize] = useState();

  // useEffect(() => {
  //   getScreenSize(window.innerWidth);
  // }, []);

  const handleSelectedTags = (items) => {
    setSearchKeywords(items);
    //items 목록에 따라 키워드 검색 결과 재호출해서 보여주기
  };

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
      />
      {/* {window.innerWidth > 1279 ? (
        <InfiniteProductsPC {...props} searchKeywords={searchKeywords} />
      ) : window.innerWidth > 599 ? (
        <InfiniteProductsTablet {...props} searchKeywords={searchKeywords} />
      ) : ( */}
      <InfiniteProductsMobile {...props} searchKeywords={searchKeywords} />
    </>
  );
};

export default Main;
