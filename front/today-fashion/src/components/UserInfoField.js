const UserInfoField = ({ userValues }) => {
  return (
    <div className="userinfo-container">
      <h2>nice to meet you, {userValues.nickname}!</h2>
      <label>name</label>
      <div>{userValues.name}</div>
      <label>Nickname</label>
      <div>{userValues.nickname}</div>
      <label>E-mail</label>
      <div>{userValues.email}</div>
      <label>Date of Birth</label>
      <div>{userValues.birth}</div>
    </div>
  );
};

export default UserInfoField;
