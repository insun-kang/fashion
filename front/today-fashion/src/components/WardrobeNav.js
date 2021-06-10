import { Paper, Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

const WardrobeNav = ({ categories, selectedCategory, setSelectedCategory }) => {
  const classes = useStyles();

  const handleTabChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  return (
    <Paper className={classes.root}>
      <Tabs
        value={selectedCategory}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        {categories.map((category) => (
          <Tab key={category} label={category} />
        ))}
      </Tabs>
    </Paper>
  );
};

export default WardrobeNav;
