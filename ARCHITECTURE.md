# FDS 설계 문서

Futurewiz Design System(FDS)이 어떤 구조와 원칙으로 만들어졌는지, 그리고 `useOverlay` 훅의 내부 동작을 정리한 문서입니다.

> 이 문서는 저장소 루트에 둡니다. `packages/docs`(Docusaurus)는 컴포넌트가 안정된 뒤 일괄 갱신하기로 해서 이번에는 건드리지 않았습니다.
> 날짜/시간 컴포넌트(3장)는 재구성이 진행 중이라 "합의한 설계"와 "현재 상태"를 나눠 적었습니다.

## 목차

1. 저장소 구조
2. 설계 원칙
3. 날짜/시간 컴포넌트 설계
4. `useOverlay` deep dive
5. 결정 기록
6. 알려진 한계와 열린 과제

---

## 1. 저장소 구조

npm workspaces 모노레포입니다.

```
FDS/
├─ packages/
│  ├─ core/        @fds/core — 컴포넌트·아이콘·토큰 (배포 대상)
│  ├─ storybook/   @fds/storybook — 개발용 샌드박스 (core 소스를 직접 참조)
│  └─ docs/        @fds/docs — Docusaurus 문서 사이트 (core의 dist를 사용)
├─ scripts/        docs 코드 예시 포맷터
├─ ARCHITECTURE.md 이 문서
└─ .prettierrc
```

| 패키지    | 역할                                  | core를 읽는 방식                                                                     |
| --------- | ------------------------------------- | ------------------------------------------------------------------------------------ |
| core      | 라이브러리. ES/UMD + `style.css`      | —                                                                                    |
| storybook | 컴포넌트 단위 개발·확인, a11y, 테스트 | vite alias로 **소스** 직접 참조 → 빌드 없이 HMR                                      |
| docs      | 외부에 보여 줄 문서                   | `@fds/core`의 **빌드 결과(`dist`)**. core를 고치면 `npm run build -w @fds/core` 필요 |

Storybook은 "개발자용 샌드박스", docs는 "보기 좋은 문서"로 역할을 나눴습니다. 그래서 docs에 Storybook을 임베드하지 않고, docs는 `@fds/core` 컴포넌트를 MDX에서 직접 렌더링합니다.

### core 내부

```
packages/core/src/
├─ components/<name>/<Name>.tsx   컴포넌트 (폴더는 kebab-case)
├─ components/icon/               아이콘 247개 (대부분 자동 생성) + iconGroups.ts
├─ components/_internal/          밖으로 export하지 않는 내부 컴포넌트
├─ styles/                        디자인 토큰 (colors / typography / shape / base)
├─ utils/cn.ts                    클래스 병합 (tailwind-merge 확장 포함)
└─ index.ts                       공개 API
```

### 빌드

- core는 Vite 라이브러리 모드로 `dist/index.es.js`, `index.umd.js`, `style.css`를 만듭니다.
- 리셋(preflight)이 없는 `style.no-reset.css`도 함께 만듭니다. 자체 리셋이 있는 앱이나 Docusaurus에 붙일 때 씁니다.

---

## 2. 설계 원칙

### 2.1 디자인 토큰은 변수 하나, 모드는 값만 바뀐다

```css
:root {
  --fds-bg-surface: #ffffff;
}
[data-theme="dark"] {
  --fds-bg-surface: #1e2024;
}
@theme inline {
  --color-bg-surface: var(--fds-bg-surface);
}
```

- 컴포넌트에는 `dark:` 클래스를 쓰지 않습니다. `bg-bg-surface` 하나만 쓰면 `data-theme`에 따라 값이 바뀝니다.
- 타이포(`text-title-1`, `text-caption-2` …)와 라디우스(`rounded-12`)도 Figma 토큰을 그대로 옮긴 유틸리티입니다.
- 색 클래스 이름은 `그룹-이름`입니다(`text-text-primary`, `border-border-line`).

### 2.2 `cn()`과 타이포 토큰

`cn()`은 `clsx` + `tailwind-merge`입니다. `tailwind-merge`는 `text-caption-2` 같은 **우리 커스텀 토큰이 글자 크기라는 것을 모르면** 글자 색(`text-text-caption`)과 같은 그룹으로 보고 앞의 것을 지웁니다.

