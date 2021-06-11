import { memo } from 'react';
import { useDrag, useDrop } from 'react-dnd';
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
const CoordinateCard = memo((props) => {
  const { asin, image, title, moveCard, findCard, addCard } = props;
  const originalIndex = findCard(asin).index;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: { asin, image, title },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { asin: droppedAsin, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveCard(droppedAsin, originalIndex);
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
    <Grid
      item
      xs={4}
      ref={(node) => drag(drop(node))}
      style={{ ...style, opacity }}
    >
      <img src={image} alt={title} />
    </Grid>
  );
});

export default CoordinateCard;
