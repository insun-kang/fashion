import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  makeStyles,
} from '@material-ui/core';

const useNavBarStyles = makeStyles({
  navDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`,
  },
  linkText: {
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `white`,
  },
});
const navLinks = [
  { title: '취향찾기', path: '#' },
  { title: '키워드 검색', path: '#' },
  { title: '옷장', path: '#' },
];

const NavBar = () => {
  const classes = useNavBarStyles();

  return (
    <AppBar position="static">
      <Container>
        <Toolbar>오늘옷데</Toolbar>
        <List
          component="nav"
          aria-labelledby="main navigation"
          className={classes.navDisplayFlex}
        >
          {navLinks.map(({ title, path }) => (
            <a href={path} key={title} className={classes.linkText}>
              <ListItem button>
                <ListItemText primary={title} />
              </ListItem>
            </a>
          ))}
        </List>
      </Container>
    </AppBar>
  );
};

export default NavBar;
