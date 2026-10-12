import type { ReactNode } from "react";
import { cn } from "../../utils/cn";
import { useControllableState } from "../../utils/useControllableState";
import { Checkbox } from "../checkbox/Checkbox";
import { Pagination, type PaginationProps } from "../pagination/Pagination";
import { Spinner } from "../spinner/Spinner";
import { Table, type TableProps } from "../table/Table";

export type DataTableRowId = string | number;

export interface DataTableSort {
  /** 정렬 기준 열의 `key` */
  key: string;
  direction: "asc" | "desc";
}

export interface DataTableColumn<T> {
  /** 열 식별자. `cell`이 없으면 `row[key]`를 그대로 표시한다. 정렬 상태의 `key`로도 쓰인다. */
  key: string;
  /** 열 제목 */
  header: ReactNode;
  /** 셀 내용. 생략하면 `row[key]`를 문자열로 표시한다. */
  cell?: (row: T, index: number) => ReactNode;
  /** 가로 정렬. 숫자 열은 `right`가 읽기 편하다. 기본 `left` */
  align?: "left" | "center" | "right";
  /** 열 너비 (CSS width). 생략하면 내용에 맞춰 나뉜다. */
  width?: number | string;
  /** 열 제목을 눌러 정렬할 수 있게 한다. */
  sortable?: boolean;
  /** 클라이언트 정렬에 쓰는 값. 생략하면 `row[key]`를 쓴다. 문자열/숫자 외의 값은 이 함수로 변환해 준다. */
  sortValue?: (row: T) => string | number | null | undefined;
}

export type DataTablePagination = Omit<PaginationProps, "totalCount" | "children"> & {
  /**
   * 전체 항목 수. 주면 **서버 페이징**으로 동작한다 — `data`는 현재 페이지 분량이라고 보고 자르지 않는다.
   * 생략하면 `data` 전체를 `pageSize`씩 잘라 보여 준다(클라이언트 페이징).
   */
  totalCount?: number;
};

export interface DataTableProps<T extends object> extends Omit<TableProps, "children"> {
  columns: DataTableColumn<T>[];
  data: T[];
  /** 행을 구분하는 고유 값. 선택 상태와 React key에 쓰인다. */
  getRowId: (row: T) => DataTableRowId;

  /** 현재 정렬 (제어 모드). 정렬 안 함은 `null` */
  sort?: DataTableSort | null;
  /** 처음 정렬 (비제어 모드) */
  defaultSort?: DataTableSort | null;
  /** 정렬이 바뀔 때 호출된다. 같은 열을 누를 때마다 오름차순 → 내림차순 → 정렬 안 함 순으로 돈다. */
  onSortChange?: (sort: DataTableSort | null) => void;
  /** true면 `data`를 직접 정렬하지 않는다(서버 정렬). `onSortChange`로 받아 새 데이터를 내려 준다. */
  manualSort?: boolean;

  /** 맨 앞에 체크박스 열을 둔다. 헤더 체크박스는 **현재 보이는 행**을 전체 선택/해제한다. */
  selectable?: boolean;
  /** 선택된 행 id (제어 모드) */
  selectedIds?: DataTableRowId[];
  /** 처음 선택된 행 id (비제어 모드) */
  defaultSelectedIds?: DataTableRowId[];
  onSelectedIdsChange?: (ids: DataTableRowId[]) => void;

  /** 행을 누를 때 호출된다(상세 이동 등). 선택 체크박스를 누를 때는 호출되지 않는다. */
  onRowClick?: (row: T) => void;

  /** 목록 아래에 `Pagination`을 붙인다. `true`는 기본값(20개씩, 클라이언트 페이징). */
  pagination?: boolean | DataTablePagination;
  /** 데이터를 불러오는 중. 행이 흐려지고, 데이터가 없으면 스피너를 보여 준다. */
  loading?: boolean;
  /** 데이터가 없을 때 안내 문구 */
  emptyMessage?: ReactNode;
}

const compareValues = (
  a: string | number | null | undefined,
  b: string | number | null | undefined,
) => {
  // 값이 없는 행은 방향과 상관없이 맨 뒤로 보내기 위해 호출 쪽에서 따로 처리한다
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  return String(a).localeCompare(String(b), "ko");
};

function sortRows<T extends object>(rows: T[], columns: DataTableColumn<T>[], sort: DataTableSort) {
  const column = columns.find((c) => c.key === sort.key);
  const valueOf = (row: T) =>
    column?.sortValue
      ? column.sortValue(row)
      : (row[sort.key as keyof T] as string | number | null | undefined);
  const sign = sort.direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const va = valueOf(a);
    const vb = valueOf(b);
    const aEmpty = va == null || va === "";
    const bEmpty = vb == null || vb === "";
    if (aEmpty || bEmpty) {
      return Number(aEmpty) - Number(bEmpty);
    }
    return sign * compareValues(va, vb);
  });
}

