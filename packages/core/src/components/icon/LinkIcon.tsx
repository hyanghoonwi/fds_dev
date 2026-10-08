import type { IconProps } from "./MoonIcon";

export function LinkIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M13.06 10.94C15.31 13.19 15.31 16.83 13.06 19.07C10.81 21.31 7.17 21.32 4.93 19.07C2.69 16.82 2.68 13.18 4.93 10.94"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.59 13.41C8.25 11.07 8.25 7.27 10.59 4.92C12.93 2.57 16.73 2.58 19.08 4.92C21.43 7.26 21.42 11.06 19.08 13.41"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
