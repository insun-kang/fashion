import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import { SERVER_URL } from '../config';
import useTrait from '../customHooks/useTrait';

const InfiniteProducts = ({ match, history, searchKeywords }) => {
  const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;

  const [isBottom, setIsBottom] = useState(false);
  const [mainProducts, setMainProducts] = useState([]);
  const [dataSize, setDataSize] = useState(24);
  // const [loading, setLoading] = useState(false);
  const [isMore, setIsMore] = useState(true);

  const pageNum = useTrait(0);
  const loading = useTrait(false);

  const dataSizeRef = useRef(dataSize);

  const setDataSizeRef = (cur) => {
    dataSizeRef.current = cur;
    setDataSize(cur);
  };

  axios.defaults.baseURL = SERVER_URL;
  axios.defaults.headers.common['Authorization'] = AuthStr;

  const getRecommendationResults = useCallback(
    async (num) => {
      num = typeof num !== 'undefined' ? num : pageNum.get();
      try {
        console.log(num);
        const res = await axios.post('/result-cards', {
          pageNum: num,
          dataSize: dataSize,
        });
        console.log(res);

        if (res.data.products.length === 0) {
          setIsMore(false);
          loading.set(false);
          return;
        }
        if (num === 0) {
          setMainProducts(res.data.products);
        } else {
          setMainProducts([...mainProducts].concat(res.data.products));
        }
        pageNum.set(num + 1);
        loading.set(false);
        setIsBottom(false);
      } catch (error) {
        if (error.response.data.errorCode === 'play_too_little') {
          //게임 진행 수가 없어서 게임화면으로 이동한다는 alert 띄워주기
          history.push('/game');
        }
        console.log(error);
      }
    },
    [mainProducts, dataSize]
  );

  const getSearchResults = useCallback(
    async (num) => {
      num = typeof num !== 'undefined' ? num : pageNum.get();
      try {
        console.log(pageNum.get());
        const res = await axios.post('/result-search', {
          pageNum: num,
          dataSize: dataSize,
          existingKeywords: searchKeywords,
        });
        console.log(res);
        if (res.data.cards.length === 0) {
          setIsMore(false);
          loading.set(false);
          return;
        }
        if (num === 0) {
          setMainProducts(res.data.cards);
        } else {
          setMainProducts([...mainProducts].concat(res.data.cards));
        }
        setIsBottom(false);
        pageNum.set(num + 1);
        loading.set(false);
      } catch (error) {
        console.log(error);
      }
    },
    [mainProducts, pageNum, dataSize, searchKeywords]
  );

  const infiniteScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight * 3 >= scrollHeight) {
      //완전히 스크롤 끝에 다다르기 전에 isBottom 선언
      //모든 디바이스에서 되는지는 확인 필요
      // console.log('scroll end');
      // console.log(dataSize, dataSizeRef);
      setIsBottom(true);
    }
  };

  const checkScrollSpeed = ((settings) => {
    settings = settings || {};

    let lastPos,
      newPos,
      timer,
      delta,
      delay = settings.delay || 50;

    function clear() {
      lastPos = null;
      delta = 0;
    }

    clear();

    return function () {
      newPos = window.scrollY;
      if (lastPos != null) {
        delta = newPos - lastPos;
      }
      lastPos = newPos;
      clearTimeout(timer);
      timer = setTimeout(clear, delay);
      return delta;
    };
  })();
  //즉시 실행을 해서 익명함수의 리턴 부분에 정의된 함수를 checkScrollSpeed에 할당

  const handleScrollSpeed = () => {
    const speed = checkScrollSpeed();
    const curDataSize = dataSizeRef.current;
    // console.log(speed);
    // 원래 딜레이가 없었는데 아래 조건문을 추가하며 딜레이가 약간 생겼다..
    // 어떻게 해결할지 모르겠음..
    if (speed <= 100 && curDataSize !== 24) {
      setDataSizeRef(24);
    } else if (speed <= 200 && curDataSize !== 36) {
      setDataSizeRef(36);
    } else if (speed > 400 && curDataSize !== 48) {
      setDataSizeRef(48);
    }
  };

  useEffect(() => {
    //useEffect가 세개라서 fetch 함수들이 여러번 실행되는거 고치는 지금보다 좋은 방법이 있을까?
    //근데 세개인데 왜 네번 실행되지?
    loading.set(true);
    getRecommendationResults();

    window.addEventListener('scroll', handleScrollSpeed, true);
    window.addEventListener('scroll', infiniteScroll, true);
    return () => {
      window.removeEventListener('scroll', infiniteScroll, false);
      window.removeEventListener('scroll', handleScrollSpeed, false);
    };
    //location deps로 해봐도 cleanup이 안된다ㅠㅠ
  }, []);

  useEffect(() => {
    pageNum.set(0);
    //키워드가 갱신되면 무조건 0페이지부터 데이터를 요청하게 된다
    if (!loading.get()) {
      loading.set(true);
      if (searchKeywords.length === 0) {
        // 키워드 없어지면 추천결과 다시 보여주기, 첫 페이지부터.
        // -> 캐싱 안되나? 나중에 기능 추가
        getRecommendationResults(0);
      } else {
        getSearchResults(0);
      }
    }
    console.log(searchKeywords);
  }, [searchKeywords]);

  useEffect(() => {
    if (isBottom && !loading.get() && isMore) {
      //더 불러오기
      //같은 호출을 여러번 하는 걸 막고싶은데...지금보다 더 좋은 방법이 있을까?
      loading.set(true);
      console.log(loading.get());
      console.log(dataSize, dataSizeRef);
      if (searchKeywords.length === 0) {
        getRecommendationResults();
      } else {
        getSearchResults();
      }
    }
  }, [isBottom]);

  if (!mainProducts || mainProducts.length === 0) {
    return null;
  }

  return (
    <div className="products-container">
      {mainProducts.map((product, index) => (
        <div key={index}>
          <ProductCard
            productData={product}
            isSelected={match.params.asin === product.asin}
          />
        </div>
      ))}
    </div>
  );
};

export default React.memo(
  InfiniteProducts,
  (prev, next) => prev.searchKeywords === next.searchKeywords
);
