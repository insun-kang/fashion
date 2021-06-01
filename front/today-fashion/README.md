# Front-end 진행일지

---

## week1 - 남다영

**eslint-prettier 설정**

- prettier, eslint 설정을 두번째 해보지만 처음 해보는 것처럼 어려웠다. prettier 설치시 오류가 많이 나는데, editor 환경에서의 설정과 editorconfig의 설정, prettier 규칙 설정과 eslint 규칙 설정을 통일하는게 매우 중요하다. 어느 하나라도 놓치면 에러가 일어난다(놓치지 않기가 매우 어렵고 놓친 경우 어느 부분을 놓쳤는지 알기 어렵기 때문에 고치기가 어렵다). 내 경우 한 줄의 코드 길이가가 max 100를 넘지 않는다는 규칙을 설정했는데 editor 환경에서는 기본적으로 80으로 설정되어 있었다. 해당 부분을 수정했더니 오류가 나지 않았다.
- 또 이전에는 삼중첩 삼항연산자를 썼을 때 문법적 오류는 없었는데 prettier 오류가 났었고, 해당부분이 왜 잘못되었는지 알지 못했는데 이번에 오류를 고치려다 eslint에 삼중첩 삼항연산자를 허락하지 않는 규칙이 있다는 걸 알게되었다.

**내 프로젝트에 적합한 ui 사용하기**

- bootstrap과 material ui 중에 어떤 ui framework를 쓸지 많이 고민했다. 처음에는 bootstrap을 쓰려다가 datepicker 컴포넌트가 기본으로 존재하지 않는다는 것을 알고 material ui를 설치했다. 하지만 material ui는 bootstrap보다 반응형 ui의 구현이 훨씬 복잡하다는 것을 알게되었다. 그래서 다시 bootstrap을 설치했다. 결국 업무 재분배로 나는 ui를 관리하지 않게 되었고, 내 결정과 다르게 되었지만 무작정 뭐가 좋다는 말만 듣고 사용하기보다 직접 살펴보며 내 프로젝트에 적합한 프레임워크가 무엇인지 고민하는 과정이 뜻깊었다.

---

## week2 - 남다영

**라우팅으로 인증 관리**

- 저번에 로그인 관리를 했을 때는 모든 페이지에서 on mount 시점에 login이 되었는지 되지 않았는지 구분하는 함수를 실행하는 식으로 구현했었다. 구현하는 당시에도 별로 좋은 방법이라는 느낌을 받지 못했는데 급해서 그냥 그대로 진행했고, 이번에는 다른 방식으로 구현해보기로 했다. 그래서 검색을 해보던 중 **react router로 인증이 필요한 컴포넌트와 필요하지 않은 컴포넌트를 구분해서 라우팅을 하는 법**이 있다는 걸 찾고, 해당 방법을 이용해보았다. 아직 많은 페이지를 작업하지 않아서 확신하기는 이르지만 결과적으로 훨씬 깔끔하게 로그인 관리가 가능할 것 같고, 많이 만족스럽다. react-router-dom 은 이전에도 사용해 본 적이 있지만 이렇게 사용할 수 있다는 건 몰랐다. 세상에는 좋은 프레임워크가 많지만 결국에는 내가 사용하려는 기술을 잘 알고 내 상황에 맞춰 효율적으로 사용할 수 있는지가 제일 중요한 것 같다.
- 구현에 참고했던 레퍼런스 : https://www.daleseo.com/react-router-authentication/

**SSOT 원칙 지키기/로그인 인증**

