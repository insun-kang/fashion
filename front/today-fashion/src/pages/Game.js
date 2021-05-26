import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import GameCard from '../components/GameCard';
import { SERVER_URL } from '../config';

const Game = () => {
  //게임 한번 진행할때마다 post로 결과 보내주기
  const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
  const limitNum = 5;
  const [background, setBackground] = useState();
  const [questions, setQuestions] = useState();
  const [questionIdx, setQuestionIdx] = useState(0);
  const [isPending, setIsPending] = useState(true);

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

  // const curQuestion = useMemo(() => {
  //   if (questions?.products) {
  //     return questions.products[questionIdx];
  //   }
  // }, [questions, questionIdx]);

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
      //10개 넘어가면???에러처리 필요
      sendAnswer({ asin: asin, loveOrHate: preference });
      //questionIdx 갱신
      //(먼저 하는게 중요하다 유저는 post 로딩 시간 기다릴 필요 없음)
      //sendAnswer로 대답내용 post 요청 보내기
      if (questionIdx === 9) {
        setIsPending(true);
        setQuestionIdx(0);
        getQuestions();
      }
    },
    [questionIdx, sendAnswer, getQuestions]
  );

  useEffect(() => {
    getBackGroundData();
    getQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(()=>{
  //   if(isPending){
  //     setQuestionIdx(0);
  //   }
  // },[isPending])

  useEffect(() => {
    if (questions && questionIdx === 0) {
      setIsPending(false);
    }
  }, [questions, questionIdx]);

  console.log('pending', isPending);
  return (
    <div className="game-container">
      <div>게임화면</div>
      <div>{isPending && '로딩중'}</div>
      <div>
        {questionIdx}
        {questions && questions.bgSentence}
      </div>
      <div className="background">
        {background &&
          background.map((product, idx) => (
            <img
              src={product.productImage}
              alt={product.productTitle}
              key={idx}
            />
          ))}
        {!isPending && questions?.products && (
          <GameCard
            questionData={questions.products[questionIdx]}
            handleAnswerClick={handleAnswerClick}
          />
        )}
      </div>
    </div>
  );
};

export default Game;
