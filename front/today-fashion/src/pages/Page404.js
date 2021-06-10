import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Container } from '@material-ui/core';
import { PCButton } from '../ui-components/@material-extend';
import { MotionContainer, varBounceIn } from '../components/animate';

export default function Page404() {
  return (
    <RootStyle
      title="404 Page Not Found"
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
                Sorry, page not found!
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Sorry, we couldn’t find the page you’re looking for. Perhaps
              you’ve mistyped the URL? Be sure to check your spelling.
            </Typography>

            <motion.div variants={varBounceIn}>
              <img src="./image/page404.png" height="260px" />
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