그래서 `utils/cn.ts`가 타이포 토큰 26개를 "font-size 그룹"으로 등록합니다. **타이포 토큰을 추가하면 이 목록에도 추가해야 합니다.** 놓치면 오류 없이 글자 크기만 조용히 본문 크기로 돌아갑니다(실제로 Textarea 글자수가 16px로 나왔던 원인입니다).

### 2.3 컴포넌트 작성 규칙

- React 19: `forwardRef`/`displayName` 없이 `ref`를 일반 prop으로 받습니다.
- **레이아웃·변형은 한 컴포넌트 안에서 prop으로 캡슐화**합니다(Input의 `orientation`, `leftAddon`/`rightAddon` 등).
- 반대로 **여러 컴포넌트를 도메인에 맞게 엮는 것은 앱의 몫**입니다(그래서 VodList를 삭제했습니다. 5장 참고).
- 값은 직렬화 가능한 형태를 선호합니다. 날짜 `"YYYY-MM-DD"`, 시간 `"HH:mm"`.
- 오버레이는 `document.body` 포털이 아니라 **DOM 안에 그립니다.** `data-theme`가 body가 아니라 래퍼 요소에 걸려 있는 환경(Storybook 등)에서도 토큰이 내려오게 하기 위해서입니다.

### 2.4 접근성은 기본값

- 라벨은 `htmlFor`로 연결, 에러는 `role="alert"` + `aria-describedby`, 설명도 `aria-describedby`.
- 팝업은 `role="dialog"`, 달력은 `role="grid"`와 roving tabindex.
- 장식용 요소(`*` 필수 표시, 배경 영상)는 `aria-hidden`.

### 2.5 Input 계열의 보조 영역

Input·Textarea는 "필드 박스(배경·라운드·포커스 링)"와 그 아래 보조 영역으로 나뉩니다.

```
라벨 (14px / 600)
┌──────────────────────────────┐
│ leftAddon  [ input ]  rightAddon │   ← 필드 박스 (높이 42px)
└──────────────────────────────┘
description 또는 error (11px, text-caption-2)   ← error가 있으면 description 대신
```

- 글자수(Textarea `showCount`)도 같은 11px 보조 텍스트로, 박스 바깥 아래 왼쪽입니다.
- 입력창의 트리 위치를 고정해서, 에러가 입력 중에 나타나거나 사라져도 포커스를 잃지 않습니다.

---

## 3. 날짜/시간 컴포넌트 설계

### 3.1 문제의식

날짜 선택 UI는 "입력창 + 아래에 뜨는 달력"입니다. 이걸 하나의 `DatePicker`에 모두 묶으면 이런 일이 안 됩니다.

- 입력창 대신 버튼이나 칩으로 열고 싶을 때
- 달력만 모달이나 대시보드 안에 두고 싶을 때
- 날짜와 시간을 한 번에 고르고 싶을 때

### 3.2 합의한 구조: 원시 요소 + 얇은 래퍼

```
원시 요소 (밖으로 export, 로직 소유)
  Popover     입력창 아래 anchored 오버레이 (위치·바깥 클릭·Esc·포커스 복귀) — 공개됨
  Calendar    달력 패널 (월 이동, 키보드, min/max/비활성)
  TimePanel   시/분 목록 패널 (키보드, 선택 항목 스크롤)

얇은 래퍼 (원시 요소를 조합한 것, 고유 로직 없음)
  DatePicker      = Input + Popover + Calendar
  TimePicker      = Input + Popover + TimePanel + 임시값 + "확인"
  DateTimePicker  = Input + Popover + Calendar + TimePanel + "확인"
```

핵심 아이디어는 **"기존 `Input`에 꽂아 쓸 수 있다"**는 것입니다. 래퍼를 쓰지 않고 직접 조합하면 이렇게 됩니다.