/**
 * `columns`와 `data`만 넘기면 정렬·선택·페이지네이션까지 갖춘 목록 표를 만든다.
 */
export function DataTable<T extends object>({
  columns,
  data,
  getRowId,
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  manualSort = false,
  selectable = false,
  selectedIds: selectedIdsProp,
  defaultSelectedIds = [],
  onSelectedIdsChange,
  onRowClick,
  pagination,
  loading = false,
  emptyMessage = "데이터가 없어요.",
  ...tableProps
}: DataTableProps<T>) {
  const paginationOptions: DataTablePagination = typeof pagination === "object" ? pagination : {};
  const [sort, setSort] = useControllableState<DataTableSort | null>(
    sortProp,
    defaultSort,
    onSortChange,
  );
  const [selectedIds, setSelectedIds] = useControllableState<DataTableRowId[]>(
    selectedIdsProp,
    defaultSelectedIds,
    onSelectedIdsChange,
  );
  const [pageSize, setPageSize] = useControllableState(
    paginationOptions.pageSize,
    paginationOptions.defaultPageSize ?? paginationOptions.pageSizeOptions?.[0] ?? 20,
    paginationOptions.onPageSizeChange,
  );
  const [page, setPage] = useControllableState(
    paginationOptions.page,
    paginationOptions.defaultPage ?? 1,
    paginationOptions.onPageChange,
  );

  const sortedRows = sort && !manualSort ? sortRows(data, columns, sort) : data;

  const serverPaging = paginationOptions.totalCount !== undefined;
  const totalCount = paginationOptions.totalCount ?? sortedRows.length;
  const pageCount = Math.max(Math.ceil(totalCount / Math.max(pageSize, 1)), 1);
  const currentPage = Math.min(Math.max(page, 1), pageCount);
  const visibleRows =
    pagination && !serverPaging
      ? sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      : sortedRows;

  const nextSort = (key: string) => {
    if (sort?.key !== key) {
      setSort({ key, direction: "asc" });
    } else if (sort.direction === "asc") {
      setSort({ key, direction: "desc" });
    } else {
      setSort(null);
    }
  };

  const visibleIds = visibleRows.map(getRowId);
  const selectedVisibleCount = visibleIds.filter((id) => selectedIds.includes(id)).length;
  const allSelected = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;

  const toggleAll = (checked: boolean) =>
    setSelectedIds(
      checked
        ? Array.from(new Set([...selectedIds, ...visibleIds]))
        : selectedIds.filter((id) => !visibleIds.includes(id)),
    );
  const toggleRow = (id: DataTableRowId, checked: boolean) =>
    setSelectedIds(checked ? [...selectedIds, id] : selectedIds.filter((v) => v !== id));

  const columnCount = columns.length + (selectable ? 1 : 0);

  return (
    <div className="flex flex-col gap-4">
      <Table aria-busy={loading || undefined} {...tableProps}>
        <Table.Header>
          <Table.Row>
            {selectable && (
              <Table.Head className="w-12">
                <Checkbox
                  aria-label="현재 목록 전체 선택"
                  checked={allSelected}
                  indeterminate={selectedVisibleCount > 0 && !allSelected}
                  disabled={visibleRows.length === 0}
                  onChange={toggleAll}
                />
              </Table.Head>
            )}
            {columns.map((column) => (
              <Table.Head
                key={column.key}
                align={column.align}
                style={column.width === undefined ? undefined : { width: column.width }}
                sort={sort?.key === column.key ? sort.direction : "none"}
                onSort={column.sortable ? () => nextSort(column.key) : undefined}
              >
                {column.header}
              </Table.Head>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body className={cn(loading && "pointer-events-none opacity-50")}>
          {visibleRows.length === 0 ? (
            <Table.Empty colSpan={columnCount}>
              {loading ? (
                <span className="inline-flex justify-center">
                  <Spinner />
                </span>
              ) : (
                emptyMessage
              )}
            </Table.Empty>
          ) : (
            visibleRows.map((row, index) => {
              const id = getRowId(row);
              const selected = selectedIds.includes(id);
              return (
                <Table.Row
                  key={id}
                  selected={selected}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {selectable && (
                    <Table.Cell onClick={(event) => event.stopPropagation()}>
                      <Checkbox
                        aria-label="행 선택"
                        checked={selected}
                        onChange={(checked) => toggleRow(id, checked)}
                      />
                    </Table.Cell>
                  )}
                  {columns.map((column) => (
                    <Table.Cell key={column.key} align={column.align}>
                      {column.cell
                        ? column.cell(row, index)
                        : String(row[column.key as keyof T] ?? "")}
                    </Table.Cell>
                  ))}
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table>
      {pagination && (
        <Pagination
          showTotal
          {...paginationOptions}
          totalCount={totalCount}
          page={currentPage}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  );
}
