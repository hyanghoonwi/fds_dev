import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

// 1. 버튼 스타일 및 Variant 정의
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-black text-white hover:bg-gray-800",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        outline:
          "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-900",
        ghost: "hover:bg-gray-100 text-gray-900",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

// 2. Props 타입 정의
interface ButtonOwnProps extends VariantProps<typeof buttonVariants> {
  /** 버튼에 표시할 텍스트 */
  label: React.ReactNode;
  /** 라벨 왼쪽에 붙는 아이콘 등 부속 요소 */
  leftAddon?: React.ReactNode;
  /** 라벨 오른쪽에 붙는 아이콘 등 부속 요소 */
  rightAddon?: React.ReactNode;
}

// href가 있으면 <a>, 없으면 <button>으로 렌더링되는 유니온 타입
type ButtonAsButtonProps = ButtonOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | keyof ButtonOwnProps> & {
    href?: undefined;
  };

type ButtonAsAnchorProps = ButtonOwnProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | keyof ButtonOwnProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

// 3. Button 컴포넌트 구현 (ref 전달을 위해 forwardRef 사용)
export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant, size, label, leftAddon, rightAddon, href, ...props }, ref) => {
    const content = (
      <>
        {leftAddon && <span className="inline-flex items-center">{leftAddon}</span>}
        {label}
        {rightAddon && <span className="inline-flex items-center">{rightAddon}</span>}
      </>
    );

    if (href !== undefined) {
      return (
        <a
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";
