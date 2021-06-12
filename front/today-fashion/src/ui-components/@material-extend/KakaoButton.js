import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import { alpha, experimentalStyled as styled } from '@material-ui/core';
import { Button } from '@material-ui/core';

const ButtonStyle = styled(Button)(({ theme, styleProps }) => {
  const { color, variant } = styleProps;

  const styleContained = (color) => ({
    margin: '0.5rem',
    // boxShadow: theme.customShadows[color],
    color: theme.palette[color].contrastText,
    borderRadius: '15px',
    backgroundColor: theme.palette[color].main,
    '&:hover': {
      backgroundColor: theme.palette[color].dark,
    },
    '@media (min-width:320px)': {
      width: '90vw',
      height: '60px',
    },
    '@media (min-width:640px)': {
      width: '365px',
      height: '60px',
    },
    '@media (min-width:960px)': {
      width: '365px',
      height: '60px',
    },
    '@media (min-width:1280px)': {
      width: '365px',
      height: '60px',
    },
  });

  const styleOutlined = (color) => ({
    width: '125px',
    height: '45px',
    margin: '1rem',
    color: theme.palette[color].main,
    border: `3px solid ${alpha(theme.palette[color].main, 0.48)}`,
    '&:hover': {
      color: theme.palette[color].lighter,
      border: `3px solid ${theme.palette[color].main}`,
      backgroundColor: alpha(
        theme.palette[color].main,
        theme.palette.action.hoverOpacity
      ),
    },
  });

  const styleText = (color) => ({
    width: 'max-content',
    color: theme.palette[color].main,
    '&:hover': {
      color: theme.palette[color].lighter,
      backgroundColor: alpha(
        theme.palette[color].main,
        theme.palette.action.hoverOpacity
      ),
    },
  });

  return {
    ...(variant === 'contained' && { ...styleContained(color) }),
    ...(variant === 'outlined' && { ...styleOutlined(color) }),
    ...(variant === 'text' && { ...styleText(color) }),
  };
});

const KakaoButton = forwardRef(
  ({ color = 'primary', variant = 'text', children, ...other }, ref) => {
    return (
      <ButtonStyle
        ref={ref}
        variant={variant}
        styleProps={{ color, variant }}
        {...other}
      >
        {children}
      </ButtonStyle>
    );
  }
);

KakaoButton.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf([
    'inherit',
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'kakao',
  ]),
  variant: PropTypes.oneOfType([
    PropTypes.oneOf(['contained', 'outlined', 'text']),
    PropTypes.string,
  ]),
};

export default KakaoButton;