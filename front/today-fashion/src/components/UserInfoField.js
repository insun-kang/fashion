import React from 'react';
const UserInfoField = ({ userValues }) => {
  return (
    <div className="userinfo-container">
      <h2>nice to meet you, {userValues.nickname}!</h2>
      <label>E-mail</label>
      <div>{userValues.email}</div>
    </div>
  );
};

export default UserInfoField;