```tsx
<Popover
  label="날짜 선택"
  trigger={({ toggle, anchorRef }) => (
    <Input
      readOnly
      value={date ?? ""}
      fieldRef={anchorRef}
      onClick={toggle}
      rightAddon={<CalendarIcon />}
    />
  )}
>
  {({ close }) => (
    <Calendar
      value={date}
      onChange={(v) => {
        setDate(v);
        close();
      }}
    />
  )}
</Popover>
```

- `Input`의 `fieldRef`는 "팝업이 붙을 기준 요소"(필드 박스)를 알려 주는 연결점입니다. 라벨이나 에러 문구 아래가 아니라 **입력 박스 바로 아래**에 팝업이 뜨게 합니다.
- 버튼을 트리거로 쓰면 `anchorRef`를 버튼 ref로 넘기면 됩니다.
- 모달로 여는 경우는 `Popover` 대신 `useOverlay` + `Modal` 안에 `Calendar`를 넣습니다(4장).

### 3.3 값 형태

| 컴포넌트       | 값                   | 예                   |
| -------------- | -------------------- | -------------------- |
| DatePicker     | `"YYYY-MM-DD"`       | `"2026-10-15"`       |
| TimePicker     | `"HH:mm"` (24시간)   | `"09:30"`            |
| DateTimePicker | `"YYYY-MM-DDTHH:mm"` | `"2026-10-15T09:30"` |

- **전부 문자열, 로컬 시간 기준, 시간대 정보 없음**입니다. `<input type="date">`가 쓰는 형태와 같습니다.
- 처음에는 `Date`를 받았는데, 한국(UTC+9)에서 `toISOString()`으로 서버에 보내면 로컬 자정이 UTC로 바뀌며 **하루가 밀렸습니다.** 문자열로 바꾸자 이 문제가 구조적으로 사라졌습니다.
- `Date`가 필요하면 `parseDateValue("2026-10-15")`, 반대는 `formatDateValue(date)`를 씁니다. `parseDateValue`는 `"2026-02-30"` 같은 달력상 없는 날짜를 `null`로 돌려줍니다.
- 서버가 UTC를 요구하면 **보내는 쪽에서 변환**합니다. 컴포넌트 값에는 시간대를 섞지 않습니다.

### 3.4 값이 흐르는 방향

```
사용자 클릭 → Calendar.onChange("2026-10-15")
            → DatePicker: 제어 모드면 부모 onChange, 비제어면 내부 state 저장
            → 입력창은 읽기 전용이고 현재 값을 그대로 표시만 한다
            → 같은 클릭에서 팝업 닫기 + 입력창으로 포커스 복귀
```

- 입력창에 값을 직접 쓰는 코드는 없습니다. **입력창에 보이는 값과 실제 값이 어긋날 수 없습니다.**
- `name`을 주면 입력창 값이 그대로 `FormData`로 제출되고, `ref`는 `<input>`에 연결됩니다.
- TimePicker는 팝오버 안에서 고르는 값을 "임시값"으로 두고 **"확인"을 눌러야 `onChange`가 호출**됩니다. Esc·바깥 클릭은 임시값을 버립니다.

### 3.5 패널의 `onChange`는 "즉시"

`Calendar`와 `TimePanel`은 항목을 누를 때마다 `onChange`를 호출합니다(확정 개념 없음). "확인"으로 확정할지는 래퍼가 정합니다. 그래서 DateTimePicker가 두 패널의 임시값을 모아서 한 번에 확정할 수 있습니다.

### 3.6 재구성 진행 상황

- 완료: `Popover`(공개 원시 요소), `Calendar`(패널, `onSelect` 추가), `TimePanel`(패널), `Input.fieldRef`, `DatePicker`/`TimePicker`를 원시 요소 위의 래퍼로 재작성, `formatDateValue`/`parseDateValue`.
- 내부 헬퍼: `_internal/PickerTriggerInput`은 "읽기 전용 Input + 아이콘 버튼"만 감싼 내부용이며 팝업 로직이 없습니다. 래퍼 3개가 같은 트리거 코드를 복사하지 않게 둔 것입니다. 옛 `_internal/PickerField`는 삭제했습니다.
- 완료(2단계): `DateTimePicker`. 입력창에는 `2026-10-20 09:30`(사람이 읽는 형태)로 보여 주고, 값은 `"2026-10-20T09:30"`입니다. `name`을 주면 **보이는 입력창이 아니라 숨은 input**에 붙어 폼에는 `T` 형식이 제출됩니다. 날짜와 시간을 둘 다 골라야 "확인"이 켜집니다. 헬퍼 `parseDateTimeValue`/`formatDateTimeValue`를 export합니다.
- `min`/`max`는 날짜(`YYYY-MM-DD`)만 지원합니다. 시각 단위 제한은 아직 없습니다.
- `TimePicker.onChange`의 타입을 `string | null`에서 `string`으로 바꿨습니다(null을 낸 적이 없었음). `DatePicker`가 닫을 때 쓰던 `data-date` 클릭 감지는 없애고 `Calendar.onSelect`와 Popover의 `close()`로 바꿨습니다.

