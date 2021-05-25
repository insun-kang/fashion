export const validateEmail = (emailValue) => {
  let emailError;
  if (!emailValue) {
    emailError = 'Email is required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailValue)) {
    emailError = 'Invalid email address';
  }
  return emailError;
};

export const validateName = (nameValue) => {
  let nameError;
  if (!nameValue) {
    nameError = 'Name is required';
  }
  //regex 추가
  return nameError;
};

export const validatePassword = (passwordValue) => {
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

export const validateConfirmPassword = (pw, confirmPw) => {
  let confirmPwError;
  if (!confirmPw) {
    confirmPwError = 'Please confirm password';
  } else if (pw !== confirmPw) {
    confirmPwError = 'Password is not the same';
  }
  return confirmPwError;
};

export const validateBirth = (birthValue) => {
  let birthError;
  if (!birthValue) {
    birthError = 'Birth is required';
  } else {
    const birth = new Date(birthValue);
    const curDate = new Date();
    if (birth > curDate) {
      birthError = 'Invalid Date for Birth';
    }
  }
  return birthError;
};

export const validateNickName = (nickNameValue) => {
  let nickNameError;
  if (!nickNameValue) {
    nickNameError = 'Nickname is required';
  }
  return nickNameError;
};
