// Vuesax Linear · Figma node 46:6016
import type { IconProps } from "./MoonIcon";

export function MobileIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={(size * 17.5) / 21.5} height={size} viewBox="0 0 17.5 21.5" fill="none" {...props}>
      <path
        d="M16.75 5.75V15.75C16.75 19.75 15.75 20.75 11.75 20.75H5.75C1.75 20.75 0.75 19.75 0.75 15.75V5.75C0.75 1.75 1.75 0.75 5.75 0.75H11.75C15.75 0.75 16.75 1.75 16.75 5.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.75 4.25H6.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.75 17.85C9.60604 17.85 10.3 17.156 10.3 16.3C10.3 15.444 9.60604 14.75 8.75 14.75C7.89396 14.75 7.2 15.444 7.2 16.3C7.2 17.156 7.89396 17.85 8.75 17.85Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
