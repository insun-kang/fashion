import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SERVER_URL } from '../config';

const Game = () => {
  //게임 한번 진행할때마다 post로 결과 보내주기
  const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
  const limitNum = 5;
  const [background, setBackground] = useState();
  const [questions, setQuestions] = useState();
  const [questionIdx, setQuestionIdx] = useState(0);
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
      setQuestions(res.data.products);
    } catch (error) {
      console.log(error);
    }
  }, [AuthStr]);

  const curQuestion = useMemo(() => {
    if (questions) {
      return questions[questionIdx];
    }
  }, [questions, questionIdx]);

  const sendAnswer = useCallback(
    async (data) => {
      try {
        const res = await axios.post(SERVER_URL + '/maincard', data, {
          headers: {
            Authorization: AuthStr,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    [AuthStr]
  );

  const handleAnswerClick = useCallback((preferrence) => {
    //questionIdx 갱신
    //(먼저 하는게 중요하다 post 로딩 시간 유저는 기다릴 필요 없음)
    //sendAnswer로 대답내용 post 요청 보내기
  }, []);

  useEffect(() => {
    getBackGroundData();
    getQuestions();
  }, [getBackGroundData, getQuestions]);

  return (
    <div className="game-container">
      <div>게임화면</div>
      <div className="background">
        {background &&
          background.map((product, idx) => (
            <img
              src={product.productImage}
              alt={product.productTitle}
              key={idx}
            />
          ))}
        {curQuestion && (
          <div className="question-card">
            {curQuestion.title}
            <input
              type="button"
              value="yes"
              onClick={() => {
                handleAnswerClick(1);
              }}
            />
            <input
              type="button"
              value="no"
              onClick={() => {
                handleAnswerClick(0);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