- SSOT는 Single Source Of Truth이라는 코드 설계 원칙 줄임말이라고 한다. (이번에 배웠다.) 이번 프로젝트에서의 상황을 예시로 들자면, local storage에 저장된 access token의 존재 및 인증 여부를 통해 isLoggedIn 이라는 hook state를 true / false로 두고, 또 그 isLoggedIn의 T/F 여부에 따라 컴포넌트들을 관리하는 상황은 SSOT 원칙을 어기는 것이 된다. access token과 isLoggedIn 둘 다 로그인 여부를 결정하므로 참의 source가 두 개가 되었기 때문이다.
  때문에 코드를 리팩토링 하는 과정을 거쳤다. SSOT원칙을 어기는 코드는 리팩토링이 어렵다는 것도 배우는 경험이 되었는데, 특히 로그인같이 여러 컴포넌트에 관여되는 부분에 대해서는 더 어려웠다. 사실 당장 보이는 에러들을 해결하기는 했지만 이게 근본적으로 모든 문제를 해결했는지도 잘 모르겠다. - 일단 isLoggedIn 전역상태변수를 없애고 useLocalStorage 이라는 커스텀 훅을 사용했다. (직접 짜지는 않았고, 구글에 검색하면 나오는 커스텀 훅이다.) 1.  커스텀 훅을 사용하되 setLocalStorage를 통해 state를 업데이트 하면 비동기적으로 작동하므로, 페이지 이동이 시작되기 전에 state가 업데이트 된다는 보장이 없다. 때문에 로그인 직후 페이지 이동시 로그인 인증 작업을 할 때 localStorage에서 직접 가져온 값이 아니라 커스텀 훅의 state 값을 통해 api 요청을 보내면, 미처 커스텀 훅의 state 값이 업데이트 되지 않아서 로그인 인증 에러가 발생한다. (access token의 값이 null로 요청이 보내져 protected api 호출시 422 에러 반환. 400에러가 뜨기도 했는데 그때는 한번에 여러 부분이 어긋나 있어서 각각이 정확히 어떤 이유로 뜨게 되었는지는 구분하지 못했다.) 2. Local Storage 값을 기존의 코드에서는 JSON.parse 와 JSON.stringify를 이용해 가공했는데 내가 사용하는 access token은 이미 string 값이며, js object의 형태를 가진 string도 아니었어서 parse를 수행하려면 에러가 났고, stringify를 사용하면 토큰 값이 손상되어 에러가 발생했다. 때문에 커스텀 훅의 해당 부분을 수정하여 사용했다.  3. token 초기값을 null로 저장하기도 했는데, 사실 그것 자체에는 문제가 없지만 JSON.stringify를 거쳐서 해서 null 값이 아닌 "null"이 되는 바람에 token 값이 존재할 때(로그인이 되었을 때)만 main으로 이동하게 한 라우팅 처리가 되어버리는 에러도 경험했다.

---

## week3 - 남다영

**api 요청에는 useEffect**

hooks 사용에 많이 익숙해졌다는 생각이 드는 동시에 처음에 학습할 때 배운 이론을 까먹기 시작하는 타이밍이 온 것 같다.

비슷한 작업을 다시 할 때면 전에 썼던 방법 대신 이런 방법을 써보면 어떨까? 라는 생각이 든다. 이번에는 갑자기 axios 요청에 대해 useMemo를 써보고 싶다는 충동이 들었다. 그런데 어디서 분명히 안된다는 걸 읽은 것 같은데..이유가 뭐였지? 하고 찾아보게 되었고. 다음에도 비슷한 충동을 느끼지 않도록 기록해두기로 한다.

