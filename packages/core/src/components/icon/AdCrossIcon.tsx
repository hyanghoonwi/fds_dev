import { cn } from "../../utils/cn";
import { AdIcon, type AdIconProps } from "./AdIcon";

// AdIcon의 끄기 짝 (VolumeIcon / VolumeCrossIcon과 같은 on/off 쌍).
// 배지 위에 사선을 긋지 않고 오른쪽 위 모서리에 X를 걸쳐, 12px "Ad" 글자를 가리지 않는다.
export function AdCrossIcon({ className, ...props }: AdIconProps) {
  return (
    <AdIcon className={cn("relative", className)} {...props}>
      <svg
        className="absolute -top-[5px] -right-[7px] rounded-full bg-bg-surface shadow-[0_0_0_1px_var(--color-bg-surface)]"
        xmlns="http://www.w3.org/2000/svg"
        width={10}
        height={10}
        viewBox="0 0 10 10"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2.5 2.5L7.5 7.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M7.5 2.5L2.5 7.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </AdIcon>
  );
}
