import { memo } from 'react';
import { useDrag } from 'react-dnd';

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
const WardrobeCard = memo(({ asin, image, title }) => {
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
      <img style={{ width: '100%', height: '100%' }} src={image} alt={title} />
    </div>
  );
});

export default WardrobeCard;