- [useEffect](https://reactjs.org/docs/hooks-effect.html)

  useEffect는 side effect를 다룰 때 쓰인다. side effect에는 다음과 같은 행동들이 있다.

  - data fetching
  - setting up a subscription
  - manually changing the DOM in react components

- [useMemo](https://reactjs.org/docs/hooks-reference.html#usememo)

  useMemo에 전달된 함수는 렌더링 중에 실행된다. 따라서 side effect들을 useMemo에서는 실행해서는 안된다. 또한 state 변경도 렌더링 중에 이루어져서는 안된다.

**useEffect, useCallback, deps**

참고링크 : https://stackoverflow.com/questions/55840294/how-to-fix-missing-dependency-warning-when-using-useeffect-react-hook

const로 정의된 함수를 useEffect나 useCallback 내에 쓰면 deps에 추가하지 않을 경우 다음과 같은 주의메세지가 나타났다.

```
React Hook useEffect has a missing dependency: 'checkTokenState'. Either include it or remove the dependency array.
```

useCallback 함수는 렌더링 할때마다 생성되지만 deps array에 존재하는 변수의 값이 변화할때만 return 값을 변화시키게 된다. 때문에 다른 useEffect등의 deps array에 useCallback으로 감싸준 함수를 넣어줘도 괜찮다. (다만 일반 함수의 경우 렌더링할때마다 return 값이 변하므로 deps array에 추가하지 않도록 반드시 주의한다!) 이와 관련된 공식문서 내용을 하단에 추가한다.

- useCallback will return a memoized version of the callback that only changes if one of the dependencies has changed.

useCallback에 대한 공부가 더 필요할 것 같다. 함수에 대해서는 되도록...습관적으로 useCallback을 사용하고 있었는데 최적화가 반드시 필요한 경우가 아니라면 최적화를 하는 것 자체가 오히려 비용이 될 수 있다고 한다. (useCallback 사용시 memoized 하기 위한 메모리의 비용 등이 꼭 필요한가에 대한 고민 필요.)

코드를 작성할 때 생각보다 생각없이 작성하는 경우가 많은 것 같다. 앞으로는 그러지 말도록 조심하자.

[setState 함수의 deps 추가 여부]

- React guarantees that setState function identity is stable and won’t change on re-renders. This is why it’s safe to omit from the useEffect or useCallback dependency list.

라고 한다. deps에 setState 함수는 추가할 필요가 없다고 하니까 앞으로도 굳이 넣지 말도록 하자.

**로딩 속도가 느린 이미지를 포함하는 컴포넌트 관리**

[게임 과정에서 사용자 경험 최적화]

현재 틴더처럼 상품마다 좋아요 싫어요를 평가하는 게임 부분을 작업하고 있다. 해당 부분에서 사용자 경험 최적화를 위해

1.  각 게임마다 결과를 백엔드에 보내주되 (게임 결과를 프론트가 가지고 있다가 손실하는 일이 적도록)
2.  프론트에서는 백엔드 응답을 기다리지 않고 다음 게임을 바로 불러와주도록 하고 있다.(불필요한 대기시간 감소)

[이미지 로딩 속도 감소시키기]

위의 상황에서 이미지를 로딩하는 속도가 느려서 평가 버튼을 연타하면(평가버튼을 누르면 다음 게임이 화면에 보여진다) 이미지를 보지도 않고 평가를 하게 되어버리는 문제가 발생했다. 이때 두가지 해결방법에 대해 고민해보았는데 다음과 같다.

1. 버튼에 로딩처리를 해서 이미지가 로딩되기 전에는 버튼을 클릭할 수 없게 한다.
2. 가능한 게임을 모두 화면에 띄우되 한번에 보여지는것은 한개씩으로 한정한다.

1번이 가장 정석적인 방법이기는 하지만 이미 사용자 경험 최적화를 위해 최대한 빨리 로딩되도록 하고 있는데, 1번 방법을 쓰는 것은 그 의미가 반감되는 것 같아서 가능한 쓰고싶지 않았다. 때문에 2번을 선택해서 구현했다.

- 구현 방법

맨 처음에 가능한 모든 게임(array형태로 존재한다)을 화면에 보여지게 하되, 게임의 index에 따라서 style에서 z-index = 총 문제 수 - index 로 설정한다. 이렇게 되면 index 값이 클수록 앞에 보여지게 된다. 이미지가 포함된 게임 카드들이 스크린 아래로 차곡차곡 쌓인 형태가 된다. 이 상태에서 어떤 방법을 시도해봤냐면,

1. 다음 게임이 보여져야 할 때마다 index = 0 인 element를 shift로 뽑아내고, array 맨 뒤에 넣어준다.
   -> 다만 이렇게 하면 GameCard 컴포넌트에 전달되는 props인 상품정보 데이터가 변경되는 것이기 때문에 다음 게임이 보여질때마다 re-rendering이 되고, 결국은 다시 이미지를 로딩하게 되는 것 같았다. 로딩 속도가 개선되지 않았다.
2. 현재 게임이 진행된 숫자를 나타내는 값인 questionIdx 보다 작은 index를 가진 element의 경우 기본 z-index 값(총 문제 수 - index)에 곱하기 -1을 한다.
   -> questionIdx가 바뀔 때마다 re-rendering이 될 것 같아 사실 이 방법으로는 해결이 안 될 줄 알았다. 하지만 해결이 되었다! 추측하기로는 GameCard 컴포넌트에 직접적으로 전달되는 props값은 바뀌지 않았기 때문에 re-rendering이 되지 않는 것 같다. (안드로이드의 경우 뒤에 가려진 컴포넌트는 아예 렌더를 하지 않는다고 해서 비슷한 경우인지 고민해보았으나 그건 아닌 것 같다.)

로딩 관리를 해주기 전에는 이미지를 불러오는 시간이 약 900ms 정도 걸렸는데, 최적화를 한 뒤에는 0~1ms 내에 다음 게임을 화면에 표시해줄 수 있었다!

브라우저와 리엑트의 렌더링 방식에 대해 깊게 고민해보는 시간이 되었다.

---

## week4 - 남다영

**addEventListener의 사용**

무한스크롤 관련 포스팅을 찾던 중에 componentDidMount 시점에 "scroll" 이벤트에 대하여 addEventListener을 계속해서 추가하는 코드를 발견했다. 함수형 컴포넌트였기 때문에 다음과 같은 코드였다. (deps array가 아예 없는 useEffect)

```
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
      return () => {window.removeEventListener('scroll', handleScroll)
}
  })

```

보통은 componentOnMount 시점에 추가하는데 왜 이런 식으로 코드를 작성했을까 고민을 하다가 이유를 찾지 못해서 코치님께 여쭤봤고, DidMount 시점에 addEventListener을 실행하면 같은 대상의 같은 이벤트에 대해서 같은 함수를 계속 추가하게 된다는 사실을 알게 되었다. return 안의 함수는 여전히 unmount 시점에 한번만 실행되기 때문. 이렇게 되면 이벤트끼리 충돌할 수도 있고...여하튼 좋지 않다. 해당 포스팅을 작성한 사람이 잘못 코딩한 것 같다.

덕분에 알게 된 사실도 있는데,

- 고의적으로 같은 이벤트에 대해서 여러 함수를 추가할 수도 있다. (두 함수가 완전히 다른 기능을 가지고 있는 경우 함수 분리 차원에서 이런 일이 있을 수 있다.)
- 여러 함수를 추가한다면 순차적으로 실행하고 싶은 상황이 생길 것 같은데, 무조건 먼저 추가된 함수가 먼저 실행된다.
