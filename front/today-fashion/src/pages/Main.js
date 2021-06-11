import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import TagsInput from '../components/TagsInput';
import { Container, Grid } from '@material-ui/core';
import { PCButton } from '../ui-components/@material-extend';
import InfiniteProductsMobile from '../components/InfiniteProductsMobile';
import InfiniteProductsTablet from '../components/InfiniteProductsTablet';
import InfiniteProductsLaptop from '../components/InfiniteProductsLaptop';
import InfiniteProductsPC from '../components/InfiniteProductsPC';
import { useMediaQuery } from '@material-ui/core';
import { SpeedDial } from '../ui-components/@material-extend';

const Main = (props) => {
  const isTablet = useMediaQuery('(min-width: 800px)');
  const isLaptop = useMediaQuery('(min-width: 1280px');
  const isPC = useMediaQuery('(min-width: 1600px)');
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
      <SpeedDial />
      <Container>
        <Grid width={window.innderWidth}>
          <Grid
            item
            xs={12}
            container
            spacing={1}
            style={{ marginTop: '10px' }}
          >
            <Grid item xs={5}>
              <img
                src="/image/onot.png"
                style={{ height: '30%', marginTop: '10px' }}
              />
            </Grid>
            <Grid item xs={7} style={{ textAlign: 'right' }}>
              <LogoutButton />
              <Link to="/mypage" style={{ textDecoration: 'none' }}>
                <PCButton>My Page</PCButton>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <TagsInput
        selectedTags={handleSelectedTags}
        variant="outlined"
        id="tags"
        name="tags"
        placeholder="Search Item by Keyword"
      />
      <div style={{ justifyContent: 'center', display: 'flex' }}>
        {isPC ? (
          <InfiniteProductsPC {...props} searchKeywords={searchKeywords} />
        ) : isLaptop ? (
          <InfiniteProductsLaptop {...props} searchKeywords={searchKeywords} />
        ) : isTablet ? (
          <InfiniteProductsTablet {...props} searchKeywords={searchKeywords} />
        ) : (
          <InfiniteProductsMobile {...props} searchKeywords={searchKeywords} />
        )}
      </div>
    </>
  );
};

export default Main;
