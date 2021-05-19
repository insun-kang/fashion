import { atom } from 'recoil';

export const loggedinState = atom({
  key: 'loggedinState',
  default: false,
  //  로그인한 유저 정보 저장
});

export const signInModalOpenState = atom({
  key: 'signInModalOpenState',
  default: false,
});

export const signUpModalOpenState = atom({
  key: 'signUpModalOpenState',
  default: false,
});
