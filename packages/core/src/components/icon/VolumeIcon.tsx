import type { IconProps } from "./MoonIcon";

export function VolumeIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M3.33 10V14C3.33 16 4.33 17 6.33 17H7.76C8.13 17 8.5 17.11 8.82 17.3L11.74 19.13C14.26 20.71 16.33 19.56 16.33 16.59V7.41C16.33 4.43 14.26 3.29 11.74 4.87L8.82 6.7C8.5 6.89 8.13 7 7.76 7H6.33C4.33 7 3.33 8 3.33 10Z"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path d="M19.33 8C21.11 10.37 21.11 13.63 19.33 16" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
