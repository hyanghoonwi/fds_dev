import type { IconProps } from "./MoonIcon";

export function SidebarIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M20.9729 14.7001V9.30012C20.9729 4.80012 19.1729 3.00012 14.6729 3.00012H9.27293C4.77293 3.00012 2.97293 4.80012 2.97293 9.30012V14.7001C2.97293 19.2001 4.77293 21.0001 9.27293 21.0001H14.6729C19.1729 21.0001 20.9729 19.2001 20.9729 14.7001Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14.6726 3.00012V21.0001" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M8.37292 9.69604L10.6769 12L8.37292 14.304"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
