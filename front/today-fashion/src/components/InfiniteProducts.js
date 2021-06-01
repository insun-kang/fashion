import { useEffect } from 'react';
import ProductCard from './ProductCard';

const InfiniteProducts = ({ mainProducts }) => {
  //   const [items, setItems] = useState({curItems: 10, preItems: 0})

  const infiniteScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight) {
      console.log('scroll end');
      //새로운 데이터 불러오기
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', infiniteScroll, true);
    return () => {
      window.removeEventListener('scroll', infiniteScroll);
    };
  }, []);

  if (mainProducts === undefined) {
    return null;
  }
  return (
    <div className="products-container">
      {mainProducts.map((product, index) => (
        <div key={index}>
          <ProductCard productData={product} />
        </div>
      ))}
    </div>
  );
};

export default InfiniteProducts;
