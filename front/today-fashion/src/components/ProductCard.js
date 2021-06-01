const ProductCard = (props) => {
  const { productData } = props;
  //찜하기 조작 필요
  return (
    <div className="question-card">
      <div className="card-img">
        <img src={productData.image} alt={productData.title} />
        <button>찜하기 버튼 {productData.bookmark}</button>
        <div>긍정 수치 {productData.posReveiwRate}</div>
        <div>{productData.starRating}</div>
        {productData.keywords.map((keyword, idx) => (
          <div key={idx}>{keyword}</div>
        ))}
      </div>
      <div className="card-text-upper">
        <div>${productData.price}</div>
        <div>{productData.title}</div>
      </div>
      <div className="card-text-lower">
        <div>good point</div>
        <div>{productData.nlpResults.posReviewSummary}</div>
        <div>bad point</div>
        <div>{productData.nlpResults.negReviewSummary}</div>
        <a href={productData.productUrl} target="_blank">
          buy in amazon
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
