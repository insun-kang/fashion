import { Field, Form, Formik } from 'formik';

const SignUp = () => {
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

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <div className="signup-form">
        <Formik
          initialValues={{
            birth: '',
            email: '',
            gender: '',
            name: '',
            nickname: '',
            pw: '',
            confirmPw: '',
          }}
          validate={(values) => {
            const errors = {
              birth: '',
              email: validateEmail(values.email),
              gender: '',
              name: validateName(values.name),
              nickname: '',
              pw: validatePassword(values.pw),
              confirmPw: validateConfirmPassword(values.pw, values.confirmPw),
            };
            return errors;
          }}
          onSubmit={(values, actions) => {
            //회원가입 기능 작성
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
                    <label htmlFor="email">e-mail</label>
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
                    <label htmlFor="pw">password</label>
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
                    <label htmlFor="confirmPw">password</label>
                    <input
                      {...field}
                      id="confirmPw"
                      type="password"
                      placeholder="password"
                    />
                    <div className="password-error">
                      {form.errors.confirmPw && form.touched.confirmPw
                        ? form.errors.confirmPw
                        : null}
                    </div>
                  </div>
                )}
              </Field>
              {/* 생일, 닉네임, 성별 추가 필요*/}
              <input
                type="submit"
                disabled={props.isSubmitting}
                value="Sign Up"
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
