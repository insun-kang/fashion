import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { SERVER_URL } from '../config';

const Game = () => {
  //게임 한번 진행할때마다 post로 결과 보내주기

  //TODO: 첫 게임일 경우 게임 3번 이상부터 결과보기 버튼 생성
  const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
  const limitNum = 5;
  const [background, setBackground] = useState();
  const [questions, setQuestions] = useState();
  const [questionIdx, setQuestionIdx] = useState(0);
  const [isPending, setIsPending] = useState(true);
  const [fetchQuestionCount, setFetchQuestionCount] = useState(0);

  const getBackGroundData = useCallback(async () => {
    try {
      const res = await axios.post(
        SERVER_URL + '/back-card',
        { limitNum: limitNum },
        {
          headers: {
            Authorization: AuthStr,
          },
        }
      );
      setBackground(res.data.productsList);
    } catch (error) {
      console.log(error.response);
    }
  }, [AuthStr, limitNum]);

  const getQuestions = useCallback(async () => {
    try {
      const res = await axios.get(SERVER_URL + '/maincard', {
        headers: {
          Authorization: AuthStr,
        },
      });
      setQuestions(res.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }, [AuthStr]);

  const sendAnswer = useCallback(
    async (data) => {
      try {
        const res = await axios.post(SERVER_URL + '/maincard', data, {
          headers: {
            Authorization: AuthStr,
          },
        });
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    [AuthStr]
  );

  const handleAnswerClick = useCallback(
    (asin, preference) => {
      console.log(asin);
      setQuestionIdx(questionIdx + 1);
      sendAnswer({ asin: asin, loveOrHate: preference });
      //questionIdx 갱신
      //(먼저 하는게 중요하다 유저는 post 로딩 시간 기다릴 필요 없음)
      //sendAnswer로 대답내용 post 요청 보내기
      if (questionIdx === 9) {
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

  const totalPlayNum = useMemo(
    () => fetchQuestionCount * 10 + questionIdx + 1,
    [fetchQuestionCount, questionIdx]
  );

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
                backgroundColor: 'white',
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
