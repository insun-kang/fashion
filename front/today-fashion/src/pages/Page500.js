import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@material-ui/core';
import { PCButton } from '../ui-components/@material-extend';
import { MotionContainer, varBounceIn } from '../animate';

export default function Page404() {
  return (
    <div
      title="500 Internal Server Error"
      style={{
        display: 'flex',
        minHeight: '100%',
        alignItems: 'center',
      }}
    >
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 640, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                Sorry, 500 Internal Server Error
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Sorry, There was an error, please try again later.
            </Typography>

            <motion.div
              variants={varBounceIn}
              style={{
                marginTop: '50px',
                marginBottom: '50px',
                justifyContent: 'center',
                display: 'flex',
              }}
            >
              <img src="./image/page500.png" height="400px" />
            </motion.div>
            <motion.div variants={varBounceIn}>
              <PCButton
                to="/"
                variant="contained"
                component={RouterLink}
                style={{ width: '175px' }}
              >
                Go to Home
              </PCButton>
            </motion.div>
          </Box>
        </MotionContainer>
      </Container>
    </div>
  );
}
