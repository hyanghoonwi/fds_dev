# FDS (Futurewiz Design System)

npm workspaces 기반 모노레포.

| 패키지 | 설명 |
| --- | --- |
| `packages/core` (`@fds/core`) | React 컴포넌트, 아이콘, 디자인 토큰. Vite 라이브러리 모드로 ES/UMD + `style.css` 배포 |
| `packages/storybook` (`@fds/storybook`) | 컴포넌트 스토리, a11y/vitest 테스트. core 소스를 alias로 직접 참조 |
| `packages/docs` | (예정) Docusaurus 문서 사이트 |

## 명령어

```bash
npm install
npm run storybook        # Storybook 개발 서버 (6006)
npm run build            # @fds/core 빌드
npm run build-storybook  # Storybook 정적 빌드
npm run lint
npm run format:docs      # docs 문서/코드 예시를 Prettier 스타일로 정리
```

## 디자인 토큰

`packages/core/src/styles/` — Figma "Design Tokens — Full Reference" 기준.

- `colors.css` — 시맨틱 컬러. `--fds-*` 변수가 `[data-theme="dark"]`에서 값만 바뀌므로 컴포넌트에 `dark:` 클래스가 필요 없다.
- `typography.css` — Text Style (`text-title-1`, `text-body-1`, `text-label-semibold-13` …)
- `shape.css` — 라디우스 (`rounded-4` … `rounded-full`)

## 컴포넌트 작성 규칙

- React 19 기준: `forwardRef` 없이 `ref`를 일반 prop으로 받는다.
- 레이아웃/변형은 prop으로 캡슐화한다.
- 스토리는 `packages/storybook/stories/<component>/`에 두고 `@fds/core`에서 import한다.
