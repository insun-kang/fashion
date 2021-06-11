import { memo } from 'react';
import { useDrag } from 'react-dnd';
import { Grid } from '@material-ui/core';

const ItemTypes = {
  CARD: 'card',
};
const style = {
  width: 200,
  height: 200,
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};
const WardrobeCard = memo(({ idx, asin, image, title, setIsPending }) => {
  const [{ isDragging, getItem }, drag] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: { asin, image, title },
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
        src={image}
        alt={title}
        onLoad={() => {
          if (idx === 0) {
            setIsPending(false);
          }
        }}
      />
    </div>
  );
});

export default WardrobeCard;
