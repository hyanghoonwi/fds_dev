import type { IconProps } from "./MoonIcon";

export function MinusIcon({ size = 8, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 8 8" fill="none" {...props}>
      <path d="M0.5 4H7.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
