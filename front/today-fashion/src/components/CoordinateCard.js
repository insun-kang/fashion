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
const CoordinateCard = memo((props) => {
  const { asin, img, moveCard, findCard, addCard } = props;
  const originalIndex = findCard(asin).index;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: { asin, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { asin: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveCard(droppedId, originalIndex);
        }
      },
    }),
    [asin, originalIndex, moveCard]
  );
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      canDrop: () => false,
      hover(dragged, monitor) {
        const { index: overIndex } = findCard(asin);
        if (dragged.asin !== asin) {
          const getItem = monitor.getItem();
          if (getItem) {
            console.log(getItem.asin);
            addCard(getItem, overIndex);
          } else {
            moveCard(dragged.asin, overIndex);
          }
        }
      },
      collect: (monitor) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
    }),
    [findCard, moveCard]
  );
  const opacity = isDragging ? 0 : 1;
  return (
    <div ref={(node) => drag(drop(node))} style={{ ...style, opacity }}>
      <img
        style={{ width: '100%', height: '100%' }}
        src={`https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${img}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=SL250`}
      />
    </div>
  );
});

export default CoordinateCard;
