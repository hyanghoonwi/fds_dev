// Vuesax Linear · Figma node 46:3314
import type { IconProps } from "./MoonIcon";

export function UndoIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M7.13 18.31H15.13C17.89 18.31 20.13 16.07 20.13 13.31C20.13 10.55 17.89 8.31 15.13 8.31H4.13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.43 10.81L3.87 8.25L6.43 5.69"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
