import React from 'react';
import { styled } from '@material-ui/core/styles';
import { Grid, Card, CardMedia } from '@material-ui/core';
import { PCChip } from '../ui-components/@material-extend';
import { Block } from '../ui-components/Block';

const colorList = {
  0: 'primary',
  1: 'secondary',
  2: 'info',
  3: 'success',
  4: 'warning',
  5: 'error',
};

const styleBlock = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '& > *': { mx: '5px !important' },
};

const GameCard = (props) => {
  const { questionData, handleAnswerClick, setIsPending } = props;
  return (
    <Card
      style={{
        width: '500px',
        height: '600px',
      }}
    >
      <CardMedia
        sx={{ height: 500 }}
        image={questionData.image}
        title={questionData.title}
        onLoad={() => {
          setIsPending(false);
        }}
      />
      <Grid
        item
        xs={12}
        container
        justifyContent="center"
        spacing={2}
        height="80px"
      >
        {questionData.keywords.map((keyword, idx) => (
          <div style={{ margin: '5px' }}>
            <PCChip
              color={colorList[idx]}
              variant="filled"
              key={idx}
              label={keyword}
              style={{ fontSize: '10px' }}
            />
          </div>
        ))}
      </Grid>
      <Grid>
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
      </Grid>
    </Card>
  );
};

export default GameCard;
