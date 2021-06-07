import { memo } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
  CARD: 'card',
};
const style = {
  width: 200,
  height: 200,
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};
const WardrobeCard = memo(({ asin, img }) => {
  const [{ isDragging, getItem }, drag] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: { asin, img },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        getItem: monitor.getItem(),
      }),
    }),
    [ItemTypes.CARD]
  );

  const opacity = isDragging ? 0 : 1;
  return (
    <div ref={drag} style={{ ...style, opacity }}>
      <img
        style={{ width: '100%', height: '100%' }}
        src={`https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${img}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=SL250`}
      />
    </div>
  );
});

export default WardrobeCard;
