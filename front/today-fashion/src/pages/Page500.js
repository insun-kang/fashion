import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Container } from '@material-ui/core';
import { PCButton } from '../ui-components/@material-extend';
import { MotionContainer, varBounceIn } from '../components/animate';

export default function Page404() {
  return (
    <RootStyle
      title="500 Internal Server Error"
      style={{
        display: 'flex',
        minHeight: '100%',
        alignItems: 'center',
        paddingTop: theme.spacing(15),
        paddingBottom: theme.spacing(10),
      }}
    >
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                Sorry, 500 Internal Server Error
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Sorry, There was an error, please try again later.
            </Typography>

            <motion.div variants={varBounceIn}>
              <img src="./image/page500.png" height="260px" />
            </motion.div>

            <PCButton
              to="/"
              size="large"
              variant="contained"
              component={RouterLink}
            >
              Go to Home
            </PCButton>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}
