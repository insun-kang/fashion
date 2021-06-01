import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { SERVER_URL } from '../config';

const Game = () => {
  //TODO: 첫 게임일 경우 게임 3번 이상부터 결과보기 버튼 생성
  const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
  const limitNum = 5;
  const [background, setBackground] = useState(); //배경 이미지
  const [questions, setQuestions] = useState(); //배경문구 , 게임문항
  const [questionIdx, setQuestionIdx] = useState(0);
  //현재 요청한 게임중에서 몇번째 게임 진행중인지 (0-9)
  const [isPending, setIsPending] = useState(true);
  //isPending === true 이면 로딩중
  const [fetchQuestionCount, setFetchQuestionCount] = useState(0);
  // maincard api에 get 요청 한 횟수

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
      setQuestions(res.data);
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
        setQuestionIdx(0);
        getQuestions();
        setFetchQuestionCount(fetchQuestionCount + 1);
      }
    },
    [questionIdx, sendAnswer, getQuestions, fetchQuestionCount]
  );
  useEffect(() => {
    getBackGroundData();
    getQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPlayNum = fetchQuestionCount * 10 + questionIdx + 1;

  return (
    <div className="game-container">
      <div>게임화면</div>
      <div>{isPending && '로딩중'}</div>
      <div>
        {totalPlayNum ? totalPlayNum : null}
        {questions && questions.bgSentence}
      </div>
      {!isPending && totalPlayNum && (
        <Link to="/main">
          <input type="button" value="see result" />
        </Link>
      )}
      {/* 결과보기 버튼 제한 더 붙이기 */}
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
      {questions?.products &&
        questions.products.map((question, idx) => {
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
