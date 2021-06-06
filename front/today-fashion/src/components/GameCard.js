import React from 'react';
const GameCard = (props) => {
  const { questionData, handleAnswerClick, setIsPending } = props;
  return (
    <div className="question-card">
      <img
        alt={questionData.title}
        src={questionData.image}
        onLoad={() => {
          setIsPending(false);
        }}
      ></img>
      {questionData.keywords.map((keyword, idx) => (
        <div key={idx}>{keyword}</div>
      ))}
      <input
        type="button"
        value="yes"
        onClick={() => {
          handleAnswerClick(questionData.asin, 5);
        }}
      />
      <input
        type="button"
        value="no"
        onClick={() => {
          handleAnswerClick(questionData.asin, 1);
        }}
      />
    </div>
  );
};

export default GameCard;
