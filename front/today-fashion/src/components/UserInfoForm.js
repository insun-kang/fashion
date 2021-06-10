import React from 'react';
import { Field, Form, Formik } from 'formik';
import {
  validateConfirmPassword,
  validateEmail,
  validateNickName,
  validatePassword,
} from './formValidations';
import { LinearProgress, TextField, Box } from '@material-ui/core';
import { PCButton } from '../ui-components/@material-extend';

const UserInfoForm = (props) => {
  const { handleUserInfoForm } = props;
  let isSignUp;
  let initialValues;
  if (props.initialValues) {
    initialValues = props.initialValues;
    isSignUp = false;
  } else {
    initialValues = {
      birth: new Date(),
      email: '',
      nickname: '',
      pw: '',
      confirmPw: '',
    };
    isSignUp = true;
  }

  return (
    <div className="App">
      <div className="signup-form">
        <Formik
          initialValues={initialValues}
          // 수정할때는 initial value를 유저 정보에서 받아온 값으로 하기
          validate={(values) => {
            const errors = {};
            const email = validateEmail(values.email);
            if (email) {
              errors.email = email;
            }
            const nickname = validateNickName(values.nickname);
            if (nickname) {
              errors.nickname = nickname;
            }
            const pw = validatePassword(values.pw);
            if (pw) {
              errors.pw = pw;
            }
            const confirmPw = validateConfirmPassword(
              values.pw,
              values.confirmPw
            );

            if (confirmPw) {
              errors.confirmPw = confirmPw;
            }

            return errors;
          }}
          onSubmit={async (values, actions) => {
            if (isSignUp) {
              values['birth'] = values['birth'].toISOString().slice(0, 10);
            }
            delete values['confirmPw'];

            await handleUserInfoForm(values);
            actions.setSubmitting(false);
            //나중에 여유 생기면 back에러를 form에러로 반영하기.
          }}
        >
          {(props) => (
            <Form>
              <Field name="email">
                {({ field, form }) => (
                  <div>
                    {isSignUp ? (
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
                    ) : (
                      <TextField
                        {...field}
                        label="Email"
                        variant="outlined"
                        fullWidth
                        disabled
                        value={initialValues.email}
                        helperText="You can't change your email"
                      />
                    )}
                  </div>
                )}
              </Field>
              <Box margin={2} />
              <Field name="pw">
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
              <Box margin={2} />
              <Field name="confirmPw">
                {({ field, form }) => (
                  <div>
                    <TextField
                      {...field}
                      id="confirmPw"
                      type="password"
                      placeholder="Please Confirm Your Password"
                      label="Confirm Password"
                      variant="outlined"
                      fullWidth
                      error={
                        form.errors.confirmPw && form.touched.confirmPw
                          ? true
                          : false
                      }
                      helperText={
                        form.errors.confirmPw && form.touched.confirmPw
                          ? form.errors.confirmPw
                          : null
                      }
                    />
                  </div>
                )}
              </Field>
              <Box margin={2} />
              <Field name="nickname">
                {({ field, form }) => (
                  <div>
                    <TextField
                      {...field}
                      id="nickname"
                      type="text"
                      placeholder="Please Enter Your Nickname"
                      label="Nickname"
                      variant="outlined"
                      fullWidth
                      error={
                        form.errors.nickname && form.touched.nickname
                          ? true
                          : false
                      }
                      helperText={
                        form.errors.nickname && form.touched.nickname
                          ? form.errors.nickname
                          : null
                      }
                    />
                  </div>
                )}
              </Field>

              <Box margin={2} />
              <div style={{ textAlign: 'center' }}>
                {props.isSubmitting ? (
                  <LinearProgress />
                ) : (
                  <PCButton
                    variant="contained"
                    color="primary"
                    disabled={props.isSubmitting}
                    onClick={props.submitForm}
                    style={{ width: '30%', height: '45px' }}
                  >
                    {isSignUp ? 'Sign Up' : 'Save'}
                  </PCButton>
                )}
              </div>
              {/* 정보 수정인지, 회원가입인지에 따라 value 다르게 하기 */}
              {/* 수정의 경우 수정 불가능한 정보는 disable 처리 하기 */}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UserInfoForm;
