import { useCallback } from 'react';

const Game = () => {
  //게임 한번 진행할때마다 post로 결과 보내주기
  const getBackGroundData = useCallback(() => {}, []);
  return (
    <div className="game-container">
      <div></div>
    </div>
  );
};

export default Game;
