import { atom } from 'recoil';

export const userNick = atom({
  key: 'userNick',
  default: '',
});
//userNick 안씀

export const gameBackGroundImgs = atom({
  key: 'gameBackGroundImgs',
  default: undefined,
});

export const gameCount = atom({
  key: 'gameCount',
  default: undefined,
});

export const gameQuestionsData = atom({
  key: 'gameQuestionsData',
  default: undefined,
});
