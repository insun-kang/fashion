import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Container, dividerClasses } from '@material-ui/core';
import { PCButton } from '../ui-components/@material-extend';
import { MotionContainer, varBounceIn } from '../animate';

export default function Page404() {
  return (
    <div
      title="404 Page Not Found"
      style={{
        display: 'flex',
        minHeight: '100%',
        alignItems: 'center',
      }}
    >
      <Container style={{ marginTop: '50px' }}>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 640, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                Sorry, page not found!
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Sorry, we couldn’t find the page you’re looking for. Perhaps
              you’ve mistyped the URL? Be sure to check your spelling.
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
              <img src="./image/page404.png" height="400px" />
            </motion.div>

            <motion.div variants={varBounceIn}>
              <PCButton
                to="/"
                variant="contained"
                color="secondary"
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
