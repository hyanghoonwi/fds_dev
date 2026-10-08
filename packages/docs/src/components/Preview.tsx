import type { ReactNode, CSSProperties } from "react";

interface PreviewProps {
  children: ReactNode;
  /** 박스 안쪽 레이아웃 스타일 (예: flexDirection, maxWidth, minHeight). 박스 자체는 항상 전체 폭이다. */
  style?: CSSProperties;
}

/** 문서 예제용 미리보기 박스. 다크 모드에서는 토큰이 자동으로 전환된다. */
export default function Preview({ children, style }: PreviewProps) {
  return (
    <div
      style={{
        padding: 24,
        marginBottom: 16,
        background: "var(--fds-bg-surface)",
        border: "1px solid var(--fds-border-light)",
        borderRadius: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
}
