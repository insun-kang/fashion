import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardMedia,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
}));

const ProductCard = (props) => {
  const { productData } = props;
  const classes = useStyles();
  //찜하기 조작 필요
  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={productData.image}
        title={productData.title}
      />
      <div className="card-img">
        <IconButton
          color={productData.bookmark ? 'secondary' : 'grey'}
          aria-label="add to favorites"
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
            <a href={productData.productUrl} target="_blank">
              buy in amazon
            </a>
          </AccordionDetails>
        </Accordion>
      </div>
    </Card>
  );
};

export default ProductCard;
