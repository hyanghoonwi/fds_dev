// 내부 전용: 공개 API는 DataTable이다. index.ts에서 export하지 않는다.
import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";
import { ChevronDownIcon } from "../icon/ChevronDownIcon";
import { ChevronUpIcon } from "../icon/ChevronUpIcon";
import { SortIcon } from "../icon/SortIcon";

type Align = "left" | "center" | "right";

const justifyClass: Record<Align, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

const alignClass: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export interface TableProps extends ComponentProps<"table"> {
  /** 짝수 행에 옅은 배경을 깔아 가로로 읽기 쉽게 한다(지브라). 선택된 행은 선택 색이 우선한다. */
  striped?: boolean;
}

// 좁은 화면에서 표가 페이지를 밀어내지 않도록 가로 스크롤 상자로 감싼다. className/ref 등은 <table>에 전달된다.
function TableRoot({ striped, className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-12 border border-line-2 bg-bg-surface">
      <table
        data-striped={striped || undefined}
        className={cn(
          "w-full border-collapse font-fds text-sm text-text-primary",
          "data-[striped]:[&_tbody>tr:nth-child(even):not([data-selected])]:bg-bg-page/50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

/** 열 제목 묶음(`<thead>`). 안에 `Table.Row` → `Table.Head`를 둔다. */
function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return <thead className={cn("bg-bg-page", className)} {...props} />;
}

/** 데이터 행 묶음(`<tbody>`). 행에 hover 배경을 주고, 마지막 행의 아래 테두리는 바깥 테두리와 겹치지 않게 뺀다. */
function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn(
        "[&>tr:last-child>td]:border-b-0 [&>tr:not([data-selected]):hover]:bg-bg-page",
        className,
      )}
      {...props}
    />
  );
}

export interface TableRowProps extends ComponentProps<"tr"> {
  /** 선택된 행 강조 (체크박스로 행을 고르는 목록 등) */
  selected?: boolean;
  /**
   * 주면 클릭 가능한 행이 된다(상세 화면 이동 등). 포인터 커서와 포커스 링이 붙고,
   * 키보드로 포커스해서 Enter/Space로도 실행된다. 행 안의 체크박스·버튼은 클릭이 행까지 올라가므로
   * 필요하면 해당 핸들러에서 `event.stopPropagation()`을 호출한다.
   */
  onClick?: ComponentProps<"tr">["onClick"];
}

function TableRow({ selected, onClick, onKeyDown, className, ...props }: TableRowProps) {
  const handleKeyDown: ComponentProps<"tr">["onKeyDown"] = (event) => {
    onKeyDown?.(event);
    // 행 안의 입력 요소(체크박스 등)에서 올라온 키 입력은 무시하고, 행 자체에 포커스가 있을 때만 실행한다
    if (
      onClick &&
      event.target === event.currentTarget &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      onClick(event as unknown as Parameters<NonNullable<typeof onClick>>[0]);
    }
  };

  return (
    <tr
      data-selected={selected || undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "transition-colors duration-150 data-[selected]:bg-bg-blue-tint",
        onClick &&
          "cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-primary",
        className,
      )}
      {...props}
    />
  );
}

export type TableSort = "asc" | "desc" | "none";

export interface TableHeadProps extends ComponentProps<"th"> {
  /** 가로 정렬. 숫자 열은 `right`가 읽기 편하다. 기본 `left` */
  align?: Align;
  /** 이 열의 현재 정렬 상태. `onSort`와 함께 쓴다. 기본 `none` */
  sort?: TableSort;
  /**
   * 주면 열 제목이 정렬 버튼이 되고 정렬 아이콘이 붙는다. 누를 때 호출되며,
   * 다음 정렬 상태(none → asc → desc → none 등)는 부모가 정해서 `sort`로 내려 준다.
   */
  onSort?: () => void;
}

const ariaSort = { asc: "ascending", desc: "descending", none: "none" } as const;

/** 열 제목 셀(`<th>`). `scope="col"`이 기본이다. 행 제목이면 `scope="row"`를 넘긴다. */
function TableHead({
  align = "left",
  scope = "col",
  sort = "none",
  onSort,
  className,
  children,
  ...props
}: TableHeadProps) {
  return (
    <th
      scope={scope}
      aria-sort={onSort ? ariaSort[sort] : undefined}
      className={cn(
        "h-11 border-b border-line-2 px-4 text-xs font-medium whitespace-nowrap text-text-tertiary",
        alignClass[align],
        className,
      )}
      {...props}
    >
      {onSort ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            "inline-flex w-full cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-[inherit] text-[length:inherit] font-[number:inherit] text-inherit hover:text-text-primary",
            justifyClass[align],
            sort !== "none" && "text-text-primary",
          )}
        >
          {children}
          {/* 쉐브론은 24px 박스에서 가운데 일부만 채워서, SortIcon과 보이는 크기가 맞도록 더 크게 그린다 */}
          {sort === "none" ? (
            <SortIcon size={14} aria-hidden />
          ) : sort === "asc" ? (
            <ChevronUpIcon size={18} aria-hidden />
          ) : (
            <ChevronDownIcon size={18} aria-hidden />
          )}
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export interface TableCellProps extends ComponentProps<"td"> {
  /** 가로 정렬. 숫자 열은 `right`가 읽기 편하다. 기본 `left` */
  align?: Align;
}

/** 데이터 셀(`<td>`) */
function TableCell({ align = "left", className, ...props }: TableCellProps) {
  return (
    <td
      className={cn("h-12 border-b border-border-line px-4", alignClass[align], className)}
      {...props}
    />
  );
}

export interface TableEmptyProps extends Omit<ComponentProps<"td">, "colSpan"> {
  /** 표의 전체 열 수 */
  colSpan: number;
}

/** 데이터가 없을 때 `Table.Body` 안에 두는 안내 행. 전체 열을 가로지른다. */
function TableEmpty({ colSpan, className, ...props }: TableEmptyProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={cn("h-40 px-4 text-center text-sm text-text-tertiary", className)}
        {...props}
      />
    </tr>
  );
}

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Empty: TableEmpty,
});
