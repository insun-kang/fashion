import React, { useEffect, useState } from 'react';
import UserInfoField from '../components/UserInfoField';
import UserInfoForm from '../components/UserInfoForm';

const MyPage = () => {
  //비밀번호 입력
  //회원정보 보기 , 회원정보 수정
  const [isConfirmed, setIsConfirmed] = useState(true);
  //테스트 중. 추후 false로 바꿀 것
  const [editInfo, setEditInfo] = useState(false);

  useEffect(() => {
    if (isConfirmed) {
      getUserInfo();
    }
  }, [isConfirmed]);

  if (!isConfirmed) {
    return (
      <div>
        <h2>비밀번호를 입력해주세요</h2>
        <input type="password" />
        <input type="button" value="확인" />
      </div>
    );
  }

  const getUserInfo = async () => {
    //userValues 여기서 구하기
  };

  const handleUpdateUserInfo = async (data) => {
    console.log(data);
  };
  return (
    <div className="container">
      {editInfo ? (
        <UserInfoForm
          handleUserInfoForm={handleUpdateUserInfo}
          //   initialValues={userValues}
        /> //   회원정보 수정
      ) : (
        <>
          <UserInfoField />
          <input
            type="button"
            value="수정하기"
            onClick={() => {
              setEditInfo(true);
            }}
          />
        </>
      )}
    </div>
  );
};
export default MyPage;
