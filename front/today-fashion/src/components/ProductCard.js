// import React, { memo, useRef, useState } from 'react';
// import {
//   Accordion,
//   AccordionDetails,
//   AccordionSummary,
//   Button,
//   Card,
//   CardMedia,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from '@material-ui/core';
// import { makeStyles } from '@material-ui/styles';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import FavoriteIcon from '@material-ui/icons/Favorite';
// import SentimentDissatisfiedRoundedIcon from '@material-ui/icons/SentimentDissatisfiedRounded';
// import { Link } from 'react-router-dom';
// import { handleBookMark } from './productCardFunctions';
// import ProductCardDetail from './ProductCardDetail';
// // import lottie from 'lottie-web';
// import heartAnimationData from '../lotties/58790-favourite-animation.json';
// import alertAnimationData from '../lotties/surprised-emoji.json';
// import Lottie from 'react-lottie';
// import axios from 'axios';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     maxWidth: 345,
//   },
//   media: {
//     height: 0,
//     paddingTop: '56.25%', // 16:9
//   },
// }));

// const heartDefaultOptions = {
//   loop: false,
//   autoplay: true,
//   animationData: heartAnimationData,
//   rendererSettings: {
//     preserveAspectRatio: 'xMidYMid slice',
//   },
// };

// const alertDefaultOptions = {
//   loop: false,
//   autoplay: true,
//   animationData: alertAnimationData,
//   rendererSettings: {
//     preserveAspectRatio: 'xMidYMid slice',
//   },
// };

// const ProductCard = memo(
//   (props) => {
//     const { productData, isSelected } = props;
//     const classes = useStyles();
//     const [isBookMarked, setIsBookMarked] = useState(productData.bookmark);
//     const [isClicked, setIsClicked] = useState(false);
//     const [isReported, setIsReported] = useState(false);
//     const [isAlertOpen, setIsAlertOpen] = useState(false);
//     const countReport = useRef();
//     // https://codesandbox.io/s/b7pg4?file=/src/components/UncontrolledLottie.jsx

//     const handleReport = async () => {
//       try {
//         const res = await axios.post('/report', {
//           asin: productData.asin,
//         });
//         //데이터 받아오기
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     const getReport = async () => {
//       try {
//         const res = await axios.post('/report_result', {
//           asin: productData.asin,
//         });
//         countReport.current = res.data.reportCount;
//         setIsAlertOpen(true);
//         console.log(res);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     return (
//       <Card
//         className={classes.root}
//         onClick={() => {
//           console.log('카드 클릭');
//           console.log(productData.asin);
//         }}
//       >
//         {!isSelected ? (
//           <>
//             <div className="card-img">
//               <CardMedia
//                 className={classes.media}
//                 image={productData.image}
//                 title={productData.title}
//               />
//               {/* 좋아요 버튼 */}
//               <div>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     if (!isBookMarked) {
//                       setIsClicked(true);
//                     }
//                     setIsBookMarked(!isBookMarked);
//                     handleBookMark({ asin: productData.asin });
//                   }}
//                   style={{
//                     background: 'inherit',
//                     border: 'none',
//                     boxShadow: 'none',
//                   }}
//                 >
//                   {isClicked ? (
//                     <Lottie
//                       options={heartDefaultOptions}
//                       isClickToPauseDisabled
//                       width={'100px'}
//                       height={'100px'}
//                       style={{ left: 0 }}
//                       eventListeners={[
//                         {
//                           eventName: 'complete',
//                           callback: () => {
//                             setIsClicked(!isClicked);
//                           },
//                         },
//                       ]}
//                     />
//                   ) : (
//                     <FavoriteIcon
//                       style={
//                         isBookMarked
//                           ? {
//                               width: 50,
//                               height: 50,
//                               color: '#ff5239',
//                               fontSize: 40,
//                               padding: 10,
//                               marginTop: 20,
//                               cursor: 'pointer',
//                             }
//                           : {
//                               width: 50,
//                               height: 50,
//                               color: 'grey',
//                               fontSize: 40,
//                               padding: 10,
//                               marginTop: 20,
//                               cursor: 'pointer',
//                             }
//                       }
//                     />
//                   )}
//                 </button>

//                 {/* 신고버튼 */}
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     getReport();
//                   }}
//                   style={{
//                     background: 'inherit',
//                     border: 'none',
//                     boxShadow: 'none',
//                   }}
//                 >
//                   {!isAlertOpen && isReported ? (
//                     <Lottie
//                       options={alertDefaultOptions}
//                       isClickToPauseDisabled
//                       width={'50px'}
//                       height={'50px'}
//                       eventListeners={[
//                         {
//                           eventName: 'complete',
//                           callback: () => {
//                             setIsReported(false);
//                           },
//                         },
//                       ]}
//                     />
//                   ) : (
//                     <SentimentDissatisfiedRoundedIcon
//                       style={{
//                         width: 50,
//                         height: 50,
//                         fontSize: 40,
//                         padding: 10,
//                         marginTop: 20,
//                         cursor: 'pointer',
//                       }}
//                     />
//                   )}
//                 </button>
//               </div>

//               <Dialog
//                 open={isAlertOpen}
//                 onClose={() => {
//                   setIsAlertOpen(false);
//                 }}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//               >
//                 <DialogTitle id="alert-dialog-title">
//                   {'Do you want to report this product?'}
//                 </DialogTitle>
//                 <DialogContent>
//                   <DialogContentText id="alert-dialog-description">
//                     This product is currently reported {countReport.current}
//                     &nbsp;times. If a product is frequently reported, it can be
//                     deleted according to our inspection guide. once when you
//                     report a product, you cannot undo it. will you proceed?
//                   </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                   <Button
//                     onClick={() => {
//                       handleReport();
//                       setIsAlertOpen(false);
//                       setIsReported(true);
//                     }}
//                     color="primary"
//                   >
//                     Yes
//                   </Button>
//                   <Button
//                     onClick={() => {
//                       setIsAlertOpen(false);
//                     }}
//                     color="primary"
//                     autoFocus
//                   >
//                     No
//                   </Button>
//                 </DialogActions>
//               </Dialog>

//               <div>긍정 수치 {productData.posReveiwRate}</div>
//               {productData.keywords.map((keyword, idx) => (
//                 <div key={idx}>{keyword}</div>
//               ))}
//             </div>
//             <div className="card-text-upper">
//               <div>{productData.starRating}</div>
//               <div>${productData.price}</div>
//               <div>{productData.title}</div>
//             </div>
//             <div className="card-text-lower">
//               <Accordion>
//                 <AccordionSummary
//                   expandIcon={<ExpandMoreIcon />}
//                   aria-controls="panel1a-content"
//                   id="panel1a-header"
//                 ></AccordionSummary>
//                 <AccordionDetails>
//                   <div>good point</div>
//                   <div>{productData.nlpResults.posReviewSummary}</div>
//                   <div>bad point</div>
//                   <div>{productData.nlpResults.negReviewSummary}</div>
//                   <a
//                     href={productData.productUrl}
//                     target="_blank"
//                     rel="noreferrer"
//                   >
//                     buy in amazon
//                   </a>
//                 </AccordionDetails>
//               </Accordion>
//             </div>
//             <Link
//               to={`/main/${productData.asin}`}
//               className={`card-open-link`}
//             />
//           </>
//         ) : (
//           <ProductCardDetail asin={productData.asin} />
//         )}
//       </Card>
//     );
//   },
//   (prev, next) =>
//     prev.isSelected === next.isSelected && prev.productData === next.productData
// );

// export default ProductCard;