### 3.7 Popover의 제약

- `role` prop(`"dialog" | "listbox" | "menu"`, 기본 `"dialog"`)으로 팝업의 ARIA 역할을 바꿀 수 있습니다. `Select`는 `"listbox"`를 씁니다.

- 화면 가장자리 충돌 처리가 없습니다. 가로 배치(`orientation="horizontal"`)에서 뷰포트가 좁으면(예: 700px에서 443px 팝업) 팝업이 오른쪽으로 몇 px 잘릴 수 있습니다. `DateTimePicker`는 `placement`를 노출하지 않습니다.
- `body` 포털을 쓰지 않고 컨테이너 안에 그리므로, `overflow: hidden`인 조상 안에서는 팝업이 잘릴 수 있습니다.
- 팝오버 안에서 Esc는 포커스가 팝오버 컨테이너 안에 있을 때만 처리됩니다. Modal 안에서 쓰면 Esc 1회는 팝오버만, 2회째에 모달이 닫힙니다.
- 기준 요소를 등록하지 않으면 컨테이너 전체가 기준이고, `Input`에는 `fieldRef`에 `anchorRef`를 넘기면 입력 박스가 기준이 됩니다.

---

## 4. `useOverlay` deep dive

### 4.1 무엇을 해결하나

모달을 선언적으로 쓰면 "열림 여부 state + 결과를 받을 콜백 + 렌더 위치"를 컴포넌트마다 만들어야 합니다.

```tsx
// Before — 확인 모달 하나에 state와 JSX가 필요하다
const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)} />
<Modal open={open} onClose={() => setOpen(false)} actions={...} />
```

`useOverlay`는 이를 **함수 호출**로 바꿉니다. 특히 확인/취소처럼 "사용자의 선택을 받아 이어서 처리"하는 흐름이 `await`로 읽힙니다.

```tsx
const ok = await overlay.openAsync<boolean>(({ isOpen, close }) => (
  <Modal open={isOpen} onClose={() => close(false)} actions={...} />
));
if (ok) await blockUser(userId);
```

### 4.2 구성 요소

| 파일                          | 내용                                             |
| ----------------------------- | ------------------------------------------------ |
| `overlay/overlay-context.ts`  | 타입(`OverlayApi`, `OverlayRender`…)과 Context   |
| `overlay/OverlayProvider.tsx` | 상태 보관, overlay 렌더링, Promise 정산          |
| `overlay/useOverlay.ts`       | `use(OverlayContext)` + Provider 밖 호출 시 에러 |

### 4.3 두 개의 상태 저장소

```
OverlayProvider
├─ items: OverlayItem[]            ← React state. 화면에 그릴 overlay 목록 (id, isOpen, render)
└─ refs (렌더를 일으키지 않는 기록)
   ├─ resolvers   id → Promise resolve 함수
   ├─ pendingPromises  id → 진행 중인 Promise  (같은 id 중복 호출 처리)
   ├─ exitDelays  id → 제거 지연(ms).  "이 id를 알고 있다"는 표식이기도 함
   ├─ timers      id → 제거 예약 타이머
   └─ counter     자동 id 발급용
```

- **화면을 바꾸는 것만 state**에 두고, Promise/타이머 같은 부수 정보는 ref에 둡니다. Promise 정산이 리렌더를 일으키지 않습니다.
- **API 객체는 `useMemo(…, [])`로 한 번만 만듭니다.** Context 값이 절대 바뀌지 않으므로 `useOverlay()`를 호출하는 컴포넌트는 overlay가 열리고 닫혀도 **다시 렌더되지 않습니다.** `useEffect` 의존성에 넣어도 안전합니다.

