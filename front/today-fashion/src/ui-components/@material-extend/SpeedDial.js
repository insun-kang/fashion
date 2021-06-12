import * as React from 'react';
import { styled } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import SpeedDial from '@material-ui/core/SpeedDial';
import SpeedDialIcon from '@material-ui/core/SpeedDialIcon';
import SpeedDialAction from '@material-ui/core/SpeedDialAction';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'absolute',
  '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}));

const actions = [
  { icon: <ArrowUpwardIcon />, name: 'Top', act: 'scrollToTop' },
  { icon: <FavoriteIcon />, name: 'wardobe', link: '/wardrobe' },
  { icon: <SportsEsportsIcon />, name: 'Game', link: '/game' },
];

export default function PlaygroundSpeedDial() {
  const direction = 'left';
  const [hidden, setHidden] = React.useState(false);

  const handleHiddenChange = (event) => {
    setHidden(event.target.checked);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });
  };

  return (
    <Box
      style={{
        position: 'fixed',
        zIndex: 1000,
        bottom: '10px',
        right: '10px',
        height: '50px',
        width: '50px',
      }}
    >
      <StyledSpeedDial
        ariaLabel="SpeedDial playground example"
        hidden={hidden}
        icon={<SpeedDialIcon />}
        direction={direction}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            href={action.link}
            onClick={action.act}
          />
        ))}
      </StyledSpeedDial>
    </Box>
  );
}