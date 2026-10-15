import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Badge,
  Button,
  Input,
  Select,
  DataTable,
  type DataTableColumn,
  type DataTableRowId,
  type DataTableSort,
} from "@fds/core";

interface Member {
  id: number;
  name: string;
  role: string;
  joined: string;
  posts: number;
}

const roles = ["슈퍼관리자", "운영자", "조회 전용"];
const members: Member[] = Array.from({ length: 53 }, (_, i) => ({
  id: i + 1,
  name: `회원 ${String(i + 1).padStart(2, "0")}`,
  role: roles[i % roles.length],
  joined: `2026-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
  posts: (i * 37) % 200,
}));

const columns: DataTableColumn<Member>[] = [
  { key: "name", header: "이름", sortable: true },
  { key: "role", header: "역할" },
  { key: "joined", header: "가입일", sortable: true },
  { key: "posts", header: "게시글", align: "right", sortable: true },
];

const meta = {
  title: "Components/Display/DataTable",
  component: DataTable<Member>,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
    striped: { control: "boolean" },
    selectable: { control: "boolean" },
    loading: { control: "boolean" },
    manualSort: { control: "boolean" },
    columns: { control: false },
    data: { control: false },
    getRowId: { control: false },
  },
  args: {
    columns,
    data: members.slice(0, 6),
    getRowId: (row) => row.id,
  },
} satisfies Meta<typeof DataTable<Member>>;

export default meta;
type Story = StoryObj<typeof meta>;

// columns + data만 넘기면 된다. sortable 열은 제목을 눌러 정렬한다
export const Default: Story = {
  args: { defaultSort: { key: "joined", direction: "desc" } },
};

// cell로 셀 내용을 직접 그린다 (배지, 포맷 등)
export const CustomCell: Story = {
  render: (args) => (
    <DataTable
      {...args}
      columns={[
        { key: "name", header: "이름" },
        {
          key: "role",
          header: "역할",
          cell: (row) => (
            <Badge variant={row.role === "슈퍼관리자" ? "info" : "neutral"}>{row.role}</Badge>
          ),
        },
        {
          key: "posts",
          header: "게시글",
          align: "right",
          cell: (row) => `${row.posts.toLocaleString("ko-KR")}건`,
        },
      ]}
      data={members.slice(0, 5)}
      getRowId={(row) => row.id}
    />
  ),
};

// 체크박스 열: 헤더 체크박스는 현재 보이는 행을 전체 선택/해제한다
export const Selectable: Story = {
  render: function Render(args) {
    const [selectedIds, setSelectedIds] = useState<DataTableRowId[]>([2]);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <DataTable
          {...args}
          selectable
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
        />
        <span style={{ fontSize: 13 }}>선택한 id: {JSON.stringify(selectedIds)}</span>
      </div>
    );
  },
};

// 셀 안에 입력 컴포넌트: cell에서 Input/Select를 그리고, 값은 data를 들고 있는 부모가 관리한다.
// 표 안에서는 size="sm"이 행 높이에 맞다. 저장을 누르면 서버로 보낼 값(변경된 행만)을 아래에 보여 준다.
// 클릭 가능한 행(onRowClick) 안에서 쓰면 입력 클릭이 행까지 올라가므로 필요하면 stopPropagation을 호출한다.
export const EditableCells: Story = {
  render: function Render(args) {
    const initial = members.slice(0, 5);
    const [rows, setRows] = useState(initial);
    const [submitted, setSubmitted] = useState<Member[] | null>(null);

    const update = (id: number, patch: Partial<Member>) =>
      setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
    const changedRows = rows.filter(
      (row, index) => JSON.stringify(row) !== JSON.stringify(initial[index]),
    );

    return (
      <form
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(changedRows);
        }}
      >
        <DataTable
          {...args}
          data={rows}
          columns={[
            {
              key: "name",
              header: "이름",
              cell: (row) => (
                <Input
                  size="sm"
                  aria-label={`${row.id}번 이름`}
                  value={row.name}
                  onChange={(event) => update(row.id, { name: event.target.value })}
                />
              ),
            },
            {
              key: "role",
              header: "역할",
              width: 180,
              cell: (row) => (
                <Select
                  size="sm"
                  aria-label={`${row.id}번 역할`}
                  options={roles.map((role) => ({ value: role, label: role }))}
                  value={row.role}
                  onChange={(role) => update(row.id, { role })}
                />
              ),
            },
            {
              key: "posts",
              header: "게시글",
              align: "right",
              width: 120,
              cell: (row) => (
                <Input
                  size="sm"
                  type="number"
                  min={0}
                  aria-label={`${row.id}번 게시글 수`}
                  value={row.posts}
                  onChange={(event) => update(row.id, { posts: Number(event.target.value) })}
                  className="text-right"
                />
              ),
            },
          ]}
        />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button type="submit" variant="primary" disabled={changedRows.length === 0}>
            저장
          </Button>
          <Button
            variant="line"
            disabled={changedRows.length === 0}
            onClick={() => {
              setRows(initial);
              setSubmitted(null);
            }}
          >
            되돌리기
          </Button>
          <span style={{ fontSize: 13 }}>변경된 행: {changedRows.length}건</span>
        </div>
        <pre
          style={{
            margin: 0,
            padding: 12,
            background: "#f2f4f6",
            borderRadius: 8,
            fontSize: 12,
            whiteSpace: "pre-wrap",
          }}
        >
          {submitted === null
            ? "저장을 누르면 제출되는 값이 여기에 표시돼요."
            : `제출한 값 (변경된 행만):\n${JSON.stringify(submitted, null, 2)}`}
        </pre>
      </form>
    );
  },
};

// 행 클릭: 선택 체크박스를 누를 때는 호출되지 않는다
export const RowClick: Story = {
  render: function Render(args) {
    const [opened, setOpened] = useState<string | null>(null);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <DataTable {...args} selectable onRowClick={(row) => setOpened(row.name)} />
        <span style={{ fontSize: 13 }}>열린 회원: {opened ?? "없음"}</span>
      </div>
    );
  },
};

// 행 밀도: 열 제목/셀 높이가 sm 36/40 · md 44/48(기본) · lg 48/56 · xl 56/64px. 선택 체크박스와 페이지네이션도 같은 크기를 따른다
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <DataTable key={size} {...args} size={size} selectable data={members.slice(0, 3)} />
      ))}
    </div>
  ),
};

// 클라이언트 페이징: data 전체를 넘기면 pageSize씩 잘라 보여 준다
export const WithPagination: Story = {
  render: (args) => (
    <DataTable {...args} striped data={members} pagination={{ pageSizeOptions: [10, 20, 50] }} />
  ),
};

// 서버 정렬 + 서버 페이징: totalCount를 주면 data를 자르지 않고, manualSort면 정렬도 직접 하지 않는다.
// 아래는 서버 응답을 흉내 낸 것으로, 조건이 바뀔 때마다 0.5초 뒤 새 데이터가 도착한다.
export const ServerSide: Story = {
  render: function Render(args) {
    const [sort, setSort] = useState<DataTableSort | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rows, setRows] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setLoading(true);
      const timer = setTimeout(() => {
        const sorted = sort
          ? [...members].sort((a, b) => {
              const diff = String(a[sort.key as keyof Member]).localeCompare(
                String(b[sort.key as keyof Member]),
                "ko",
                { numeric: true },
              );
              return sort.direction === "asc" ? diff : -diff;
            })
          : members;
        setRows(sorted.slice((page - 1) * pageSize, page * pageSize));
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }, [sort, page, pageSize]);

    return (
      <DataTable
        {...args}
        manualSort
        loading={loading}
        data={rows}
        sort={sort}
        onSortChange={(next) => {
          setSort(next);
          setPage(1);
        }}
        pagination={{
          totalCount: members.length,
          page,
          onPageChange: setPage,
          pageSize,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [10, 20],
        }}
      />
    );
  },
};

export const Empty: Story = {
  render: (args) => <DataTable {...args} data={[]} emptyMessage="조회된 회원이 없어요." />,
};

export const Loading: Story = {
  render: (args) => <DataTable {...args} loading data={[]} />,
};
