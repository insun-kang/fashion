import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import GameCard from '../components/GameCard';
import { SERVER_URL } from '../config';
import {
  gameBackGroundImgs,
  gameCount,
  gameQuestionsData,
} from '../states/state';
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

const Game = () => {
  //TODO: 첫 게임일 경우 게임 3번 이상부터 결과보기 버튼 생성
  const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
  const limitNum = 10;
  const [background, setBackground] = useRecoilState(gameBackGroundImgs); //배경 이미지
  const [questions, setQuestions] = useRecoilState(gameQuestionsData); //배경문구 , 게임문항
  const [totalPlayNum, setTotalPlayNum] = useRecoilState(gameCount);
  const [initPlayNum, setInitPlayNum] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  // 현재 요청한 게임중에서 몇번째 게임 진행중인지 (0-9)
  const [isPending, setIsPending] = useState(true);
  // isPending === true 이면 로딩중
  const [isMore, setIsMore] = useState(true);

  axios.defaults.baseURL = SERVER_URL;
  axios.defaults.headers.common['Authorization'] = AuthStr;

  const getBackGroundData = useCallback(async () => {
    try {
      const res = await axios.post('/back-card', { limitNum });
      setBackground(res.data.productsList);
    } catch (error) {
      console.log(error.response);
    }
  }, [limitNum]);

  const getQuestions = useCallback(async () => {
    try {
      const res = await axios.get('/maincard');
      if (res.data.products.length === 0) {
        setIsMore(false);
        setIsPending(false);
      }
      setQuestions(res.data.products);
      setInitPlayNum(res.data.userPlayNum);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const sendAnswer = useCallback(async (data) => {
    try {
      const res = await axios.post('/maincard', data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleAnswerClick = useCallback(
    (asin, preference) => {
      setQuestionIdx(questionIdx + 1);
      sendAnswer({ asin: asin, loveOrHate: preference });
      if (questionIdx === 9) {
        //if (questionIdx === questions?.products?.length - 1) { 로 고치고 싶은데..
        setIsPending(true);
        setQuestions();
        setInitPlayNum(totalPlayNum);
        setQuestionIdx(0);
        getQuestions();
      }
    },
    [questionIdx, sendAnswer, getQuestions, totalPlayNum]
  );
  useEffect(() => {
    getBackGroundData();
    getQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initPlayNum !== undefined && questionIdx !== undefined) {
      setTotalPlayNum(initPlayNum + questionIdx + 1);
    }
  }, [initPlayNum, questionIdx]);

  return (
    <div className="game-container">
      <div>게임화면</div>
      {isPending && (
        <div
          style={{
            position: 'absolute',
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
      <div>{isPending ? null : totalPlayNum}</div>
      {totalPlayNum > 5 && (
        <Link to="/main">
          <input type="button" value="see result" />
        </Link>
      )}
      {!isMore && 'No game left!'}
      {/* pending일때도 result 보기 할 수 있게 수정*/}
      <div className="background">
        {background &&
          background.map((product, idx) => (
            <img
              src={product.productImage}
              alt={product.productTitle}
              key={idx}
            />
          ))}
      </div>
      {questions &&
        isMore &&
        questions.map((question, idx) => {
          let zIndex = 10 - idx;
          if (idx < questionIdx) {
            zIndex *= -1;
          }
          return (
            <div
              key={idx}
              style={{
                zIndex: zIndex,
                position: 'absolute',
                top: '100px',
                left: '500px',
                //위치 임의로 지정함
                backgroundColor: 'white',
                //backgroundColor을 지정해주지 않으면 뒤의 게임 문항이 비쳐보임. 필수!
                width: '300px',
                height: '500px',
                display: isPending ? 'none' : 'block',
              }}
            >
              <GameCard
                questionData={question}
                handleAnswerClick={handleAnswerClick}
                setIsPending={setIsPending}
              />
            </div>
          );
        })}
    </div>
  );
};

export default Game;
