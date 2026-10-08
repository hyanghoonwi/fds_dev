import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const textVariants = cva("m-0 font-fds", {
  variants: {
    variant: {
      title: "text-[13px] font-semibold text-text-primary",
      caption: "text-caption-1 text-text-timestamp",
    },
  },
  defaultVariants: {
    variant: "title",
  },
});

export type TextAs = "p" | "span";

export interface TextProps extends ComponentProps<"span">, VariantProps<typeof textVariants> {
  as?: TextAs;
}

export function Text({ as: Component = "span", variant, className, ref, ...props }: TextProps) {
  // p/span 모두 인라인 텍스트 속성만 쓰므로 span 타입으로 통일
  const Tag = Component as "span";
  return <Tag ref={ref} className={cn(textVariants({ variant }), className)} {...props} />;
}
