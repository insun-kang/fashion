const GameCard = (props) => {
  const { questionData, handleAnswerClick } = props;
  return (
    <div className="question-card">
      <img alt={questionData.title} src={questionData.image}></img>
      {/* {questionData.keywords.map((keyword, idx) => (
        <div key={idx}>{keyword}</div>
      ))} */}
      {/* 백엔드에서 어레이로 넘겨주면 위 주석 해제 */}
      <input
        type="button"
        value="yes"
        onClick={() => {
          handleAnswerClick(questionData.asin, 1);
        }}
      />
      <input
        type="button"
        value="no"
        onClick={() => {
          handleAnswerClick(questionData.asin, 0);
        }}
      />
    </div>
  );
};

export default GameCard;
