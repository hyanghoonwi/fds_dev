import React from "react";
import { cn } from "@/utils/cn";

export interface PaginationProps {
  /** 1부터 시작하는 현재 페이지 */
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** 현재 페이지 양옆에 보여줄 페이지 번호 개수 */
  siblingCount?: number;
  className?: string;
}

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const navButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40";

const pageButtonClass =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors";

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

type PageItem = number | "ellipsis";

// 현재 페이지 주변 + 처음/끝 페이지만 보여주고 나머지는 ...으로 생략하는 목록을 만든다.
function getPageList(currentPage: number, totalPages: number, siblingCount: number): PageItem[] {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 2;

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftRange = range(1, 3 + siblingCount * 2);
    return [...leftRange, "ellipsis", totalPages];
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightRange = range(totalPages - (3 + siblingCount * 2) + 1, totalPages);
    return [1, "ellipsis", ...rightRange];
  }

  return [1, "ellipsis", ...range(leftSiblingIndex, rightSiblingIndex), "ellipsis", totalPages];
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ currentPage, totalPages, onPageChange, siblingCount = 1, className }, ref) => {
    const pages = getPageList(currentPage, totalPages, siblingCount);

    return (
      <nav
        ref={ref}
        aria-label="페이지네이션"
        className={cn("flex items-center gap-1", className)}
      >
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="이전 페이지"
          className={navButtonClass}
        >
          <ChevronLeftIcon />
        </button>

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-1 text-sm text-gray-400">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                pageButtonClass,
                page === currentPage ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100",
              )}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="다음 페이지"
          className={navButtonClass}
        >
          <ChevronRightIcon />
        </button>
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";
