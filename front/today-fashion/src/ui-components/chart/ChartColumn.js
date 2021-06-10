import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  compo: {
    boxShadow: '0 0 15px 0 rgba(0, 0, 0, 0)',
  },
  img: {
    dropShadow: '0 0 15px 0 rgba(0, 0, 0, 0)',
  },
}));

export default function ChartColumn(props) {
  const { data } = props;
  console.log(data);
  const height = data * 150;
  const percent = data * 100;
  console.log(height);
  const [isPositive, setIsPositive] = useState(true);

  useEffect(() => {
    if (data < 0.5) {
      setIsPositive(false);
    } else if (data >= 0.5) {
      setIsPositive(true);
    }
  }, [data]);

  const primary = isPositive ? '#6eb1e9' : '#aba0db';
  const classes = useStyles();
  const level = data > 0.55 ? -3 : 75 - height;

  return (
    <>
      <div position="relative" minHeight="250px" width="50px">
        <div
          className={classes.compo}
          style={{
            position: 'absolute',
            height: '150px',
            width: '12px',
            borderColor: primary,
            border: `2px solid ${primary}`,
            borderRadius: '10px',
          }}
        />
        <div
          className={classes.compo}
          style={{
            position: 'absolute',
            top: 150 - height,
            width: '12px',
            height: height,
            backgroundColor: primary,
            borderRadius: '10px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '17px',
            top: level,
          }}
        >
          <p style={{ color: primary, fontWeight: 700, minWidth: '43px' }}>
            {percent}%
          </p>
          {isPositive ? (
            <img
              src="./image/like.png"
              height="50px"
              width="43px"
              className={classes.img}
            />
          ) : (
            <img
              src="./image/dislike.png"
              height="50px"
              width="43px"
              className={classes.img}
            />
          )}
        </div>
      </div>
    </>
  );
}
