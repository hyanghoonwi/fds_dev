/**
 * 입력 필드(Input·Select·DatePicker 등)가 함께 쓰는 크기. 박스 높이는 md 42px, sm 36px이다.
 * sm은 Button md(36px)와 한 줄에 놓았을 때 높이가 맞는다.
 */
export type FieldSize = "sm" | "md";

/** 입력 글자의 타이포와 위아래 패딩. 박스 높이 = 줄 높이 + 패딩 */
export const fieldTextClass: Record<FieldSize, string> = {
  md: "py-2.5 text-sm leading-[1.571] tracking-[0.0145em]",
  sm: "py-[9px] text-[13px] leading-[1.385] tracking-[0.0194em]",
};
