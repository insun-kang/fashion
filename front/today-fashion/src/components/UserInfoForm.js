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

const UserInfoForm = (props) => {
  const { handleUserInfoForm } = props;
  let isSignUp;
  let initialValues;
  if (props.initialValues) {
    initialValues = props.initialValues;
    isSignUp = false;
  } else {
    initialValues = {
      birth: '',
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
      <h2>{isSignUp ? 'Sign Up' : 'Modify User Info'}</h2>
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
                    <label htmlFor="name">Name</label>
                    <input
                      {...field}
                      id="name"
                      type="text"
                      placeholder="name"
                    />
                    <div className="name-error">
                      {form.errors.name && form.touched.name
                        ? form.errors.name
                        : null}
                    </div>
                  </div>
                )}
              </Field>
              <Field name="email">
                {({ field, form }) => (
                  <div>
                    <label htmlFor="email">E-mail</label>
                    <input
                      {...field}
                      id="email"
                      type="text"
                      placeholder="e-mail"
                    />
                    <div className="email-error">
                      {form.errors.email && form.touched.email
                        ? form.errors.email
                        : null}
                    </div>
                  </div>
                )}
              </Field>
              <Field name="pw">
                {({ field, form }) => (
                  <div>
                    <label htmlFor="pw">Password</label>
                    <input
                      {...field}
                      id="pw"
                      type="password"
                      placeholder="password"
                    />
                    <div className="password-error">
                      {form.errors.pw && form.touched.pw
                        ? form.errors.pw
                        : null}
                    </div>
                  </div>
                )}
              </Field>
              <Field name="confirmPw">
                {({ field, form }) => (
                  <div>
                    <label htmlFor="confirmPw">Confirm password</label>
                    <input
                      {...field}
                      id="confirmPw"
                      type="password"
                      placeholder="Confirm password"
                    />
                    <div className="password-error">
                      {form.errors.confirmPw && form.touched.confirmPw
                        ? form.errors.confirmPw
                        : null}
                    </div>
                  </div>
                )}
              </Field>
              {isSignUp ? (
                <Field name="birth">
                  {({ field, form }) => (
                    <div>
                      <label>birth</label>
                      <span
                        onMouseUp={() => {
                          form.setTouched({ ...form.touched, birth: true });
                        }}
                      >
                        <DatePicker
                          name="birth"
                          selected={form.values.birth}
                          onChange={(date) =>
                            form.setValues({ ...form.values, birth: date })
                          }
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                        />
                      </span>
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
                  <div>birth</div>
                  <div>{initialValues.birth}</div>
                </div>
              )}
              <Field name="nickname">
                {({ field, form }) => (
                  <div>
                    <label htmlFor="nickname">Nick name</label>
                    <input
                      {...field}
                      id="nickname"
                      type="text"
                      placeholder="nickname"
                    />
                    <div className="nickname-error">
                      {form.errors.nickname && form.touched.nickname
                        ? form.errors.nickname
                        : null}
                    </div>
                  </div>
                )}
              </Field>

              <input
                type="submit"
                disabled={props.isSubmitting}
                value={isSignUp ? 'Sign Up' : 'Save'}
              />
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
