import React, { memo, useCallback, useState } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import { ItemTypes } from './ItemTypes';
import WardrobeCard from '../components/WardrobeCard';
const style = {
  width: 400,
};
const bookmarkItems = [
  {
    id: 1,
    img: 'B0000AWRIF',
  },
  {
    id: 2,
    img: 'B0000AWHAA',
  },
  {
    id: 3,
    img: 'B0000ERQV7',
  },
  {
    id: 4,
    img: 'B0000YBW8A',
  },
  {
    id: 5,
    img: 'B0000ZH45Y',
  },
  {
    id: 6,
    img: 'B00015EJTC',
  },
  {
    id: 7,
    img: 'B00019VMTI',
  },
];

const Wardrobe = () => {
  const [cards, setCards] = useState(bookmarkItems);
  const findCard = useCallback(
    (id) => {
      const card = cards.filter((c) => `${c.id}` === id)[0];
      return {
        card,
        index: cards.indexOf(card),
      };
    },
    [cards]
  );

  const moveCard = useCallback(
    (id, atIndex) => {
      const { card, index } = findCard(id);
      setCards(
        update(cards, {
          $splice: [
            [index, 1],
            [atIndex, 0, card],
          ],
        })
      );
    },
    [findCard, cards, setCards]
  );

  const [, drop] = useDrop(() => ({ accept: ItemTypes.CARD }));
  return (
    <div ref={drop} style={style}>
      {cards.map((card) => (
        <WardrobeCard
          key={card.id}
          id={`${card.id}`}
          text={card.text}
          moveCard={moveCard}
          findCard={findCard}
        />
      ))}
    </div>
  );
};

export default memo(Wardrobe);
