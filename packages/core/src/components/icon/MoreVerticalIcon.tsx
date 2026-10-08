// Vuesax Linear · 파생: MoreHorizontal(46:7616)의 x/y 좌표를 맞바꿔 만든 세로 점 (Figma에 세로 버전 없음)
import type { IconProps } from "./MoonIcon";

export function MoreVerticalIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M10 5C10 3.9 10.9 3 12 3C13.1 3 14 3.9 14 5C14 6.1 13.1 7 12 7C10.9 7 10 6.1 10 5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 19C10 17.9 10.9 17 12 17C13.1 17 14 17.9 14 19C14 20.1 13.1 21 12 21C10.9 21 10 20.1 10 19Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 12C10 10.9 10.9 10 12 10C13.1 10 14 10.9 14 12C14 13.1 13.1 14 12 14C10.9 14 10 13.1 10 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
