import React, { memo, useRef, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Grid,
  Rating,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
} from '@material-ui/core';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import { makeStyles } from '@material-ui/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Favorite from '@material-ui/icons/Favorite';
import SentimentDissatisfiedRoundedIcon from '@material-ui/icons/SentimentDissatisfiedRounded';
import { Link } from 'react-router-dom';
import { handleBookMark } from './productCardFunctions';
import ProductCardDetail from './ProductCardDetail';
// import lottie from 'lottie-web';
import heartAnimationData from '../lotties/58790-favourite-animation.json';
import alertAnimationData from '../lotties/surprised-emoji.json';
import Lottie from 'react-lottie';
import { ChartColumn } from '../ui-components/chart';
import { PCButton, PCChip, LCheckbox } from '../ui-components/@material-extend';
import { axios } from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '350px',
    borderRadius: '30px',
    boxShadow: '0 2px 10px 3px rgba(0, 0, 0, 0.1)',
    marginTop: '50px',
    marginBottom: '50px',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
}));

const heartDefaultOptions = {
  loop: false,
  autoplay: true,
  animationData: heartAnimationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const alertDefaultOptions = {
  loop: false,
  autoplay: true,
  animationData: alertAnimationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const ProductCard = memo(
  (props) => {
    const { productData, isSelected } = props;
    const classes = useStyles();
    const [isBookMarked, setIsBookMarked] = useState(productData.bookmark);
    const [isClicked, setIsClicked] = useState(false);
    const [isReported, setIsReported] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const countReport = useRef();
    // https://codesandbox.io/s/b7pg4?file=/src/components/UncontrolledLottie.jsx

    const handleReport = async () => {
      try {
        const res = await axios.post('/report', {
          asin: productData.asin,
        });
        //데이터 받아오기
      } catch (error) {
        console.log(error);
      }
    };

    const getReport = async () => {
      try {
        const res = await axios.post('/report_result', {
          asin: productData.asin,
        });
        countReport.current = res.data.reportCount;
        setIsAlertOpen(true);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <Card
        className={classes.root}
        onClick={() => {
          console.log('카드 클릭');
          console.log(productData.asin);
        }}
      >
        {!isSelected ? (
          <>
            <div>
              <div
                style={{
                  position: 'relative',
                  justifyContent: 'center',
                  display: 'flex',
                  paddingLeft: '25px',
                  paddingRight: '25px',
                  minHeight: '350px',
                  maxHeight: '450px',
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <img
                  src={productData.image}
                  alt={productData.title}
                  width="100%"
                  loading="lazy"
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '2%',
                    left: '80%',
                  }}
                >
                  <LCheckbox
                    checked={isBookMarked}
                    color="error"
                    style={{ fontSize: '40px' }}
                    icon={<FavoriteBorder style={{ fontSize: '40px' }} />}
                    checkedIcon={<Favorite style={{ fontSize: '40px' }} />}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (!isBookMarked) {
                        setIsClicked(true);
                      }
                      setIsBookMarked(!isBookMarked);
                      handleBookMark({ asin: productData.asin });
                    }}
                  />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '150px',
                    left: '5%',
                  }}
                >
                  <ChartColumn data={productData.posReveiwRate} />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '5%',
                  }}
                >
                  <div
                    style={{
                      textAlign: 'right',
                      width: '250px',
                      marginTop: '10px',
                    }}
                  >
                    {productData.keywords.map((keyword, idx) => (
                      <PCChip
                        color={
                          productData.posReveiwRate < 0.5
                            ? 'secondary'
                            : 'primary'
                        }
                        variant="contained"
                        key={keyword + idx}
                        label={keyword}
                        style={{
                          fontSize: '12px',
                          margin: '3px',
                          minWidth: '70px',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <CardContent>
              <div style={{ textAlign: 'left' }}>
                <a href={productData.productUrl}>
                  <img
                    src="./image/amazon.png"
                    height="20px"
                    align="right"
                    style={{ marginRight: '10px', marginTop: '10px' }}
                  />
                </a>
                <div style={{ marginBottom: '2px' }}>
                  <h6
                    style={{
                      margin: 0,
                      padding: 0,
                      fontWeight: 700,
                      fontSize: '25px',
                      float: 'left',
                    }}
                  >
                    $
                    {String(productData.price.toFixed(2)).slice(
                      0,
                      String(productData.price.toFixed(2)).length - 2
                    )}
                  </h6>
                  <h6
                    style={{
                      margin: 0,
                      paddingTop: '8px',
                      fontWeight: 700,
                      fontSize: '18px',
                    }}
                  >
                    {String(productData.price.toFixed(2)).slice(-2)}
                  </h6>
                </div>
                <Rating
                  defaultValue={productData.starRating}
                  size="small"
                  readOnly
                />
                <p
                  style={{
                    margin: 0,
                    padding: 0,
                    fontWeight: 600,
                    fontSize: '18px',
                  }}
                >
                  {productData.title}
                </p>
                <div>
                  <Accordion
                    style={{
                      boxShadow: 'none',
                      borderWidth: 0,
                      width: '100%',
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    <AccordionSummary
                      style={{
                        margin: 0,
                        padding: 0,
                        height: '10px',
                        width: '100%',
                      }}
                    >
                      <div style={{ margin: '0 auto' }}>
                        <ExpandMoreIcon fontWeight={600} />
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          getReport();
                        }}
                        style={{
                          background: 'inherit',
                          border: 'none',
                          boxShadow: 'none',
                        }}
                      >
                        <SentimentDissatisfiedRoundedIcon
                          style={{
                            width: 50,
                            height: 50,
                            fontSize: '10px',
                            cursor: 'pointer',
                          }}
                        />
                      </Button>

                      <Dialog
                        open={isAlertOpen}
                        onClose={() => {
                          setIsAlertOpen(false);
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {'Do you want to report this product?'}
                        </DialogTitle>
                        <DialogContent>
                          <Lottie
                            options={alertDefaultOptions}
                            isClickToPauseDisabled
                            width={'50px'}
                            height={'50px'}
                          />
                          <DialogContentText id="alert-dialog-description">
                            This product is currently reported{' '}
                            {countReport.current}
                            &nbsp;times. If a product is frequently reported, it
                            can be deleted according to our inspection guide.
                            once when you report a product, you cannot undo it.
                            will you proceed?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => {
                              handleReport();
                              setIsAlertOpen(false);
                              setIsReported(true);
                            }}
                            color="primary"
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={() => {
                              setIsAlertOpen(false);
                            }}
                            color="primary"
                            autoFocus
                          >
                            No
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </AccordionSummary>
                    <AccordionDetails
                      style={{
                        margin: 0,
                        padding: 0,
                        width: '100%',
                      }}
                    >
                      <div
                        style={{
                          whiteSpace: 'nowrap',
                          marginBottom: '15px',
                        }}
                      >
                        <img
                          src="./image/good.png"
                          height="26px"
                          align="left"
                          style={{ marginRight: '4px' }}
                        />
                        <p
                          style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#6eb1e9',
                          }}
                        >
                          Good Point
                        </p>
                        <p style={{ fontSize: '12px', fontWeight: 300 }}>
                          {productData.posReveiwRate * 100}% of Customer were
                          Satisfied
                        </p>
                      </div>

                      <p fontWeight={400}>
                        {productData.nlpResults.posReviewSummary}
                      </p>
                      <br />
                      <br />
                      <div
                        style={{
                          whiteSpace: 'nowrap',
                          marginBottom: '15px',
                        }}
                      >
                        <img
                          src="./image/bad.png"
                          height="26px"
                          align="left"
                          style={{ marginRight: '4px' }}
                        />
                        <p
                          style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#aaa0da',
                          }}
                        >
                          Bad Point
                        </p>
                        <p style={{ fontSize: '12px', fontWeight: 300 }}>
                          {((1 - productData.posReveiwRate) * 100).toFixed(0)}%
                          of Customer were Unsatisfied
                        </p>
                      </div>
                      <p fontWeight={400}>
                        {productData.nlpResults.negReviewSummary}
                      </p>
                      <br />
                      <br />
                      <div
                        style={{
                          justifyContent: 'center',
                          display: 'flex',
                          marginBottom: '10px',
                        }}
                      >
                        <a
                          href={productData.productUrl}
                          style={{
                            color: 'inherit',
                            textDecoration: 'none',
                          }}
                        >
                          <Button
                            variant="contained"
                            style={{
                              width: '150px',
                              fontSize: '16px',
                              fontWeight: 600,
                              border: `2px solid primary`,
                            }}
                          >
                            buy in
                            <img
                              src="./image/amazonWhite.png"
                              height="14px"
                              style={{ marginLeft: '5px' }}
                            />
                          </Button>
                        </a>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>
            </CardContent>

            <Link
              to={`/main/${productData.asin}`}
              className={`card-open-link`}
            />
          </>
        ) : (
          <ProductCardDetail asin={productData.asin} />
        )}
      </Card>
    );
  },
  (prev, next) =>
    prev.isSelected === next.isSelected && prev.productData === next.productData
);

export default ProductCard;
