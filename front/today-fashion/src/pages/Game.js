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
import { LinearProgress, Paper } from '@material-ui/core';

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

  console.log(totalPlayNum);

  return (
    <div>
      {/*로티로 대체*/}
      <div>
        <div>{isPending && <LinearProgress />}</div>
        {/* <div>{isPending ? null : totalPlayNum}</div> */}

        {totalPlayNum > 5 && (
          <Link to="/main">
            <input type="button" value="see result" />
          </Link>
        )}
        {!isMore && 'No game left!'}
      </div>
      {/* pending일때도 result 보기 할 수 있게 수정*/}
      {/* <div className="background">
        {background &&
          background.map((product, idx) => (
            <img
              src={product.productImage}
              alt={product.productTitle}
              key={idx}
            />
          ))}
      </div> */}
      {questions &&
        isMore &&
        questions.map((question, idx) => {
          let zIndex = 30 - idx * 3;
          if (idx < questionIdx) {
            zIndex *= -1;
          }
          return (
            <>
              <div
                key={question.asin}
                style={{
                  zIndex: zIndex,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: isPending ? 'none' : 'flex',
                }}
              >
                <GameCard
                  questionData={question}
                  handleAnswerClick={handleAnswerClick}
                  setIsPending={setIsPending}
                />
              </div>
              <img
                src="./image/bg.jpg"
                width="100%"
                heigth="100%"
                style={{
                  position: 'absolute',
                  zIndex: zIndex - 1,
                }}
              />
              <Paper
                width={window.innerWidth}
                heigth={window.innerHeight}
                style={{
                  position: 'absolute',
                  zIndex: zIndex - 2,
                }}
              ></Paper>
            </>
          );
        })}
    </div>
  );
};

export default Game;