### 4.4 수명 주기

```
          open()                close(value)              exitDelay 경과
(없음) ─────────▶ isOpen=true ─────────────▶ isOpen=false ─────────────▶ (제거)
                    │                            │ (Promise 정산)             ▲
                    │ exit() ────────────────────┴────────────────────────────┘
                    └ 즉시 제거 (Promise는 undefined로 정산)
```

| 호출                       | isOpen | Promise                       | 트리에서                 |
| -------------------------- | ------ | ----------------------------- | ------------------------ |
| `open()`                   | true   | —                             | 추가                     |
| `close(value)` (render 안) | false  | `value`로 정산                | `exitDelay` 뒤 제거      |
| `overlay.close(id)`        | false  | `undefined`로 정산            | `exitDelay` 뒤 제거      |
| `closeAll()`               | false  | 각각 `undefined`              | `exitDelay` 뒤 제거      |
| `exit(id)`                 | —      | 아직 안 끝났다면 `undefined`  | 즉시 제거                |
| Provider 언마운트          | —      | 대기 중인 것 모두 `undefined` | 전체 사라짐, 타이머 정리 |

- `isOpen`이 `false`가 된 뒤에도 `exitDelay` 동안은 트리에 남습니다. 닫힘 애니메이션을 그리려는 장치입니다. 기본값 0이면 사실상 바로 제거됩니다.
- 지금 `Modal`은 `open={false}`이면 `null`을 반환하므로 애니메이션이 없어 `exitDelay`를 쓸 일이 없습니다.

### 4.5 Promise 의미론

- 반환 타입은 `Promise<T | undefined>`입니다. 값 없이 닫히는 경로가 있으므로 `T`만으로는 거짓말이 됩니다.
- **한 번만 정산됩니다.** 정산 시 resolver를 지우므로, `close(true)` 뒤에 `closeAll()`이 불려도 첫 값이 유지됩니다.
- 바깥 클릭·Esc 같은 "취소" 경로에도 값을 정해 두면 `undefined` 분기를 신경 쓰지 않아도 됩니다.
  ```tsx
  onClose={() => close(false)}   // 바깥 클릭/Esc도 false
  ```
- 같은 `overlayId`로 `openAsync`를 다시 부르면 **새로 열지 않고 진행 중인 Promise를 그대로** 돌려줍니다. 두 호출이 같은 값으로 끝납니다.

### 4.6 렌더링

```tsx
<OverlayContext value={api}>
  {children}
  {items.map(({ id, isOpen, render }) => (
    <Fragment key={id}>
      {render({ overlayId: id, isOpen, close, exit })}
    </Fragment>
  ))}
</OverlayContext>
```

- overlay는 **Provider 위치의 DOM 안**에 그려집니다(포털 아님). 이유는 2.3 참고.
- 쌓임 순서는 `items` 배열 순서(= 연 순서)입니다. 모달은 모두 `fixed` + 같은 `z-index`라서 DOM 뒤쪽(나중에 연 것)이 위에 보입니다.
- `key={id}`라서 같은 id가 다시 열리면 새 인스턴스로 만들어집니다.

### 4.7 주의할 점 (사용자 관점)

1. **`render`는 열 때의 클로저를 씁니다.** overlay 안에서 계속 바뀌는 값(입력값 등)을 클로저로 읽으면 열 때 값에 고정됩니다. 상태가 필요하면 render가 **상태를 가진 컴포넌트를 반환**하고, 그 컴포넌트가 직접 `close(value)`를 부르세요.
2. **열었던 컴포넌트가 사라져도 overlay는 남습니다.** Provider가 소유하기 때문입니다. 화면 이동 시 같이 닫으려면 `useEffect` 정리 함수에서 `closeAll()`이나 `close(id)`를 호출하세요.
3. **Provider 밖에서는 쓸 수 없습니다.** `useOverlay는 <OverlayProvider> 안에서만 사용할 수 있어요.` 에러가 납니다.
4. 포털이 아니라서 **`overflow: hidden`/`transform`을 가진 조상** 안에 Provider를 두면 `position: fixed`가 그 조상 기준이 될 수 있습니다. Provider는 앱 최상단에 두세요.

