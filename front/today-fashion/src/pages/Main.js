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
  // const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
  // const [mainProducts, setMainProducts] = useState([]);
  // const [requestData, setRequestData] = useState({ pageNum: 0, dataSize: 10 });
  // // const [itemNums, setItemNums] = useState(10);
  // // TODO:
  // // 스크롤을 완전히 끝까지 내리기 전에 새로운 데이터 호출하기
  // // 스크롤 속도에 따라 데이터 호출하는 양 다르게 조절하기?

  // axios.defaults.baseURL = SERVER_URL;
  // axios.defaults.headers.common['Authorization'] = AuthStr;

  // const getRecommendationResults = useCallback(async () => {
  //   try {
  //     const res = await axios.get('/result-cards');
  //     setMainProducts([...mainProducts].concat(res.data.products));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);
  const [searchKeywords, setSearchKeywords] = useState([]);

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

      <InfiniteProducts searchKeywords={searchKeywords} />
      {/* <div className="products-container">
        {mainProducts &&
          mainProducts.map((product, index) => (
            <div key={index}>
              <ProductCard productData={product} />
            </div>
          ))}
      </div> */}
    </>
  );
};

export default Main;
