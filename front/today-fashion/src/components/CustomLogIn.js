const CustomLogIn = () => {
  return (
    <div className="login-form">
      <h2>로그인</h2>
      <label for="email">이메일</label>
      <input id="email" type="text" />
      <label for="password">비밀번호</label>
      <input id="password" type="password" />
    </div>
  );
};

export default CustomLogIn;
