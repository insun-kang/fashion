#front 진행일지

---

###week1 - 남다영

- prettier, eslint 설정을 두번째 해보지만 처음 해보는 것처럼 어려웠다. prettier 설치시 오류가 많이 나는데, editor 환경에서의 설정과 editorconfig의 설정, prettier 규칙 설정과 eslint 규칙 설정을 통일하는게 매우 중요하다. 어느 하나라도 놓치면 에러가 일어난다(놓치지 않기가 매우 어렵고 놓친 경우 어느 부분을 놓쳤는지 알기 어렵기 때문에 고치기가 어렵다). 내 경우 한 줄의 코드 길이가가 max 100를 넘지 않는다는 규칙을 설정했는데 editor 환경에서는 기본적으로 80으로 설정되어 있었다. 해당 부분을 수정했더니 오류가 나지 않았다.
  또 이전에는 삼중첩 삼항연산자를 썼을 때 문법적 오류는 없었는데 prettier 오류가 났었고, 해당부분이 왜 잘못되었는지 알지 못했는데 이번에 오류를 고치려다 eslint에 삼중첩 삼항연산자를 허락하지 않는 규칙이 있다는 걸 알게되었다.
- bootstrap과 material ui 중에 어떤 ui framework를 쓸지 많이 고민했다. 처음에는 bootstrap을 쓰려다가 datepicker 컴포넌트가 기본으로 존재하지 않는다는 것을 알고 material ui를 설치했다. 하지만 material ui는 bootstrap보다 반응형 ui의 구현이 훨씬 복잡하다는 것을 알게되었다. 그래서 다시 bootstrap을 설치했다.

###week2 - 남다영
