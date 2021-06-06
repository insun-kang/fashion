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
              <IconButton
                color={isBookMarked ? 'secondary' : 'grey'}
                aria-label="add to favorites"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBookMarked(!isBookMarked);
                  handleBookMark({ asin: productData.asin });
                }}
              >
                <FavoriteIcon />
              </IconButton>
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
