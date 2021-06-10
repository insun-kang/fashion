import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import { alpha, experimentalStyled as styled } from '@material-ui/core/styles';
import { Chip, emphasize } from '@material-ui/core';

const ChipStyle = styled(Chip)(({ theme, styleProps }) => {
  const { color, variant, clickable, onDelete } = styleProps;

  const styledFilled = (color) => ({
    color: theme.palette[color].contrastText,
    backgroundColor: theme.palette[color].main,
    '&.MuiChip-icon': { color: 'inherit' },
    '&.MuiChip-deleteIcon': {
      color: alpha(theme.palette[color].contrastText, 0.7),
      '&:hover, &:active': { color: theme.palette[color].contrastText },
    },
  });

  const styleFilledClickable = (color) => ({
    '&:hover, &:focus': {
      backgroundColor: emphasize(
        theme.palette[color].main,
        theme.palette.action.hoverOpacity
      ),
    },
  });

  const styleFilledDeletable = (color) => ({
    '&:focus': {
      backgroundColor: emphasize(
        theme.palette[color].main,
        theme.palette.action.focusOpacity
      ),
    },
  });

  const styleOutlined = (color) => ({
    color: theme.palette[color].main,
    border: `2px solid ${theme.palette[color].main}`,
    '&:focus, &.MuiChip-clickable:hover': {
      backgroundColor: alpha('transparent', theme.palette.action.hoverOpacity),
    },
    '&.MuiChip-icon': { color: 'currentColor' },
    '&.MuiChip-deleteIcon': {
      color: alpha(theme.palette[color].main, 0.7),
      '&:hover, &:active': { color: theme.palette[color].main },
    },
  });

  return {
    ...(variant === 'filled'
      ? {
          ...styledFilled(color),
          ...(clickable && { ...styleFilledClickable(color) }),
          ...(onDelete && { ...styleFilledDeletable(color) }),
        }
      : {
          ...styleOutlined(color),
        }),
  };
});

const EllipsisText = (props) => {
  const { children } = props;

  return (
    <div
      style={{
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
};

const EllipsisTextDelete = (props) => {
  const { children } = props;

  return (
    <div
      style={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minWidth: 48,
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
};

const PCChip = forwardRef(
  (
    {
      color = 'default',
      variant = 'filled',
      clickable: clickableProp,
      onDelete: onDeleteProp,
      label: labelProp,
      ...other
    },
    ref
  ) => {
    if (color === 'default' || color === 'primary' || color || 'secondary') {
      if (onDeleteProp) {
        return (
          <Chip
            ref={ref}
            color={color}
            variant={variant}
            clickable={clickableProp && clickableProp}
            onDelete={onDeleteProp && onDeleteProp}
            label={<EllipsisTextDelete>{labelProp}</EllipsisTextDelete>}
            {...other}
          />
        );
      } else {
        return (
          <Chip
            ref={ref}
            color={color}
            variant={variant}
            clickable={clickableProp && clickableProp}
            onDelete={onDeleteProp && onDeleteProp}
            label={<EllipsisText>{labelProp}</EllipsisText>}
            {...other}
          />
        );
      }
    }

    return (
      <ChipStyle
        ref={ref}
        color={color}
        variant={variant}
        clickable={clickableProp && clickableProp}
        onDelete={onDeleteProp && onDeleteProp}
        styledProps={{
          color,
          variant,
          clickable: clickableProp && clickableProp,
          onDelete: onDeleteProp && onDeleteProp,
        }}
        label={<EllipsisText>{labelProp}</EllipsisText>}
        {...other}
      />
    );
  }
);

PCChip.propTypes = {
  clickable: PropTypes.bool,
  onDelete: PropTypes.func,
  color: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
  ]),
  variant: PropTypes.oneOfType([
    PropTypes.oneOf(['filled', 'outlined']),
    PropTypes.string,
  ]),
};

export default PCChip;
