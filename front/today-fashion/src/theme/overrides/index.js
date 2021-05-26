import { merge } from 'lodash';
import Button from './Button';
import Input from './Input';
import Chip from './Chip';
import Typography from './Typography';
import DatePickers from './DatePickers';

export default function ComponentsOverrides(theme) {
  return merge(
    Button(theme),
    Input(theme),
    Chip(theme),
    Typography(theme),
    DatePickers(theme)
  );
}
