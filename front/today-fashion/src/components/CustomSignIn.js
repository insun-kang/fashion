import React from 'react';
import { Field, Form, Formik } from 'formik';

const CustomSignIn = () => {
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
    <div className="login-container">
      <div className="login-form">
        <h2>Sign In</h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={(values, actions) => {
            //회원가입 기능 작성
          }}
        >
          {(props) => (
            <Form>
              <Field name="email" validate={validateEmail}>
                {({ field, form }) => (
                  <div>
                    <label for="email">e-mail</label>
                    <input
                      {...field}
                      id="email"
                      type="text"
                      placeholder="e-mail"
                    />
                    <div className="email-error">{form.errors.email}</div>
                  </div>
                )}
              </Field>
              <Field name="password" validate={validatePassword}>
                {({ field, form }) => (
                  <div>
                    <label for="password">password</label>
                    <input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="password"
                    />
                    <div className="password-error">{form.errors.password}</div>
                  </div>
                )}
              </Field>
              <input
                type="submit"
                disabled={props.isSubmitting}
                // submit 중에는 버튼 disable (loading 처리를 해도 좋음)
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
