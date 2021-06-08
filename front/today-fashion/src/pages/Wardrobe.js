import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';
import CoordinateCard from '../components/CoordinateCard';
import WardrobeCard from '../components/WardrobeCard';
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
const items1 = [
  {
    asin: 'B0000AWRIF',
    img: 'B0000AWRIF',
  },
  {
    asin: 'B0000AWHAA',
    img: 'B0000AWHAA',
  },
  {
    asin: 'B0000ERQV7',
    img: 'B0000ERQV7',
  },
  {
    asin: 'B0000YBW8A',
    img: 'B0000YBW8A',
  },
  {
    asin: 'B0000ZH45Y',
    img: 'B0000ZH45Y',
  },
  {
    asin: 'B00015EJTC',
    img: 'B00015EJTC',
  },
  {
    asin: 'B00019VMTI',
    img: 'B00019VMTI',
  },
];
const items2 = [
  {
    asin: 'B0002V45ZS',
    img: 'B0002V45ZS',
  },
  {
    asin: 'B00008JWXH',
    img: 'B00008JWXH',
  },
  {
    asin: 'B0000AGQ35',
    img: 'B0000AGQ35',
  },
  {
    asin: 'B0000AWOBT',
    img: 'B0000AWOBT',
  },
  {
    asin: 'B0000BUXB5',
    img: 'B0000BUXB5',
  },
  {
    asin: 'B0001ML754',
    img: 'B0001ML754',
  },
  {
    asin: 'B00RJMSOEQ',
    img: 'B00RJMSOEQ',
  },
];

const Wardrobe = () => {
  const [coordinateItems, setCoordinateItems] = useState(items2);
  const [bookmarkItems, setBookMarkItems] = useState(items1);

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
      if (!coordinateItems.includes(item)) {
        setCoordinateItems(
          update(coordinateItems, {
            $splice: [[atIndex, 0, item]],
          })
        );
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

  //didmount 시점에 찜한 상품, 코디 상품 불러오기
  useEffect(() => {}, []);

  const handleSaveButton = () => {
    //백엔드에 요청 보내기
  };
  const handleClearButton = () => {
    setCoordinateItems([]);
    //백엔드에도 요청 보내기
  };

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: (item, monitor) => {
        const isOver = monitor.isOver({ shallow: true });
        if (!coordinateItems.includes(item) && isOver) {
          setCoordinateItems(
            update(coordinateItems, {
              $push: [item],
            })
          );
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
              img={card.img}
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
        <input type="button" value="share" />
      </div>
      <div style={style}>
        {bookmarkItems.map((card) => (
          <WardrobeCard key={card.asin} asin={card.asin} img={card.img} />
        ))}
      </div>
    </>
  );
};

export default memo(Wardrobe);
