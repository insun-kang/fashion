import { Field, Form, Formik } from 'formik';
import DatePicker from 'react-datepicker';

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
      gender: '',
      name: '',
      nickname: '',
      pw: '',
      confirmPw: '',
    };
    isSignUp = true;
  }

  const validateName = (nameValue) => {
    let nameError;
    if (!nameValue) {
      nameError = 'Name is required';
    }
    //regex 추가
    return nameError;
  };
  const validateEmail = (emailValue) => {
    let emailError;
    if (!emailValue) {
      emailError = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailValue)) {
      emailError = 'Invalid email address';
    }
    return emailError;
  };

  const validatePassword = (passwordValue) => {
    let passwordError;
    if (!passwordValue) {
      passwordError = 'Password is required';
    } else if (
      !/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,20}$/.test(passwordValue)
    ) {
      passwordValue =
        'Valid Password consists of at least 8 characters and a combination of numbers + English + special characters.';
    }
    return passwordError;
  };

  const validateConfirmPassword = (pw, confirmPw) => {
    let confirmPwError;
    if (!confirmPw) {
      confirmPwError = 'Please confirm password';
    } else if (pw !== confirmPw) {
      confirmPwError = 'Password is not the same';
    }
    return confirmPwError;
  };

  const validateGender = (genderValue) => {
    let genderError;
    if (!genderValue) {
      genderError = 'Gender is required';
    }
    return genderError;
  };

  const validateBirth = (birthValue) => {
    let birthError;
    if (!birthValue) {
      birthError = 'Birth is required';
    }
    return birthError;
  };

  const validateNickName = (nickNameValue) => {
    let nickNameError;
    if (!nickNameValue) {
      nickNameError = 'Nickname is required';
    }
    return nickNameError;
  };

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
            const gender = validateGender(values.gender);
            if (gender) {
              errors.gender = gender;
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
                      <DatePicker
                        selected={form.values.birth}
                        onChange={(date) =>
                          form.setValues({ ...form.values, birth: date })
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
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

              <div id="radio-group"> Gender </div>
              {isSignUp ? (
                <>
                  <div role="group" aria-labelledby="radio-group">
                    <label>
                      <Field type="radio" name="gender" value="female" />
                      female
                    </label>
                    <label>
                      <Field type="radio" name="gender" value="male" />
                      male
                    </label>
                  </div>
                  <div className="gender-error">
                    {props.errors.gender && props.touched.gender
                      ? props.errors.gender
                      : null}
                  </div>
                </>
              ) : (
                <div>{initialValues.gender}</div>
              )}

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
