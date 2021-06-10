import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { validateEmail, validatePassword } from './formValidations';
import { LinearProgress, TextField, Box } from '@material-ui/core';
import { PCButton } from '../ui-components/@material-extend';

const CustomSignIn = (props) => {
  const { handleCustomSignIn } = props;

  return (
    <div className="App">
      <div className="signin-form">
        <Formik
          initialValues={{ email: '', pw: '' }}
          onSubmit={async (values, actions) => {
            await handleCustomSignIn(values);
            actions.setSubmitting(false);
          }}
        >
          {({ submitForm, isSubmitting }) => (
            <Form>
              <Field name="email" validate={validateEmail}>
                {({ field, form }) => (
                  <div>
                    <TextField
                      {...field}
                      id="email"
                      type="text"
                      placeholder="Please Enter Your E-Mail Address"
                      label="Email"
                      variant="outlined"
                      fullWidth
                      error={form.errors.email && form.touched.email}
                      helperText={
                        form.errors.email && form.touched.email
                          ? form.errors.email
                          : null
                      }
                    />
                  </div>
                )}
              </Field>
              <Box margin={2} />
              <Field name="pw" validate={validatePassword}>
                {({ field, form }) => (
                  <div>
                    <TextField
                      {...field}
                      id="pw"
                      type="password"
                      placeholder="Please Enter Your Password"
                      label="Password"
                      variant="outlined"
                      fullWidth
                      error={form.errors.pw && form.touched.pw}
                      helperText={
                        form.errors.pw && form.touched.pw
                          ? form.errors.pw
                          : null
                      }
                    />
                  </div>
                )}
              </Field>
              <Box margin={4}></Box>
              {isSubmitting ? (
                <LinearProgress />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <PCButton
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={submitForm}
                    style={{
                      margin: '0 auto',
                      width: '30%',
                      height: '45px',
                    }}
                  >
                    Sign In
                  </PCButton>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
      {/* 카카오톡 로그인 버튼 추가 */}
    </div>
  );
};

export default CustomSignIn;
