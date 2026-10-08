import { cn } from "../../utils/cn";

export interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 20, className }: SpinnerProps) {
  return (
    <svg
      className={cn("origin-center animate-[fds-spin_0.8s_linear_infinite]", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="status"
      aria-label="로딩 중"
    >
      <circle className="fill-none stroke-border-line" cx="12" cy="12" r="10" strokeWidth="3" />
      <circle
        className="fill-none stroke-brand-primary"
        cx="12"
        cy="12"
        r="10"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="42 21"
      />
    </svg>
  );
}
