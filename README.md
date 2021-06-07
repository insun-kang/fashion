# 오늘옷데(ONOT) 웹 서비스
오늘옷데(ONOT)는 고객의 옷 선택에 따라 인공지능이 옷을 추천해주는 웹 서비스입니다.<br>
[배포된 주소](elice-kdt-ai-track-vm-distribute-21.koreacentral.cloudapp.azure.com)

# Table of Contents
[[_TOC_]]

## 1. 웹 서비스 소개
![logo1](./img/ONOT_logo3.png)
- **사용자 취향 기반 실시간 옷 추천 서비스** 
- **선정 배경** : 
    사회가 고도화됨에 따라 개인의 취향이 점점 다양화 세분화 되고 있다. 나만의 부캐찾기, mbti 검사 등 자신을 정의하려는 것이 최근의 트렌드이다. 이런 변화에 반해 아직 대부분의 쇼핑몰은 성별순, 나이순 등 고객 개인의 범주 정보를 정렬 기준을 제시하고 있다. 이렇게 했을 때의 문제점으로는 고객의 취향을 정해진 범주에 한정시켜 소비자 만족도를 일정 단계 이상 끌어올리기 어렵다는 점이 있다. 이러한 문제점을 해결하고자 오늘옷데 서비스가 기획되었다.
- **문제 정의** : 
    오늘옷데는 기존의 '고객의 범주 정보에 맞춰 옷을 찾는' 패러다임을 뒤집어 고객이 원하는 옷과 키워드에서 인공지능이 카테고리를 추출하여 비슷한 다른 옷들을 제시하는 서비스를 제공한다. 이를 통해 개인은 틀에 갖히지 않고 본인에게 맞는 키워드와 옷을 고름으로서 맞춤형 옷을 쉽고 편하게 찾을 수 있다.
- **주요 기능** :
    - 좋아요/싫어요 게임을 통해 인공지능이 사용자의 취향을 파악하고 이에 맞춰 옷을 추천해주는 기능
    - 키워드 검색을 통해 원하는 제품을 인기순으로 보여주는 기능
    - 좋아하는 옷을 찜하고 찜한 옷들을 코디해 지인들과 공유하는 기능


