import { Field, Form, Formik } from 'formik';
import DatePicker from 'react-datepicker';
import {
  validateBirth,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validateNickName,
  validatePassword,
} from './formValidations';
import { LinearProgress, TextField, Box } from '@material-ui/core';
import { PCButton } from '../ui-components/@material-extend';
import { StaticDatePicker } from '@material-ui/lab';

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
      name: '',
      nickname: '',
      pw: '',
      confirmPw: '',
    };
    isSignUp = true;
  }

  return (
    <div className="signup-container">
      <div className="signup-form">
        <Formik
          initialValues={initialValues}
          // 수정할때는 initial value를 유저 정보에서 받아온 값으로 하기
          validate={(values) => {
            const errors = {};
            const birth = validateBirth(values.birth);
            if (birth) {
              errors.birth = birth;
            }
            const email = validateEmail(values.email);
            if (email) {
              errors.email = email;
            }
            const name = validateName(values.name);
            if (name) {
              errors.name = name;
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
              <Field name="name">
                {({ field, form }) => (
                  <div>
                    <p
                      style={{ marginLeft: '0.35rem', marginBottom: '0.5rem' }}
                    >
                      Name
                    </p>
                    <TextField
                      {...field}
                      id="name"
                      type="text"
                      placeholder="Please Enter Your Full-Name"
                      label="Full Name"
                      variant="outlined"
                      fullWidth
                      error={
                        form.errors.name && form.touched.name ? true : false
                      }
                      helperText={form.errors.name}
                    />
                  </div>
                )}
              </Field>
              <Box margin={2}></Box>
              <Field name="email">
                {({ field, form }) => (
                  <div>
                    <p
                      style={{ marginLeft: '0.35rem', marginBottom: '0.5rem' }}
                    >
                      Email
                    </p>
                    <TextField
                      {...field}
                      id="email"
                      type="text"
                      placeholder="Please Enter Your E-Mail Address"
                      label="Email"
                      variant="outlined"
                      fullWidth
                      error={
                        form.errors.email && form.touched.email ? true : false
                      }
                      helperText={form.errors.email}
                    />
                  </div>
                )}
              </Field>
              <Box margin={2}></Box>
              <Field name="pw">
                {({ field, form }) => (
                  <div>
                    <p
                      style={{ marginLeft: '0.35rem', marginBottom: '0.5rem' }}
                    >
                      Password
                    </p>
                    <TextField
                      {...field}
                      id="pw"
                      type="password"
                      placeholder="Please Enter Your Password"
                      label="Password"
                      variant="outlined"
                      fullWidth
                      error={form.errors.pw && form.touched.pw ? true : false}
                      helperText={form.errors.pw}
                    />
                  </div>
                )}
              </Field>
              <Box margin={2}></Box>
              <Field name="confirmPw">
                {({ field, form }) => (
                  <div>
                    <p
                      style={{ marginLeft: '0.35rem', marginBottom: '0.5rem' }}
                    >
                      Confirm Password
                    </p>
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
                      helperText={form.errors.confirmPw}
                    />
                  </div>
                )}
              </Field>
              <Box margin={2}></Box>
              <Field name="nickname">
                {({ field, form }) => (
                  <div>
                    <p
                      style={{ marginLeft: '0.35rem', marginBottom: '0.5rem' }}
                    >
                      Nickname
                    </p>
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
                      helperText={form.errors.nickname}
                    />
                  </div>
                )}
              </Field>
              <Box margin={2}></Box>
              {isSignUp ? (
                <Field name="birth">
                  {({ field, form }) => (
                    <div>
                      <p
                        style={{
                          marginLeft: '0.35rem',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Birth Date
                      </p>
                      <StaticDatePicker
                        name="birth"
                        orientation="landscape"
                        openTo="day"
                        value={form.values.birth}
                        onChange={(date) =>
                          form.setValues({ ...form.values, birth: date })
                        }
                        renderInput={(params) => <TextField {...params} />}
                      />
                      <div className="birth-error">
                        {form.errors.birth && form.touched.birth
                          ? form.errors.birth
                          : null}
                      </div>
                    </div>
                  )}
                </Field>
              ) : (
                <div>
                  <div>{initialValues.birth}</div>
                </div>
              )}
              <Box margin={2}></Box>
              <div style={{ textAlign: 'center' }}>
                {props.isSubmitting ? (
                  <LinearProgress />
                ) : (
                  <PCButton
                    variant="contained"
                    color="primary"
                    disabled={props.isSubmitting}
                    onClick={props.submitForm}
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
