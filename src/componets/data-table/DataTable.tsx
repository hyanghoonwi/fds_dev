import type { CSSProperties, Key, ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Checkbox } from "@/componets/checkbox/Checkbox";

export interface DataTableColumn<T> {
  /** row 객체의 값을 그대로 보여줄 때 사용하는 키. render가 있으면 무시됨 */
  key: keyof T & string;
  header: ReactNode;
  render?: (row: T, index: number) => ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => Key;
  isLoading?: boolean;
  emptyText?: ReactNode;
  onRowClick?: (row: T) => void;
  /** 이 높이를 넘어가면 내부에서 세로 스크롤이 생기고, 헤더는 상단에 고정된다 (예: '480px', '60vh') */
  maxHeight?: CSSProperties["maxHeight"];
  /** 둘 다 넘기면 각 행 앞에 체크박스가 생기고 행 선택 기능이 켜진다 */
  selectedRowKeys?: Key[];
  onSelectionChange?: (keys: Key[]) => void;
  className?: string;
}

const alignClass: Record<NonNullable<DataTableColumn<never>["align"]>, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading = false,
  emptyText = "표시할 데이터가 없습니다.",
  onRowClick,
  maxHeight,
  selectedRowKeys,
  onSelectionChange,
  className,
}: DataTableProps<T>) {
  const isSelectable = selectedRowKeys !== undefined && onSelectionChange !== undefined;
  const columnCount = columns.length + (isSelectable ? 1 : 0);

  const rowKeys = data.map((row, index) => rowKey(row, index));
  const allSelected = isSelectable && rowKeys.length > 0 && rowKeys.every((key) => selectedRowKeys!.includes(key));
  const someSelected = isSelectable && rowKeys.some((key) => selectedRowKeys!.includes(key));

  const toggleAll = () => {
    onSelectionChange!(allSelected ? [] : rowKeys);
  };

  const toggleRow = (key: Key) => {
    onSelectionChange!(
      selectedRowKeys!.includes(key)
        ? selectedRowKeys!.filter((selected) => selected !== key)
        : [...selectedRowKeys!, key],
    );
  };

  return (
    <div
      style={{ maxHeight }}
      className={cn("w-full overflow-auto rounded-md border border-gray-200", className)}
    >
      {/* min-w-max: 컬럼 내용이 컨테이너보다 넓어지면 테이블이 그만큼 커져서 가로 스크롤이 생긴다 */}
      <table className="w-full min-w-max border-collapse text-sm">
        <thead>
          <tr>
            {isSelectable && (
              <th className="sticky top-0 z-10 w-10 border-b border-gray-200 bg-gray-50 px-4 py-2.5">
                <Checkbox
                  aria-label="전체 선택"
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  onChange={toggleAll}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width }}
                className={cn(
                  "sticky top-0 z-10 border-b border-gray-200 bg-gray-50 px-4 py-2.5 font-medium text-gray-500",
                  alignClass[column.align ?? "left"],
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columnCount} className="px-4 py-10 text-center text-gray-400">
                불러오는 중...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className="px-4 py-10 text-center text-gray-400">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const key = rowKeys[index];
              return (
                <tr
                  key={key}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-b border-gray-100 last:border-0",
                    onRowClick && "cursor-pointer hover:bg-gray-50",
                  )}
                >
                  {isSelectable && (
                    <td className="px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        aria-label="행 선택"
                        checked={selectedRowKeys!.includes(key)}
                        onChange={() => toggleRow(key)}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn("px-4 py-2.5 text-gray-900", alignClass[column.align ?? "left"])}
                    >
                      {column.render ? column.render(row, index) : (row[column.key] as ReactNode)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
