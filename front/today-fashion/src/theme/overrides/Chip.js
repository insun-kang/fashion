import React from 'react';
import { Icon } from '@iconify/react';
import closeCircleFill from '@iconify/icons-eva/close-circle-fill';
import { alpha } from '@material-ui/core';

export default function Chip(theme) {
  return {
    MuiChip: {
      defaultProps: {
        deleteIcon: <Icon icon={closeCircleFill} />,
      },
      styleOverrides: {
        outlined: {
          border: `2px solid`,
          borderColor: theme.palette.main,
          '&.MuiChip-colorPrimary': {
            borderColor: theme.palette.primary.main,
          },
          '&MuiChip-colorSecondary': {
            borderColor: theme.palette.secondary.main,
          },
        },
      },
    },
  };
}
