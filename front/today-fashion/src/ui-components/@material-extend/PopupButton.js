import React, { forwardRef, useState } from 'react';
import { Slide, Dialog, DialogActions } from '@material-ui/core';
import PCButton from './PCButton';

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export default function PopupButton() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <PCButton
        variant="variant"
        color="color"
        onClick={handleClickOpen}
      ></PCButton>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="title"
        aria-describedby="description"
      >
        <DialogActions>
          <PCButton color="contained" onClick={handleClose}>
            Disagree
          </PCButton>
          <PCButton variant="contained" onClick={handleClose}>
            Agree
          </PCButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
