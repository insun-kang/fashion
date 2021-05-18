import { atom } from 'recoil';

export const loginInputState = atom({
  key: 'loginInputState',
  default: {
    email: '',
    password: '',
  },
});

export const loggedinState = atom({
  key: 'loggedinState',
  default: false,
});

export const loginModalOpenState = atom({
  key: 'loginModalOpenState',
  default: false,
});
