import { Tab } from '@material-ui/core';
import { TabContext, TabList } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

const WardrobeNav = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  setIsPending,
}) => {
  const handleTabChange = (event, newValue) => {
    setSelectedCategory(newValue);
    setIsPending(true);
  };

  return (
    <TabContext value={selectedCategory}>
      <TabList onChange={handleTabChange}>
        {categories.map((category) => (
          <Tab key={category} label={category} />
        ))}
      </TabList>
    </TabContext>
  );
};

export default WardrobeNav;
