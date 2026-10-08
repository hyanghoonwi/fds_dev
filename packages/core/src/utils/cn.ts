import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * 타이포 토큰(styles/typography.css의 `--text-*`)이 만드는 `text-title-1`, `text-caption-2` 같은 유틸리티 이름.
 * tailwind-merge는 이 이름을 모르면 글자 색(`text-text-caption`)과 같은 그룹으로 보고 앞의 것을 지워 버린다.
 * 그래서 글자 크기(font-size) 그룹으로 등록한다. 토큰을 추가하면 여기에도 추가해야 한다.
 */
const TYPOGRAPHY_TOKENS = [
  "display-1",
  "display-2",
  "display-3",
  "title-1",
  "title-2",
  "title-3",
  "title-bold-14",
  "heading-1",
  "heading-2",
  "headline-1",
  "headline-2",
  "label-1-normal",
  "label-1-reading",
  "label-2",
  "label-semibold-14",
  "label-semibold-13",
  "label-semibold-12",
  "label-semibold-11",
  "caption-1",
  "caption-2",
  "body-1",
  "body-2",
  "body-1-normal",
  "body-medium-15",
  "body-medium-14",
  "body-medium-11",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: TYPOGRAPHY_TOKENS }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
