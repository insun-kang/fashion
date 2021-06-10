import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import CoordinateCard from '../components/CoordinateCard';
import WardrobeCard from '../components/WardrobeCard';
import axios from 'axios';
import { SERVER_URL } from '../config';
import KakaoShareButton from '../components/KaKaoShareButton';
import WardrobeNav from '../components/WardrobeNav';
const ItemTypes = {
  CARD: 'card',
};
const style = {
  width: '800px',
  height: '600px',
  overflow: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
  border: '1px solid black',
};

const Wardrobe = () => {
  const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
  const categories = ['overall', 'top', 'bottom', 'etc'];

  const [coordinateItems, setCoordinateItems] = useState([]);
  const [totalBookMarkItems, setTotalBookMarkItems] = useState();
  const [bookmarkItems, setBookMarkItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [social, setSocial] = useState({ totalBookmark: 0, totalShared: 0 });
  const [shareUrl, setShareUrl] = useState();
  axios.defaults.baseURL = SERVER_URL;
  axios.defaults.headers.common['Authorization'] = AuthStr;

  const findCard = useCallback(
    (asin) => {
      const card = coordinateItems.filter((c) => {
        return c?.asin === asin;
      })[0];
      return {
        card,
        index: coordinateItems.indexOf(card),
      };
    },
    [coordinateItems]
  );

  const moveCard = useCallback(
    (asin, atIndex) => {
      const { card, index } = findCard(asin);
      if (card) {
        setCoordinateItems(
          update(coordinateItems, {
            $splice: [
              [index, 1],
              [atIndex, 0, card],
            ],
          })
        );
      }
    },
    [findCard, coordinateItems, setCoordinateItems]
  );

  const addCard = useCallback(
    (item, atIndex) => {
      const found = coordinateItems.some((each) => each.asin === item.asin);
      const isLimit = coordinateItems.length === 6 ? true : false;
      if (!found) {
        if (!isLimit) {
          setCoordinateItems(
            update(coordinateItems, {
              $splice: [[atIndex, 0, item]],
            })
          );
        } else {
          setCoordinateItems(
            update(coordinateItems, { [atIndex]: { $set: item } })
          );
        }
      } else {
        const { card, index } = findCard(item.asin);
        setCoordinateItems(
          update(coordinateItems, {
            $splice: [
              [index, 1],
              [atIndex, 0, card],
            ],
          })
        );
      }
    },
    [setCoordinateItems, coordinateItems]
  );

  const getBookmarkItems = useCallback(async () => {
    try {
      const res = await axios.get('/closet');
      setTotalBookMarkItems(res.data.data);
      setBookMarkItems(res.data.data[categories[selectedCategory]]);
    } catch (error) {}
  }, []);

  const getCoordinateItems = useCallback(async () => {
    try {
      const res = await axios.get('/load-cody');
      setCoordinateItems(res.data.cards);
    } catch (error) {}
  }, []);

  //didmount 시점에 찜한 상품, 코디 상품 불러오기
  useEffect(() => {
    getBookmarkItems();
    getCoordinateItems();
  }, []);

  useEffect(() => {
    if (totalBookMarkItems) {
      setBookMarkItems(totalBookMarkItems[categories[selectedCategory]]);
    }
  }, [selectedCategory]);
  useEffect(() => {
    if (coordinateItems) {
      setShareUrl(
        window.location.href +
          '/' +
          encodeURIComponent(
            JSON.stringify(coordinateItems.map((item) => item.asin))
          )
      );
    }
  }, [coordinateItems]);
  const handleSaveButton = async () => {
    const sharedData = [...coordinateItems];
    const data = sharedData.map((item) => item.asin);
    try {
      const res = await axios.post('/save-cody', { asins: data });
      setSocial({
        totalBookmark: res.data.totalBookmark,
        totalShared: res.data.totalShared,
      });
    } catch (error) {}
  };

  const handleClearButton = async () => {
    setCoordinateItems([]);
    try {
      await axios.get('/delete-cody');
    } catch (error) {}
  };

  const handleShareKakaoButton = async () => {
    const sharedData = [...coordinateItems];
    const data = sharedData.map((item) => item.asin);
    try {
      await axios.post('/shared-page', { asins: data });
      console.log('send');
    } catch (error) {}
    //공유된 상품 백엔드에 알려주기
  };

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: (item, monitor) => {
        const isOver = monitor.isOver({ shallow: true });
        const found = coordinateItems.some((each) => each.asin === item.asin);
        const isLimit = coordinateItems.length === 6 ? true : false;
        if (!found && isOver) {
          if (isLimit) {
            setCoordinateItems(update(coordinateItems, { 5: { $set: item } }));
          } else {
            setCoordinateItems(
              update(coordinateItems, {
                $push: [item],
              })
            );
          }
        }
      },
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
      }),
    }),
    [coordinateItems, setCoordinateItems]
  );
  const isActive = canDrop && isOver;

  let backgroundColor;
  if (isActive) {
    backgroundColor = '#B2CFF1';
  }
  return (
    <>
      <div ref={drop} style={{ ...style, backgroundColor }}>
        {coordinateItems.map((card) =>
          card ? (
            <CoordinateCard
              key={card.asin}
              asin={card.asin}
              image={card.image}
              title={card.title}
              moveCard={moveCard}
              findCard={findCard}
              addCard={addCard}
            />
          ) : null
        )}
      </div>
      <div className="coordinate-button-group">
        <input type="button" value="clear" onClick={handleClearButton} />
        <input type="button" value="save" onClick={handleSaveButton} />
        {
          <KakaoShareButton
            handleShareKakaoButton={handleShareKakaoButton}
            coordinateItems={coordinateItems}
            social={social}
          />
        }
      </div>
      <div style={style}>
        {bookmarkItems &&
          bookmarkItems.map((card) => (
            <WardrobeCard key={card.asin} asin={card.asin} image={card.image} />
          ))}
      </div>
      <WardrobeNav
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </>
  );
};

export default memo(Wardrobe);
