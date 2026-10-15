/**
 * 컴포넌트 공통 크기. 기본은 `md`이고, 크기 옵션이 있는 컴포넌트는 모두 같은 이름(sm·md·lg·xl)을 쓴다.
 */
export type ComponentSize = "sm" | "md" | "lg" | "xl";

/** 입력 필드(Input·Select·DatePicker 등)의 크기. 박스 높이는 sm 36 · md 42 · lg 48 · xl 56px */
export type FieldSize = ComponentSize;

/** 입력 글자의 타이포와 위아래 패딩. 박스 높이 = 줄 높이 + 패딩 */
export const fieldTextClass: Record<FieldSize, string> = {
  sm: "py-[9px] text-[13px] leading-[1.385] tracking-[0.0194em]",
  md: "py-2.5 text-sm leading-[1.571] tracking-[0.0145em]",
  lg: "py-3 text-base leading-normal tracking-[0.0057em]",
  xl: "py-[15px] text-[18px] leading-[1.445] tracking-[-0.0002em]",
};

/** 필드 박스의 좌우 패딩 */
export const fieldPaddingXClass: Record<FieldSize, string> = {
  sm: "px-2.5",
  md: "px-2.5",
  lg: "px-3",
  xl: "px-4",
};

/** 필드 라벨(`label`)의 타이포. 컨트롤 크기에 맞춰 같이 커진다. */
export const fieldLabelClass: Record<FieldSize, string> = {
  sm: "text-[13px] leading-[1.385] font-semibold tracking-[0.0194em]",
  md: "text-label-1-normal",
  lg: "text-[15px] leading-[1.467] font-semibold",
  xl: "text-base leading-normal font-semibold",
};

/** 가로 배치에서 라벨 줄을 박스 첫 줄 중심에 맞추는 위쪽 여백 = (박스 높이 − 라벨 줄 높이) / 2 */
export const fieldLabelOffsetClass: Record<FieldSize, string> = {
  sm: "pt-[9px]",
  md: "pt-[11px]",
  lg: "pt-[13px]",
  xl: "pt-4",
};

/** 설명(`description`)·에러 메시지·글자수 같은 보조 문구의 타이포 */
export const fieldHelpClass: Record<FieldSize, string> = {
  sm: "text-caption-2",
  md: "text-caption-2",
  lg: "text-caption-1",
  xl: "text-[13px] leading-[1.385]",
};

/** Select 목록의 옵션·안내 문구 글자 크기 */
export const fieldOptionTextClass: Record<FieldSize, string> = {
  sm: "text-[13px]",
  md: "text-sm",
  lg: "text-base",
  xl: "text-base",
};

/** addon 아이콘(svg) 크기 */
export const fieldIconClass: Record<FieldSize, string> = {
  sm: "[&>svg]:size-5",
  md: "[&>svg]:size-5",
  lg: "[&>svg]:size-6",
  xl: "[&>svg]:size-6",
};

/**
 * 체크박스·라디오·스위치처럼 선택 컨트롤 옆에 붙는 라벨의 타이포와, 컨트롤 박스 크기.
 * `box`는 체크/라디오 박스 한 변(sm 16 · md 20 · lg 24 · xl 28px), `indent`는 에러 메시지를 라벨 글자에 맞추는 왼쪽 여백(박스 + gap 8px)
 */
export const choiceSizeClass: Record<
  ComponentSize,
  {
    box: string;
    label: string;
    help: string;
    indent: string;
    check: number;
    minus: number;
    dot: string;
  }
> = {
  sm: {
    box: "size-4",
    label: "text-[13px] leading-4",
    help: "text-caption-2",
    indent: "pl-6",
    check: 14,
    minus: 8,
    dot: "size-2",
  },
  md: {
    box: "size-5",
    label: "text-sm leading-5",
    help: "text-caption-2",
    indent: "pl-7",
    check: 18,
    minus: 10,
    dot: "size-2.5",
  },
  lg: {
    box: "size-6",
    label: "text-base leading-6",
    help: "text-caption-1",
    indent: "pl-8",
    check: 22,
    minus: 12,
    dot: "size-3",
  },
  xl: {
    box: "size-7",
    label: "text-lg leading-7",
    help: "text-[13px] leading-[1.385]",
    indent: "pl-9",
    check: 26,
    minus: 14,
    dot: "size-3.5",
  },
};
