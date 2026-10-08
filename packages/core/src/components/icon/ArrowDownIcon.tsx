import type { IconProps } from "./MoonIcon";

export function ArrowDownIcon({ size = 32, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 32" fill="none" {...props}>
      <path
        d="M16 21.5L16 10.5M11.7574 17.2574L16 21.5L20.2426 17.2574"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
