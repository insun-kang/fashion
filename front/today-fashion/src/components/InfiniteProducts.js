import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { SERVER_URL } from '../config';

const InfiniteProducts = () => {
  const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
  const [isBottom, setIsBottom] = useState(false);
  const [mainProducts, setMainProducts] = useState([]);
  const [requestData, setRequestData] = useState({ pageNum: 0, dataSize: 10 });

  // const [itemNums, setItemNums] = useState(10);
  // TODO:
  // 스크롤을 완전히 끝까지 내리기 전에 새로운 데이터 호출하기
  // 스크롤 속도에 따라 데이터 호출하는 양 다르게 조절하기?

  axios.defaults.baseURL = SERVER_URL;
  axios.defaults.headers.common['Authorization'] = AuthStr;

  const getRecommendationResults = useCallback(async () => {
    try {
      const res = await axios.get('/result-cards');
      // setTimeout(() => {
      //   setMainProducts([...mainProducts].concat([...mainProducts]));
      // }, 500);
      setMainProducts([...mainProducts].concat(res.data.products));
      setIsBottom(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const infiniteScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight + 500 >= scrollHeight) {
      //완전히 스크롤 끝에 다다르기 전에 isBottom 선언
      console.log('scroll end');
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
  // const checkScrollSpeed = initializeScroll();
  //즉시 실행을 해서 익명함수의 리턴 부분에 정의된 함수를 checkScrollSpeed에 할당

  const handleScrollSpeed = () => {
    // requestData.dataSize의 변화가 있어도 handleScrollSpeed는 못 알아챔
    // useCallback도 사용해봤으나 소용없음

    // speed를 state로 설정하면? 너무 자주 re-render 될 것 같아서 안됨,
    // 동기적으로 작동하므로 즉시 speed 변화를 알아채지 못하지 않나?
    const speed = checkScrollSpeed();
    console.log(speed, requestData.dataSize);
    if (speed >= 200 && requestData.dataSize === 10) {
      console.log('dataSize 증가');
      setRequestData({ ...requestData, dataSize: 20 });
    }
    if (speed < 200 && requestData.dataSize === 20) {
      console.log('dataSize 감소');
      setRequestData({ ...requestData, dataSize: 10 });
    }
  };

  useEffect(() => {
    //새로고침 없이 re-render만 되면 scroll 이벤트가 계속 붙음...
    // 코딩할때만 나타나고 실사용할때는 안 나타나는 현상일까?
    //mdn에 의하면 같은 event는 discard 된다는데 https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#multiple_identical_event_listeners
    //getEventListeners(window) 하면 4개로 보임. 출력되는 값도 중복개수만큼 중복됨
    getRecommendationResults();
    window.addEventListener('scroll', handleScrollSpeed, true);
    window.addEventListener('scroll', infiniteScroll, true);
    return () => {
      window.removeEventListener('scroll', infiniteScroll, false);
      window.removeEventListener('scroll', handleScrollSpeed, false);
    };
  }, []);

  useEffect(() => {
    if (isBottom) {
      //더 불러오기
      //setIsBottom(false); // api 호출할 수 있게되면 삭제!!
      console.log(requestData);
      setTimeout(() => {
        setMainProducts(
          [...mainProducts].concat([...mainProducts].slice(0, 3))
        );
      }, 500);
      setIsBottom(false);
    }
  }, [isBottom]);

  if (mainProducts.length === 0) {
    return null;
  }

  return (
    <div className="products-container">
      {mainProducts.map((product, index) => (
        <div key={index}>
          <ProductCard productData={product} />
        </div>
      ))}
    </div>
  );
};

export default InfiniteProducts;
