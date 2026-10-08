---
slug: /intro
sidebar_position: 1
---

# 소개

FDS는 Futurewiz 방송 화면을 위한 디자인 시스템입니다. React 19 컴포넌트와 Figma 기준 디자인 토큰을 제공합니다.

## 설치

```bash
npm install @fds/core
```

```tsx
import "@fds/core/style.css";
import { Button } from "@fds/core";

export function Example() {
  return <Button variant="primary">재접속</Button>;
}
```

## 다크 모드

`<html data-theme="dark">`처럼 상위 요소에 `data-theme="dark"`를 지정하면 모든 토큰이 다크 값으로 바뀝니다.
