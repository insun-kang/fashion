import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Box } from '@material-ui/core';

const Page = forwardRef(({ children, title = '', ...other }, ref) => {
  return (
    <Box ref={ref} {...other}>
      {children}
    </Box>
  );
});

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default Page;
