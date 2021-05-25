import { merge } from 'lodash';
import Button from './Button';
import Input from './Input';

export default function ComponentsOverrides(theme) {
  return merge(Button(theme), Input(theme));
}
