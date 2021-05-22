import React from 'react';
import { Field, Form, Formik } from 'formik';

const CustomSignIn = (props) => {
  const { handleCustomSignIn } = props;
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
  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <div className="signin-form">
        <Formik
          initialValues={{ email: '', pw: '' }}
          onSubmit={async (values, actions) => {
            await handleCustomSignIn(values);
            actions.setSubmitting(false);
          }}
        >
          {(props) => (
            <Form>
              <Field name="email" validate={validateEmail}>
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
              <Field name="pw" validate={validatePassword}>
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
                      {/* password input이 touched 되었고 + errors 값에 password의 에러가 있을때만 에러메세지를 보여준다. */}
                    </div>
                  </div>
                )}
              </Field>
              <input
                type="submit"
                disabled={props.isSubmitting}
                // submit 중에는 버튼 disable (같은 방식으로 loading 처리도 가능)
                value="Sign In"
              />
            </Form>
          )}
        </Formik>
      </div>
      {/* 카카오톡 로그인 버튼 추가 */}
    </div>
  );
};

export default CustomSignIn;
