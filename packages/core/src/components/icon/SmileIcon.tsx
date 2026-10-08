import type { IconProps } from "./MoonIcon";

export function SmileIcon({ size = 26, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 26 26" fill="none" {...props}>
      <rect
        x="9.76016"
        y="10.2908"
        width="0.0102917"
        height="0.0102917"
        transform="rotate(90 9.76016 10.2908)"
        stroke="currentColor"
        strokeWidth="2.4375"
        strokeLinejoin="round"
      />
      <rect
        x="16.2602"
        y="10.2908"
        width="0.0102917"
        height="0.0102917"
        transform="rotate(90 16.2602 10.2908)"
        stroke="currentColor"
        strokeWidth="2.4375"
        strokeLinejoin="round"
      />
      <path
        d="M16.7545 15.1658C16.0052 16.4611 14.6048 17.3325 13.0009 17.3325C11.3969 17.3325 9.99651 16.4611 9.24725 15.1658"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
