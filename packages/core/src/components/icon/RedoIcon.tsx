// Vuesax Linear · Figma node 46:3328
import type { IconProps } from "./MoonIcon";

export function RedoIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M16.87 18.31H8.87C6.11 18.31 3.87 16.07 3.87 13.31C3.87 10.55 6.11 8.31 8.87 8.31H19.87"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.57 10.81L20.13 8.25L17.57 5.69"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
