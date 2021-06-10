import axios from 'axios';
import { useEffect, useState } from 'react';
import { SERVER_URL } from '../config';

const SharedWardrobe = ({ match, history }) => {
  const sharedItems = JSON.parse(decodeURIComponent(match.params.items));
  console.log(sharedItems);
  const [itemsData, setItemsData] = useState();

  axios.defaults.baseURL = SERVER_URL;

  const getItems = async () => {
    try {
      const res = await axios.post('/shared-page', { asins: sharedItems });
      setItemsData(res.data.cards);
    } catch (error) {}
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className="shared-container">
      {itemsData &&
        itemsData.map((item) => (
          <img key={item.asin} src={item.image} alt={item.title} />
        ))}
    </div>
  );
};

export default SharedWardrobe;
