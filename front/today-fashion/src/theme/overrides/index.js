import { merge } from 'lodash';
import Button from './Button';
import Input from './Input';
import Chip from './Chip';
import Typography from './Typography';
import DatePickers from './DatePickers';
import Modal from './Modal';
import Container from './Container';
import Grid from './Grid';
import Accordion from './Grid';

export default function ComponentsOverrides(theme) {
  return merge(
    Button(theme),
    Input(theme),
    Chip(theme),
    Typography(theme),
    DatePickers(theme),
    Modal(theme),
    Container(theme),
    Grid(theme),
    Accordion(theme)
  );
}
