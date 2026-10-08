// Vuesax Linear · Figma node 46:9784
import type { IconProps } from "./MoonIcon";

export function ImageIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M21.68 16.96L18.55 9.65C17.49 7.17 15.54 7.07 14.23 9.43L12.34 12.84C11.38 14.57 9.59 14.72 8.35 13.17L8.13 12.89C6.84 11.27 5.02 11.47 4.09 13.32L2.37 16.77C1.16 19.17 2.91 22 5.59 22H18.35C20.95 22 22.7 19.35 21.68 16.96Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.97 8C8.62685 8 9.97 6.65685 9.97 5C9.97 3.34315 8.62685 2 6.97 2C5.31315 2 3.97 3.34315 3.97 5C3.97 6.65685 5.31315 8 6.97 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
