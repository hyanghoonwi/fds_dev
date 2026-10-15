import { useState } from "react";
import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";
import { ChevronLeftIcon } from "../icon/ChevronLeftIcon";
import { ChevronRightIcon } from "../icon/ChevronRightIcon";
import { MoreHorizontalIcon } from "../icon/MoreHorizontalIcon";
import { Select } from "../select/Select";
import type { ComponentSize } from "../_internal/fieldSize";

export interface PaginationProps extends Omit<ComponentProps<"nav">, "onChange" | "children"> {
  /** 전체 항목 수. 전체 페이지 수는 `ceil(totalCount / pageSize)`로 계산한다(항목이 없어도 1페이지). */
  totalCount: number;
  /** 현재 페이지, 1부터 시작 (제어 모드). 범위 밖이면 가까운 페이지로 맞춰서 보여 준다. */
  page?: number;
  /** 처음 페이지 (비제어 모드). 기본 1 */
  defaultPage?: number;
  /** 페이지를 바꿀 때 호출된다. 현재 페이지를 다시 누르면 호출되지 않는다. */
  onPageChange?: (page: number) => void;
  /** 한 페이지에 보여 줄 항목 수 (제어 모드) */
  pageSize?: number;
  /** 처음 페이지 크기 (비제어 모드). 기본은 `pageSizeOptions`의 첫 값, 없으면 20 */
  defaultPageSize?: number;
  /**
   * 페이지 크기를 바꿀 때 호출된다. 크기가 바뀌면 보던 위치가 어긋나므로
   * 컴포넌트가 **1페이지로 돌아가며** `onPageChange(1)`도 함께(크기보다 먼저) 호출된다.
   */
  onPageSizeChange?: (pageSize: number) => void;
  /** 페이지 크기 선택지(예: `[10, 20, 50]`). 주면 오른쪽에 "20개씩 보기" 선택이 나타난다. */
  pageSizeOptions?: number[];
  /** 현재 페이지 양옆에 보여 줄 번호 개수. 기본 1 (`… 4 [5] 6 …`) */
  siblingCount?: number;
  /** 크기. 번호 버튼 한 변은 `sm` 28 · `md` 32 · `lg` 36 · `xl` 40px이고, 페이지 크기 선택(Select)도 같은 크기를 따른다. 기본 `md` */
  size?: ComponentSize;
  /** 왼쪽에 "총 N건"을 보여 줄지 */
  showTotal?: boolean;
}

type PageItem = number | "start-ellipsis" | "end-ellipsis";

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

/**
 * 첫·끝 페이지는 항상 보이고, 현재 페이지 주변만 펼친 뒤 나머지는 `…`로 줄인다.
 * 이동해도 버튼 칸 수(`2·siblingCount + 5`)가 변하지 않게, 가장자리에서는 가운데 구간을 안쪽으로 밀어 준다
 * (`1 2 3 4 5 … 25`, `1 … 4 5 6 … 25`, `1 … 21 22 23 24 25`).
 */
function buildPageItems(page: number, pageCount: number, siblingCount: number): PageItem[] {
  const slots = siblingCount * 2 + 5;
  if (pageCount <= slots) {
    return range(1, pageCount);
  }
  if (page - siblingCount <= 3) {
    return [...range(1, slots - 2), "end-ellipsis", pageCount];
  }
  if (page + siblingCount >= pageCount - 2) {
    return [1, "start-ellipsis", ...range(pageCount - slots + 3, pageCount)];
  }
  return [
    1,
    "start-ellipsis",
    ...range(page - siblingCount, page + siblingCount),
    "end-ellipsis",
    pageCount,
  ];
}

const clampPage = (page: number, pageCount: number) =>
  Math.min(Math.max(Math.trunc(page) || 1, 1), pageCount);

// 번호 버튼의 한 변·글자 크기와 아이콘 크기(px)
const paginationSizes: Record<ComponentSize, { box: string; text: string; icon: number }> = {
  sm: { box: "size-7", text: "text-xs", icon: 16 },
  md: { box: "size-8", text: "text-sm", icon: 18 },
  lg: { box: "size-9", text: "text-sm", icon: 20 },
  xl: { box: "size-10", text: "text-base", icon: 22 },
};

