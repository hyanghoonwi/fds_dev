---
slug: /intro
sidebar_position: 1
---

# 소개

FDS(Futurewiz Design System)는 어드민과 방송 화면을 위한 React 컴포넌트와 Figma 기준 디자인 토큰을 제공합니다. React 19, TypeScript, Tailwind CSS 4 기반입니다.

## 패키지

| 패키지           | 역할                                                                              |
| ---------------- | --------------------------------------------------------------------------------- |
| `@fds/core`      | 컴포넌트, 아이콘, 디자인 토큰. 배포되는 라이브러리입니다.                         |
| `@fds/storybook` | 컴포넌트별 개발·확인용 샌드박스. 컨트롤로 prop을 바꿔 보고 접근성을 점검합니다.   |
| `@fds/docs`      | 지금 보고 있는 문서 사이트. `@fds/core` 컴포넌트를 그대로 렌더링해서 보여 줍니다. |

Storybook은 개발자가 컴포넌트를 만들고 확인하는 곳이고, 이 문서는 사용하는 쪽에서 읽는 가이드입니다.

## 설치

```bash
npm install @fds/core
```

앱 진입점에서 스타일을 한 번 불러오고, 컴포넌트를 가져와 씁니다.

```tsx
import "@fds/core/style.css";
import { Button } from "@fds/core";

export function Example() {
  return <Button variant="primary">재접속</Button>;
}
```

`style.css`에는 Tailwind 리셋(preflight)이 포함돼 있습니다. 이미 자체 리셋이 있는 앱이나 Docusaurus 같은 문서 사이트에 붙일 때는 리셋이 없는 `@fds/core/style.no-reset.css`를 대신 불러오세요. 컴포넌트가 의존하는 최소 스타일만 들어 있습니다.

## 다크 모드

`<html data-theme="dark">`처럼 상위 요소에 `data-theme="dark"`를 지정하면 모든 토큰이 다크 값으로 바뀝니다. 컴포넌트마다 `dark:` 클래스를 붙일 필요가 없습니다.

## 컴포넌트 구성

컴포넌트는 세 층으로 나뉩니다.

- **원시 요소**: 한 가지 일만 하는 조각입니다. 입력창 아래에 뜨는 오버레이(`Popover`), 달력 패널(`Calendar`), 시/분 목록 패널(`TimePanel`), 라벨·에러 배치(`FormField`)가 여기에 속합니다. 필요하면 직접 조합할 수 있습니다.
- **얇은 래퍼**: 자주 쓰는 조합을 미리 엮어 둔 것입니다. `DatePicker`, `TimePicker`, `DateTimePicker`는 `Input` + `Popover` + 패널의 조합일 뿐 고유 로직이 없어서, 같은 방식으로 직접 조합해도 됩니다.
- **필드 prop이 내장된 폼 컨트롤**: `Input`, `Textarea`, `Select`, `CheckboxGroup`, `RadioGroup`은 `label`, `orientation`(라벨 위치), `required`, `description`, `error`를 prop으로 받습니다. 라벨과 에러를 따로 조립하지 않아도 접근성 연결(`htmlFor`, `aria-describedby`)이 함께 처리됩니다.

### 값의 형태

날짜와 시간 값은 모두 **문자열**이고 시간대 정보가 없는 로컬 기준입니다.

| 컴포넌트         | 값                   | 예시                 |
| ---------------- | -------------------- | -------------------- |
| `DatePicker`     | `"YYYY-MM-DD"`       | `"2026-10-15"`       |
| `TimePicker`     | `"HH:mm"` (24시간)   | `"09:30"`            |
| `DateTimePicker` | `"YYYY-MM-DDTHH:mm"` | `"2026-10-15T09:30"` |

`Date` 객체를 쓰지 않으므로 `toISOString()`으로 서버에 보낼 때 하루가 밀리는 문제가 없습니다. 서버가 UTC를 요구하면 보내는 쪽에서 변환하세요. 폼에서는 `name`을 주면 같은 문자열이 그대로 제출됩니다.

## 다음으로 볼 곳

- 폼의 기본: [Input](./components/common/input.mdx), [Textarea](./components/common/textarea.mdx)
- 날짜와 시간: [DatePicker](./components/common/date-picker.mdx), [TimePicker](./components/common/time-picker.mdx)
- 모달과 확인창: [Modal](./components/common/modal.mdx), [useOverlay](./api/use-overlay.mdx)
- 색상과 글자: [Colors](./foundations/colors.mdx), [Typography](./foundations/typography.mdx), [Icons](./foundations/icons.mdx)
