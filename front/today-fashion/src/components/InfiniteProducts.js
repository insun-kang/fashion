import axios from 'axios';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import { SERVER_URL } from '../config';
import useTrait from '../customHooks/useTrait';
import animationData from '../lotties/58790-favourite-animation.json';
import Lottie from 'react-lottie';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const InfiniteProducts = ({ match, history, searchKeywords }) => {
  const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;

  const [isBottom, setIsBottom] = useState(false);
  const [mainProducts, setMainProducts] = useState([]);
  const [isMore, setIsMore] = useState(true);

  const pageNum = useTrait(0);
  const loading = useTrait(false);

  const requestHistory = useRef([0]);
  const dataSizeRef = useRef(24);
  const setDataSizeRef = (cur) => {
    dataSizeRef.current = cur;
  };

  axios.defaults.baseURL = SERVER_URL;
  axios.defaults.headers.common['Authorization'] = AuthStr;

  const getRecommendationResults = useCallback(
    async (num) => {
      num = typeof num !== 'undefined' ? num : pageNum.get();
      let dataSize = dataSizeRef.current;
      try {
        const res = await axios.post('/result-cards', {
          pageNum: num,
          dataSize: dataSize,
          requestHistory: requestHistory.current,
        });
        let history = [...requestHistory.current];
        history.push(dataSize);
        requestHistory.current = history;
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
    [mainProducts, dataSizeRef]
  );

  const getSearchResults = useCallback(
    async (num) => {
      num = typeof num !== 'undefined' ? num : pageNum.get();
      let dataSize = dataSizeRef.current;
      try {
        const res = await axios.post('/result-search', {
          pageNum: num,
          dataSize: dataSize,
          requestHistory: requestHistory.current,
          existingKeywords: searchKeywords,
        });
        console.log(res);
        let history = [...requestHistory.current];
        history.push(dataSize);
        requestHistory.current = history;

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
        pageNum.set(num + 1);
        loading.set(false);
        setIsBottom(false);
      } catch (error) {
        console.log(error);
      }
    },
    [mainProducts, pageNum, dataSizeRef, searchKeywords]
  );

  const infiniteScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight * 3 >= scrollHeight) {
      //완전히 스크롤 끝에 다다르기 전에 isBottom 선언
      //모든 디바이스에서 되는지는 확인 필요
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
    if (speed <= 100 && curDataSize !== 24) {
      setDataSizeRef(24);
    } else if (speed <= 200 && curDataSize !== 36) {
      setDataSizeRef(36);
    } else if (speed > 400 && curDataSize !== 48) {
      setDataSizeRef(48);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScrollSpeed, true);
    window.addEventListener('scroll', infiniteScroll, true);
    return () => {
      window.removeEventListener('scroll', infiniteScroll, false);
      window.removeEventListener('scroll', handleScrollSpeed, false);
    };
  }, []);

  useEffect(() => {
    //키워드가 갱신되면 무조건 0페이지부터 데이터를 요청하게 된다
    if (!loading.get()) {
      loading.set(true);
      pageNum.set(0);
      requestHistory.current = [0];
      setDataSizeRef(24);
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
  console.log(requestHistory);
  console.log(loading.get());
  return (
    <div className="products-container">
      {loading.get() && (
        <div
          style={{
            left: '50%',
            top: '30%',
          }}
        >
          <Lottie
            options={defaultOptions}
            width={'100px'}
            height={'100px'}
            isClickToPauseDisabled
          />
        </div>
      )}
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

export default memo(
  InfiniteProducts,
  (prev, next) => prev.searchKeywords === next.searchKeywords
);
