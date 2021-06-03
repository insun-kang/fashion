import { alpha } from '@material-ui/core/styles';

function createGradient(color1, color2) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_80: alpha('#919EAB', 0.8),
};

const PRIMARY = {
  lighter: '#F1F6FA',
  light: '#C9DFF3',
  main: '#70B0E9',
  dark: '#3180C7',
  darker: '#1361A7',
  contrastText: '#fff',
};
const SECONDARY = {
  lighter: '#F6F4FD',
  light: '#D8D2EE',
  main: '#AA9DDA',
  dark: '#826CD3',
  darker: '#4A29C5',
  contrastText: '#fff',
};
const INFO = {
  lighter: '#F2FCFB',
  light: '#CCF1EF',
  main: '#9DDAD6',
  dark: '#62CEC7',
  darker: '#35B7AE',
  contrastText: '#fff',
};
const SUCCESS = {
  lighter: '#F1FAF2',
  light: '#B0EEB6',
  main: '#77D681',
  dark: '#46C153',
  darker: '299534',
  contrastText: '#fff',
};
const WARNING = {
  lighter: '#FEFDF1',
  light: '#FCF4AA',
  main: '#F8E968',
  dark: '#EEDA2B',
  darker: '#D9C618',
  contrastText: GREY[800],
};
const ERROR = {
  lighter: '#FFF6F4',
  light: '#EA8C80',
  main: '#E76453',
  dark: '#DF422E',
  darker: '#BD2814',
  contrastText: '#fff',
};

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main),
};

const COMMON = {
  common: { black: '#000', white: '#fff' },
  primary: { ...PRIMARY },
  secondary: { ...SECONDARY },
  info: { ...INFO },
  success: { ...SUCCESS },
  warning: { ...WARNING },
  error: { ...ERROR },
  grey: GREY,
  gradients: GRADIENTS,
  divider: GREY[500_24],
  action: {
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 1,
    disabledOpacity: 0.48,
  },
};

const palette = {
  light: {
    ...COMMON,
    text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
    background: { paper: '#fff', default: '#fff', neutral: GREY[200] },
    action: { active: GREY[600], ...COMMON.action },
  },
  dark: {
    ...COMMON,
    text: { primary: '#fff', secondary: GREY[500], disabled: GREY[600] },
    background: { paper: GREY[800], default: GREY[900], neutral: GREY[500_16] },
    action: { active: GREY[500], ...COMMON.action },
  },
};

export default palette;