### 4.8 이번에 고친 동작 3가지

`useOverlay` 구현을 다시 읽으며 발견해서 고쳤고, Storybook `Hooks/useOverlay`에 회귀 스토리를 두었습니다.

| 증상                                                                                  | 원인                                                                                                     | 수정                                                                               |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 모달이 쌓였을 때 Esc가 **맨 아래(가장 먼저 연) 모달 하나만** 닫음                     | `onClose`가 렌더마다 새로 만들어져 리스너가 해제·재등록되고, 디스패치 도중 해제된 리스너는 호출되지 않음 | `Modal`이 `onClose`를 ref로 참조하고, 열린 모달 스택의 **맨 위 하나만** Esc에 반응 |
| 닫히는 중(`exitDelay` 대기)에 같은 id로 다시 열면 새 overlay가 지워질 수 있음         | 이전 close가 예약한 제거 타이머가 그대로 남아 새 overlay를 제거                                          | `open`이 같은 id의 예약된 제거를 취소                                              |
| 같은 `overlayId`로 `openAsync`를 두 번 부르면 앞의 Promise가 영영 끝나지 않을 수 있음 | resolver를 덮어써서 앞 호출의 resolver가 사라짐                                                          | 같은 id가 진행 중이면 그 Promise를 재사용 (`pendingPromises`)                      |

- Esc 문제는 브라우저에서 재현해 원인을 확인했고(1번째 모달만 닫힘), 고친 뒤 맨 위부터 하나씩 닫히는 것을 확인했습니다.
- 나머지 두 개는 코드를 읽다 발견했고 수정 전 상태를 따로 재현하지는 않았습니다. 수정 후 동작은 스토리(`ReopenWhileClosing`, `DuplicateOverlayId`)로 확인했습니다.

### 4.9 Toss `overlay-kit`과 비교

| 항목           | `useOverlay` (FDS)                      | `overlay-kit` (Toss)                               |
| -------------- | --------------------------------------- | -------------------------------------------------- |
| 호출 위치      | 훅 `useOverlay()` (React 안)            | 전역 `overlay.open()`도 제공 (React 밖에서도 호출) |
| Provider       | `<OverlayProvider>` 필요                | `<OverlayProvider>` 필요                           |
| 비동기 결과    | `openAsync` → `Promise<T \| undefined>` | `openAsync` → `Promise<T>`                         |
| 닫기/제거 분리 | `close` + `exit` + `exitDelay`          | `close` + `unmount`                                |
| 그리는 위치    | Provider 위치 (포털 없음)               | Provider 위치                                      |

FDS 쪽이 더 작고 단순하며, "React 밖에서 호출"은 지원하지 않습니다.

### 4.10 테스트 방법

Storybook의 `Hooks/useOverlay`에서 확인합니다.

| 스토리               | 확인하는 것                                       |
| -------------------- | ------------------------------------------------- |
| `Open`               | `open` + `close()`                                |
| `Confirm`            | `openAsync`로 선택을 `await`, 이어서 두 번째 모달 |
| `Stacked`            | 쌓기, 맨 위부터 Esc, `closeAll`                   |
| `ReopenWhileClosing` | 닫는 중 재오픈                                    |
| `DuplicateOverlayId` | 같은 id 중복 `openAsync`                          |

---

## 5. 결정 기록