const buttonClass =
  "flex shrink-0 cursor-pointer items-center justify-center rounded-8 border border-transparent text-text-secondary hover:bg-bg-blue-tint hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:text-text-disabled disabled:hover:bg-transparent";

/**
 * 목록 아래의 페이지 이동. 데이터를 자르지는 않는다 — 앱이 `page`/`pageSize`로 목록을 가져온다.
 * `page`와 `pageSize`는 각각 제어/비제어로 쓸 수 있다.
 */
export function Pagination({
  totalCount,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  pageSize: pageSizeProp,
  defaultPageSize,
  onPageSizeChange,
  pageSizeOptions,
  siblingCount = 1,
  showTotal = false,
  size = "md",
  className,
  "aria-label": ariaLabel = "페이지 이동",
  ref,
  ...props
}: PaginationProps) {
  const [innerPage, setInnerPage] = useState(defaultPage);
  const [innerPageSize, setInnerPageSize] = useState(defaultPageSize ?? pageSizeOptions?.[0] ?? 20);
  const pageSize = Math.max(pageSizeProp ?? innerPageSize, 1);
  const pageCount = Math.max(Math.ceil(Math.max(totalCount, 0) / pageSize), 1);
  const page = clampPage(pageProp ?? innerPage, pageCount);

  const goTo = (next: number) => {
    const target = clampPage(next, pageCount);
    if (target === page) {
      return;
    }
    if (pageProp === undefined) {
      setInnerPage(target);
    }
    onPageChange?.(target);
  };

  const changePageSize = (next: number) => {
    if (next === pageSize) {
      return;
    }
    if (pageProp === undefined) {
      setInnerPage(1);
    }
    if (page !== 1) {
      onPageChange?.(1);
    }
    if (pageSizeProp === undefined) {
      setInnerPageSize(next);
    }
    onPageSizeChange?.(next);
  };

  const { box, text, icon } = paginationSizes[size];
  const items = buildPageItems(page, pageCount, Math.max(siblingCount, 0));
  // 현재 크기가 선택지에 없어도(예: 기본 20인데 [10, 50]) 선택 상태가 비지 않게 포함한다
  const sizeOptions = pageSizeOptions
    ? Array.from(new Set([...pageSizeOptions, pageSize])).sort((a, b) => a - b)
    : null;

  return (
    <div className={cn("flex w-full items-center justify-between gap-4 font-fds", className)}>
      <div className={cn("min-w-0 flex-1 text-text-tertiary", text)}>
        {showTotal && <span>총 {totalCount.toLocaleString("ko-KR")}건</span>}
      </div>
      <nav ref={ref} aria-label={ariaLabel} className="flex items-center gap-1" {...props}>
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => goTo(page - 1)}
          className={cn(buttonClass, box, text)}
        >
          <ChevronLeftIcon size={icon} />
        </button>
        {items.map((item) =>
          typeof item === "number" ? (
            <button
              key={item}
              type="button"
              aria-label={`${item}페이지`}
              aria-current={item === page ? "page" : undefined}
              onClick={() => goTo(item)}
              className={cn(
                buttonClass,
                box,
                text,
                item === page &&
                  "border-brand-primary bg-bg-blue-tint font-semibold text-brand-primary",
              )}
            >
              {item}
            </button>
          ) : (
            <span
              key={item}
              aria-hidden="true"
              className={cn("flex shrink-0 items-center justify-center text-text-muted", box, text)}
            >
              <MoreHorizontalIcon size={icon - 2} />
            </span>
          ),
        )}
        <button
          type="button"
          aria-label="다음 페이지"
          disabled={page >= pageCount}
          onClick={() => goTo(page + 1)}
          className={cn(buttonClass, box, text)}
        >
          <ChevronRightIcon size={icon} />
        </button>
      </nav>
      <div className="flex min-w-0 flex-1 justify-end">
        {sizeOptions && (
          <Select
            size={size}
            aria-label="페이지당 항목 수"
            containerClassName="w-32"
            options={sizeOptions.map((size) => ({
              value: String(size),
              label: `${size}개씩 보기`,
            }))}
            value={String(pageSize)}
            onChange={(next) => changePageSize(Number(next))}
          />
        )}
      </div>
    </div>
  );
}
