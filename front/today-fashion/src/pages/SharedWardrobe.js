import axios from 'axios';
import { useEffect, useState } from 'react';
import { SERVER_URL } from '../config';
import LogoutButton from '../components/LogoutButton';
import { Container, Grid, Paper } from '@material-ui/core';
import { useMediaQuery } from '@material-ui/core';
import { PCButton } from '../ui-components/@material-extend';

const SharedWardrobe = ({ match, history }) => {
  const isTablet = useMediaQuery('(min-width: 800px)');
  const isLaptop = useMediaQuery('(min-width: 1280px');
  const isPC = useMediaQuery('(min-width: 1600px)');
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

  const giveWidth = isPC
    ? '1600px'
    : isLaptop || isTablet
    ? '800px'
    : undefined;
  return (
    <>
      <Container>
        <Grid width={window.innderWidth}>
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
          </Grid>
        </Grid>
      </Container>
      <div
        className="shared-container"
        style={{
          margin: 'auto',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          alignContent: 'space-around',
          width: giveWidth,
          paddingBottom: 100,
        }}
      >
        {itemsData &&
          itemsData.map((item) => (
            <Paper
              style={{
                maxWidth: '180px',
                overflow: 'hidden',
                marginLeft: '30px',
                marginRight: '30px',
                marginTop: '50px',
              }}
              elevation={3}
            >
              <img
                style={{ width: '100%', height: '100%' }}
                key={item.asin}
                src={item.image}
                alt={item.title}
              />
            </Paper>
          ))}
      </div>
    </>
  );
};

export default SharedWardrobe;
