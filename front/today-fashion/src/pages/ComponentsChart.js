import PropTypes from 'prop-types';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import {
  Grid,
  TextField,
  FormControl,
  LinearProgress,
} from '@material-ui/core';
import { PCButton } from '../ui-components/@material-extend';
import { Block } from '../ui-components/Block';
import Page from '../ui-components/Page';
import { Formik, Form, Field } from 'formik';

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(15),
}));

const styleBlock = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '& > *': { mx: '5px !important' },
};

export default function Test() {
  return (
    <Grid container item xs={8} spacing={3}>
      <Grid item xs={5}>
        <Block title="PC Default Button" sx={styleBlock}>
          <PCButton variant="contained" color="primary">
            Primary
          </PCButton>
          <PCButton variant="contained" color="secondary">
            Secondary
          </PCButton>
          <PCButton variant="contained" color="info">
            Info
          </PCButton>
          <PCButton variant="contained" color="success">
            Success
          </PCButton>
          <PCButton variant="contained" color="warning">
            Warning
          </PCButton>
          <PCButton variant="contained" color="error">
            Error
          </PCButton>
        </Block>
      </Grid>
      <Grid item xs={5}>
        <Block title="PC Outlined Button" sx={styleBlock}>
          <PCButton variant="outlined" color="primary">
            Primary
          </PCButton>
          <PCButton variant="outlined" color="secondary">
            Secondary
          </PCButton>
          <PCButton variant="outlined" color="info">
            Info
          </PCButton>
          <PCButton variant="outlined" color="success">
            Success
          </PCButton>
          <PCButton variant="outlined" color="warning">
            Warning
          </PCButton>
          <PCButton variant="outlined" color="error">
            Error
          </PCButton>
        </Block>
      </Grid>
      <Grid item xs={5}>
        <Block title="PC Text Button" sx={styleBlock}>
          <Grid item xs={7}>
            <PCButton variant="text" color="primary">
              Primary
            </PCButton>
            <PCButton variant="text" color="secondary">
              Secondary
            </PCButton>
            <PCButton variant="text" color="info">
              Info
            </PCButton>
            <PCButton variant="text" color="success">
              Success
            </PCButton>
            <PCButton variant="text" color="warning">
              Warning
            </PCButton>
            <PCButton variant="text" color="error">
              Error
            </PCButton>
          </Grid>
        </Block>
      </Grid>
      <Grid item xs={5}>
        <Block title="PC Input" sx={styleBlock}>
          <FormControl>
            <TextField fullWidth label="email" />
          </FormControl>
          <div>
            <br />
          </div>
          <FormControl>
            <TextField
              error
              fullWidth
              label="password"
              helperText="Invaild Password"
            />
          </FormControl>
        </Block>
      </Grid>
    </Grid>
  );
}
