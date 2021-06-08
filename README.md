# 오늘옷데(ONOT) 웹 서비스
오늘옷데(ONOT)는 고객의 옷 선택에 따라 인공지능이 옷을 추천해주는 웹 서비스입니다.<br>
[배포된 주소](elice-kdt-ai-track-vm-distribute-21.koreacentral.cloudapp.azure.com)

# 목차
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
### 1. **필요한 데이터셋**
- Amazon review data (2018) Jianmo Ni, UCSD
### 2. **기술 스택 및 라이브러리**

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
| AI | surprise - SVD | 추천 알고리즘 |
| AI | pandas | 데이터 가공 |


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
- **남다영** : [배운점 링크](https://kdt-gitlab.elice.io/001-part4-aifashionkeyword/team1/project-team1/-/blob/sprint/front/today-fashion/README.md)
- **황정우** :
- **강인선** :
- **김다인** :
- **김신성** :


# 환경설정/실행
## 환경설정
- 
## 실행 방법
### Frontend
### Backend

# Browser 지원
- Google Chrome 9+
- Firefox 4+
- Opera 15+
- Safari 5.1+
- Microsoft Edge

# 참고 자료
- Justifying recommendations using distantly-labeled reviews and fined-grained aspects Jianmo Ni, Jiacheng Li, Julian McAuley
- Empirical Methods in Natural Language Processing (EMNLP), 2019