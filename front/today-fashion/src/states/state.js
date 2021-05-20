import { atom } from 'recoil';

export const userNick = atom({
  key: 'userNick',
  default: '',
});

export const loggedinState = atom({
  key: 'loggedinState',
  default: undefined,
});

export const signInModalOpenState = atom({
  key: 'signInModalOpenState',
  default: false,
});

export const signUpModalOpenState = atom({
  key: 'signUpModalOpenState',
  default: false,
});
