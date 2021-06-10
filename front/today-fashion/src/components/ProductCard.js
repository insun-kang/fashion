import React, { memo, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardActionArea,
  CardMedia,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Link } from 'react-router-dom';
import { handleBookMark } from './productCardFunctions';
import ProductCardDetail from './ProductCardDetail';
// import lottie from 'lottie-web';
import animationData from '../lotties/58790-favourite-animation.json';
import Lottie from 'react-lottie';
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
}));

const ProductCard = memo(
  (props) => {
    const { productData, isSelected } = props;
    const classes = useStyles();
    const [isBookMarked, setIsBookMarked] = useState(productData.bookmark);
    const [isClicked, setIsClicked] = useState(false);
    // https://codesandbox.io/s/b7pg4?file=/src/components/UncontrolledLottie.jsx
    //https://github.com/chenqingspring/react-lottie/issues/81
    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };
    console.log('isBookmarked', isBookMarked, 'isClicked', isClicked);
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
            <div className="card-img">
              <CardMedia
                className={classes.media}
                image={productData.image}
                title={productData.title}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('click lottie');
                  if (!isBookMarked) {
                    setIsClicked(true);
                  }
                  setIsBookMarked(!isBookMarked);
                  handleBookMark({ asin: productData.asin });
                }}
                style={
                  isClicked
                    ? {
                        background: 'inherit',
                        border: 'none',
                        boxShadow: 'none',
                      }
                    : isBookMarked
                    ? { width: 50, height: 50, backgroundColor: 'red' }
                    : { width: 50, height: 50, backgroundColor: 'grey' }
                }
              >
                {isClicked && isBookMarked && (
                  <Lottie
                    options={defaultOptions}
                    isClickToPauseDisabled
                    width={'50px'}
                    height={'50px'}
                    speed={2}
                    eventListeners={[
                      {
                        eventName: 'complete',
                        callback: () => {
                          setIsClicked(!isClicked);
                        },
                      },
                    ]}
                  />
                )}
              </button>
              <div>긍정 수치 {productData.posReveiwRate}</div>
              {productData.keywords.map((keyword, idx) => (
                <div key={idx}>{keyword}</div>
              ))}
            </div>
            <div className="card-text-upper">
              <div>{productData.starRating}</div>
              <div>${productData.price}</div>
              <div>{productData.title}</div>
            </div>
            <div className="card-text-lower">
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                ></AccordionSummary>
                <AccordionDetails>
                  <div>good point</div>
                  <div>{productData.nlpResults.posReviewSummary}</div>
                  <div>bad point</div>
                  <div>{productData.nlpResults.negReviewSummary}</div>
                  <a
                    href={productData.productUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    buy in amazon
                  </a>
                </AccordionDetails>
              </Accordion>
            </div>
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
