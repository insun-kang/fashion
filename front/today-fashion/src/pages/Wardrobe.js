import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import CoordinateCard from '../components/CoordinateCard';
import WardrobeCard from '../components/WardrobeCard';
import axios from 'axios';
import { SERVER_URL } from '../config';
import KakaoShareButton from '../components/KaKaoShareButton';
import WardrobeNav from '../components/WardrobeNav';
import animationData from '../lotties/58790-favourite-animation.json';
import Preview, { usePreview } from 'react-dnd-preview';
import { Grid, Paper, Button, Tab, Container } from '@material-ui/core';
import LogoutButton from '../components/LogoutButton';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import { PCButton } from '../ui-components/@material-extend';
import { SpeedDial2 } from '../ui-components/@material-extend';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const ItemTypes = {
  CARD: 'card',
};

const generatePreview = ({ itemType, item, style }) => {
  console.log(item);

  return (
    <div className="item-list__item" style={style}>
      <div
        style={{
          color: 'white',
          fontWeight: 'bold',
          backgroundColor: '#C9DFF3',
          padding: '10px',
          borderRadius: '25px',
        }}
      >
        drop me!
      </div>
    </div>
  );
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
  const [isPending, setIsPending] = useState(true);
  const [isMobile, setIsMobile] = useState();

  axios.defaults.baseURL = SERVER_URL;
  axios.defaults.headers.common['Authorization'] = AuthStr;

  // const { display, itemType, previewItem, previewStyle, monitor } =
  //   usePreview();
  // console.log(display, itemType, previewItem, previewStyle, monitor);

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
      if (res.data.data[categories[selectedCategory]].length === 0) {
        setIsPending(false);
      }
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
    if ('ontouchstart' in window) {
      setIsMobile(true);
    }
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
    backgroundColor = '#F1F6FA';
  }
  return (
    <>
      <SpeedDial2 />
      <Container>
        <Grid>
          <Grid
            item
            xs={12}
            container
            spacing={1}
            style={{ marginTop: '10px' }}
          >
            <Grid item xs={5}>
              <img
                src="/image/onot.png"
                style={{ height: '30%', marginTop: '10px' }}
              />
            </Grid>
            <Grid item xs={7} style={{ textAlign: 'right' }}>
              <LogoutButton />
              <Link to="/mypage" style={{ textDecoration: 'none' }}>
                <PCButton>My Page</PCButton>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <hr style={{ border: `1px solid lightgrey` }} />
      <div
        style={{ marginTop: '5vh', marginLeft: '10vw', marginRight: '10vw' }}
      >
        <Grid container spacing={5} item xs={12}>
          <Grid item xs={6}>
            <Paper
              ref={drop}
              style={{
                padding: '20px',
                width: '100%',
                height: '70vh',
                overflowY: 'scroll',
              }}
            >
              <Grid container spacing={2}>
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
                      style={{
                        display: 'flex',
                        maxHeight: '100%',
                      }}
                    />
                  ) : null
                )}
              </Grid>
              {isMobile && <Preview generator={generatePreview} />}
            </Paper>
            <div
              style={{
                maxHeight: '40px',
                position: 'relative',
                textAlign: 'center',
              }}
            >
              <Button
                variant="contained"
                style={{ margin: '5px' }}
                onClick={handleClearButton}
              >
                <DeleteIcon />
              </Button>
              <Button
                variant="contained"
                style={{ margin: '5px' }}
                onClick={handleSaveButton}
              >
                <SaveAltIcon />
              </Button>
              <KakaoShareButton
                handleShareKakaoButton={handleShareKakaoButton}
                coordinateItems={coordinateItems}
                social={social}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <Paper
              style={{
                padding: '20px',
                width: '100%',
                height: '70vh',
                overFlowY: 'scroll',
                display: 'flex',
                position: 'relative',
              }}
            >
              <Grid container spacing={2}>
                {bookmarkItems &&
                  bookmarkItems.map((card, idx) => (
                    <WardrobeCard
                      idx={idx}
                      key={card.asin}
                      asin={card.asin}
                      image={card.image}
                      setIsPending={setIsPending}
                    />
                  ))}
              </Grid>
            </Paper>
            <div style={{}}>
              <WardrobeNav
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setIsPending={setIsPending}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default memo(Wardrobe);