## 2. 스토리보드
![wireframe](./img/ONOT_storyboard.jpg)
- 앞서 정의한 문제점에 따라 스토리보드를 구상했다. 
- 상세 스토리보드 링크는 다음과 같다 : [스토리보드 링크](https://miro.com/app/board/o9J_lE7TxL8=/)


## 3. 프로젝트 구성
1. **필요한 데이터셋**
- Amazon review data (2018) Jianmo Ni, UCSD
2. **기술 스택 및 라이브러리**

    | 분류 | Tools | 목적 |
    | ------ | ------ | ------ |
    | Frontend | React | spa 구현 |
    | Frontend | Recoil | React 상태 관리 |
    | Frontend | Formik | Form 제어 |
    | Frontend | reactdnd | 드래그 가능한 컴포넌트 구현 |
    | Frontend | downshift | 선택 가능한 드롭다운 구현 |
    | Frontend | axios | http request |
    | Frontend | Material-ui | UI Components Library |
    | Frontend | three.js | webGL Library |
    | Frontend | framer | transition Library | 
    | Frontend | lottie | after effect animation |
    | Backend | Flask | 웹 서버 구동 |
    | Backend | MySQL(SQLAlchemy) | 데이터베이스 |
    | Backend | Flasgger | API 문서화 |
    | Backend | Blueprint | API 모듈화 |
    | AI | sklearn | train_test_split, confusion_matrix, TfidfTransformer, CountVectorizer, LogisticRegression |    
    | AI | NLTK | NaiveBayesClassifier | 
    | AI | pytorch-transformers | 문장요약을 위한 Bart 모델 사용 |


## 4. 구현 기능
> 이후 구현된 기능에 알맞는 스크린샷, 영상 등을 추가합니다.
1. **필수 구현**
    - Authentication : 회원가입 / 로그인 / 로그아웃 / 마이페이지(회원정보수정 및 탈퇴)
    - 좋아요∙싫어요 취향찾기 게임 
    - 키워드 검색
2. **선택 구현**
    - 옷장 : 찜하기를 바탕으로 나만의 코디 만들고 공유하기
    - 이스터에그 : 검색창에 팀원 이름 검색시 제품 대신 팀원 사진 등장시키기


## 5. 와이어프레임
![wireframe](./img/ONOT_wireframe_new.jpg)
- 스토리보드와 필수/선택 구현 기능을 바탕으로 상세한 와이어프레임을 작성하였다.
- 꾸준히 업데이트 중에 있다.
- 초기 와이어 프레임 링크는 다음과 같다 : [초기 와이어 프레임 링크](https://miro.com/app/board/o9J_lE5n5Oc=/)
- 개선된 와이어 프레임 링크는 다음과 같다 : [개선된 와이어 프레임 링크](https://www.figma.com/file/k7DLxBhj85AwvpuKjqsehq/WireFrame?node-id=0%3A1)


## 6. 세부 일정
- 현재 5주차 개발 진행 중에 있다.
### 1주차
    - 주제 설정 및 기획
    - 아이디어 로드맵 / ui 적용하지 않은 와이어프레임 작성
    - docker, commit 템플릿, eslint-prettier, editorconfig, pre-commit 등 협업을 위한 환경 설정
### 2주차
    - swagger를 이용한 문서화
    - 로그인 구현
    - 마이페이지 구현
    - 데이터 전처리
    - 인공지능 구현을 위한 자료조사
    - ui 컴포넌트 구현
### 3주차
    - 게임 페이지, 메인페이지  제작 시작
    - ui 컴포넌트 정돈 시작
    - 와이어프레임 구체화 및 발전
### 4주차
    - 웹서비스 배포
    - 인공지능 모델 구현 확정
    - 데이터 전처리 및 학습하여 웹에 도입할 준비 마무리
    - 게임, 메인 페이지 제작 완성
    - 옷장페이지 구현
### 5주차
    - 모든 기능 구현 마무리
    - 코드 리팩토링 및 기능 업그레이드
    - 구현 완료된 기능 디버깅
    - 웹 배포 확인

## 7. 역할

| 이름 | 담당 업무 |
| ------ | ------ |
| 남다영 | 프론트엔드 |
| 황정우 | 프론트엔드 |
| 강인선 | 백엔드, 인공지능 |
| 김다인 | 백엔드, 인공지능 |
| 김신성 | 인공지능 |


## 8. 배운 점
- **프론트엔드** :
1. eslint-prettier 설정하기
    - editor 환경에서의 설정과 editorconfig의 설정, prettier 규칙 설정과 eslint 규칙 설정을 차근차근 살펴보며 통일시키고, 저장시 formatting되는 설정을 적용한다.
2. 유지보수가 쉬운 로그인 인증관리를 구현하기
    - 이전에 로그인 관리를 했을 때는 모든 페이지에서 on mount 시점에 login이 되었는지 되지 않았는지 구분하는 함수를 실행하는 식으로 구현했다. 커스텀 훅을 이용해서 반복되는 코드를 줄일 수 있지만 여전히 모든 페이지 파일에 인증 관련 코드를 작성해야 하는 것은 여전하고, 이렇게 작성할 경우 코드의 유지보수가 번거롭다. 
    - 이번에는 root 컴포넌트에서 useEffect를 사용해서 페이지가 변할때마다 해당 코드를 실행하게 했고, 이를 통해 로컬 스토리지의 토큰을 관리했다.
    - 로그인이 필요한 페이지에서는 react-router-dom의 커스텀 routing을 만들어 로그인 되지 않았을 경우 로그인 페이지로 강제 이동하도록 구현했다.
    - SSOT(single source of truth)라는 코드 설계 원칙을 준수하려 노력했다. (token을 통해 로그인 여부를 인증하므로 isLoggedIn이라는 state를 따로 사용하지 않는 방식)
3. 협업 환경에서 일관성 있는 UI/UX 및 Responsive Web 개발
    - 오늘옷데 Design System 기반으로 필요한 UI/UX Component를 Customize하여 라이브러리화
- **백엔드** :
1. swagger 사용할 때 jwt_token 추가하는 법
    - 공식문서가 있었으나 작동하지 않았고, stackoverflow에 검색해봐도 관련 결과가 3개정도밖에 안 떠서 알아낸 정보를 전부 조합해서 이것저것 해봐야 했다. openapi 버전이 낮아서 적용이 안됐던 것이었다.
- **인공지능** :


## Citation
- Justifying recommendations using distantly-labeled reviews and fined-grained aspects Jianmo Ni, Jiacheng Li, Julian McAuley
- Empirical Methods in Natural Language Processing (EMNLP), 2019


# Browser Support
- Google Chrome 9+
- Firefox 4+
- Opera 15+
- Safari 5.1+
- Microsoft Edge