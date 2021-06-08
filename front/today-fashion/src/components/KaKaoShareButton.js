import React, { useEffect } from 'react';
import { KAKAO_KEY } from '../config';
const KakaoShareButton = ({ handleShareKakaoButton, coordinateItems }) => {
  const encodeValue = coordinateItems.map((item) => item.asin);
  const url =
    window.location.href +
    '/' +
    encodeURIComponent(JSON.stringify(encodeValue));

  useEffect(() => {
    //공유횟수, 좋아요 횟수 구하기
    //
    createKakaoButton();
  }, []);

  const createKakaoButton = () => {
    if (window.Kakao) {
      const kakao = window.Kakao;
      // 중복 initialization 방지
      if (!kakao.isInitialized()) {
        // 두번째 step 에서 가져온 javascript key 를 이용하여 initialize
        // config 파일 지금 gitignore에 추가 안 되어있음!!주의!!
        // key 추가하면 아래 주석 해제
        kakao.init(KAKAO_KEY);
      }
      kakao.Link.createDefaultButton({
        // Render 부분 id=kakao-link-btn 을 찾아 그부분에 렌더링을 합니다
        container: '#kakao-link-btn',
        objectType: 'feed',
        content: {
          title: '내가 만드는 선택, 오늘옷데',
          description: '#오늘옷데 #ONOT #취향_저격 #OOTD #이게_바로_나', //제품 키워드 넣기
          imageUrl: 'https://ifh.cc/g/nHLTlh.png', // i.e. process.env.FETCH_URL + '/logo.png'
          // 캡쳐된 이미지 props로 받아서 넣기
          link: {
            mobileWebUrl:
              window.location.href + '/' + JSON.stringify(coordinateItems),
            webUrl:
              window.location.href + '/' + JSON.stringify(coordinateItems),
          },
        },
        social: {
          likeCount: 77,
          sharedCount: 333,
        },
        buttons: [
          {
            title: '웹으로 보기',
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
          {
            title: '앱으로 보기',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      });
    }
  };
  return (
    <div className="kakao-share-button">
      <button id="kakao-link-btn" onClick={handleShareKakaoButton}>
        <img src="/icons/kakao.png" alt="kakao-share-icon" />
      </button>
    </div>
  );
};
export default KakaoShareButton;