| 결정                                                   | 이유                                                                                                                                                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Radix 제거                                             | 코드에서 import하는 곳이 없었음                                                                                                                                                            |
| `forwardRef` 제거 → `ref` prop                         | React 19부터 불필요                                                                                                                                                                        |
| 모노레포(core / storybook / docs)                      | 배포 대상과 개발·문서 도구를 분리                                                                                                                                                          |
| 토큰을 변수 하나 + `data-theme`로 전환                 | 컴포넌트마다 `dark:` 클래스를 붙이지 않기 위해                                                                                                                                             |
| docs에서 Storybook 임베드 안 함                        | Storybook은 개발자용 샌드박스, docs는 예쁜 문서                                                                                                                                            |
| AdBanner 삭제                                          | 사용자 요청                                                                                                                                                                                |
| VodList 삭제                                           | 도메인 데이터 모양(`badgeLabel`, `timestamp`)에 묶인 데이터 배열 API라 조합이 막히고, 클릭 행이 `div role="button"`이라 링크로 못 씀. `Thumbnail`/`Badge`/`Text`를 앱에서 조합하는 게 맞음 |
| DatePicker 값을 `Date` → `"YYYY-MM-DD"`                | 시간대로 하루가 밀리는 문제를 구조적으로 제거, 폼·JSON·TimePicker와 일관                                                                                                                   |
| DatePicker를 Calendar와 분리                           | 달력만 모달/인라인에 쓰거나 다른 트리거로 열 수 있게                                                                                                                                       |
| 날짜/시간을 원시 요소 + 얇은 래퍼로 재구성             | 입력창은 이미 `Input`이 있으니 새 컴포넌트 없이 꽂을 수 있게. 래퍼는 자주 쓰는 조합의 편의로만 남김                                                                                        |
| `Date.DateTime` 같은 `Date` 네임스페이스는 쓰지 않음   | `Date`를 export하면 JS 내장 `Date`를 덮어씀                                                                                                                                                |
| TimePicker는 "확인"으로 확정 (antd 방식)               | 휠/모달 방식을 시도했으나 사용자가 antd 방식 + 스크롤 목록 유지를 선택                                                                                                                     |
| 보조 텍스트(글자수·에러·설명)를 `text-caption-2`(11px) | 입력창 아래 보조 문구로 12px이 커 보였음                                                                                                                                                   |

---

## 6. 알려진 한계와 열린 과제

- **docs 보류**: `docs/components/broadcast/vod-list.mdx`는 삭제된 컴포넌트를 가져와 그 페이지만 렌더 에러가 납니다. DatePicker·Calendar 페이지도 이전 `Date` 기준 설명입니다. 일괄 수정 목록은 메모리에 기록돼 있습니다.
- **lint 에러 6건**: 스토리의 `render` 안에서 훅을 호출하는 오래된 패턴(`rules-of-hooks`). 동작에는 영향이 없습니다.
- **번들 크기**: 이모지 PNG가 base64로 core 번들에 들어가 약 564KB입니다.
- **DateTimePicker 스토리 `WithOverlayModal`**: 모달 안에서 고르는 값을 들고 있는 스토리 전용 헬퍼 컴포넌트(`PickerModalBody`)가 있습니다. `useOverlay`의 `render`가 열 때의 클로저를 쓰기 때문에 상태를 가진 컴포넌트가 필요해서입니다. 스토리 네이밍 규칙(없는 컴포넌트처럼 보이는 PascalCase 헬퍼 금지)과 어긋나므로, 공개 `DateTimePanel`을 만들어 대체할지 정해야 합니다.
- **Textarea에 `description` 없음**: 글자수와 같은 줄에 둘지 정해야 합니다.
- **`useOverlay` 편의 함수 없음**: `overlay.confirm({...})` 같은 한 줄 호출은 아직 없습니다.
- **React 밖에서 overlay 호출 불가**: 훅 기반이라 axios 인터셉터 같은 곳에서 직접 열 수 없습니다.
- **스크롤 잠금 / 포커스 트랩 없음**: `Modal`은 배경 스크롤을 잠그거나 포커스를 가두지 않습니다. 쌓인 모달 접근성은 개선 여지가 있습니다.
- **Provider 위치 제약**: 포털을 쓰지 않으므로 Provider를 `transform`/`overflow` 조상 안에 두면 안 됩니다.
- **타이포 토큰 등록 수동 관리**: `cn.ts`의 토큰 목록을 `typography.css`와 수동으로 맞춰야 합니다. 빌드 시 자동 검증이 없습니다.
- **글자 간격 단위 가정**: Figma의 `letterSpacing` 값을 % 단위로 해석해 em으로 환산했습니다. 단위가 다르면 토큰 값이 달라집니다.
