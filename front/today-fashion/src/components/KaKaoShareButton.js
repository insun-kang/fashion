import React, { useEffect } from 'react';
import { KAKAO_KEY } from '../config';
import ShareIcon from '@material-ui/icons/Share';
import { Button } from '@material-ui/core';

const KakaoShareButton = ({
  handleShareKakaoButton,
  coordinateItems,
  social,
}) => {
  const kakao = window.Kakao;
  const encodeValue = coordinateItems.map((item) => item.asin);
  const url =
    window.location.href +
    '/' +
    encodeURIComponent(JSON.stringify(encodeValue));

  useEffect(() => {
    if (!window.Kakao?.isInitialized()) {
      window.Kakao.init(KAKAO_KEY);
      console.log(window.Kakao);
      console.log(window.Kakao.Link);
    }
  }, []);
  console.log(window.Kakao?.isInitialized());

  const doKakaoShare = () => {
    kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: '내가 만드는 선택, 오늘옷데',
        description: '#오늘옷데 #ONOT #취향_저격 #OOTD #이게_바로_나', //제품 키워드 넣기
        imageUrl: 'https://ifh.cc/g/nHLTlh.png', // i.e. process.env.FETCH_URL + '/logo.png'
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
      social: {
        likeCount: social.totalBookmark,
        sharedCount: social.totalShared,
      },
      buttons: [
        {
          title: '웹으로 보기',
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
      ],
    });
    console.log('공유');
    handleShareKakaoButton();
  };

  return (
    <Button
      variant="contained"
      color="kakao"
      style={{ margin: '5px' }}
      onClick={doKakaoShare}
    >
      <ShareIcon />
    </Button>
  );
};
export default KakaoShareButton;
