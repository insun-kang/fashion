import { useState } from 'react';
import PhoneIcon from '@material-ui/icons/Phone';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import { Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

const SIMPLE_TAB = [
  { value: '1', icon: <PhoneIcon />, label: 'Item One', disabled: false },
  { value: '2', icon: <FavoriteIcon />, label: 'Item Two', disabled: false },
  { value: '3', icon: <PersonPinIcon />, label: 'Item Three', disabled: true },
];

export default function TabsComponent() {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <TabList onChange={handleChange}>
        {SIMPLE_TAB.map((tab, index) => (
          <Tab key={tab.value} label={tab.label} value={String(index + 1)} />
        ))}
      </TabList>
    </TabContext>
  );
}
