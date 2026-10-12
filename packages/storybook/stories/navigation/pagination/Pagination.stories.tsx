import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "@fds/core";

// Pagination은 목록을 자르지 않는다. 앱이 page / pageSize로 목록을 가져온다.
const meta = {
  title: "Components/Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: { layout: "padded", docs: { story: { height: "160px" } } },
  argTypes: {
    totalCount: { control: "number" },
    page: { control: false },
    defaultPageSize: { control: "number" },
    pageSize: { control: false },
    siblingCount: { control: "number" },
    showTotal: { control: "boolean" },
    onPageChange: { control: false },
    onPageSizeChange: { control: false },
  },
  args: { totalCount: 250, defaultPageSize: 10 },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// 비제어: defaultPage로 시작하고 상태는 컴포넌트가 가진다
export const Default: Story = { args: { defaultPage: 1 } };

// 현재 페이지가 중간일 때는 양쪽이 …로 줄어든다
export const Middle: Story = { args: { defaultPage: 12 } };

// 페이지가 적으면 전부 보여 준다
export const FewPages: Story = { args: { totalCount: 45 } };

export const WithTotal: Story = { args: { showTotal: true, totalCount: 1234 } };

// pageSizeOptions를 주면 "20개씩 보기" 선택이 나타난다. 크기를 바꾸면 1페이지로 돌아간다.
export const WithPageSize: Story = {
  args: { showTotal: true, pageSizeOptions: [10, 20, 50], defaultPage: 3 },
};

// 항목이 없어도 1페이지만 있는 것으로 본다
export const Empty: Story = { args: { totalCount: 0, showTotal: true } };

// ---- 실제 사용 예 -----------------------------------------------------------------------

// 제어 모드: 페이지와 크기를 state가 들고, 그 값으로 목록을 잘라 보여 준다.
export const ControlledList: Story = {
  render: function Render() {
    const rows = Array.from({ length: 87 }, (_, i) => `공지사항 ${i + 1}`);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const visible = rows.slice((page - 1) * pageSize, page * pageSize);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: 14 }}>
          {visible.map((row) => (
            <li key={row} style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}>
              {row}
            </li>
          ))}
        </ul>
        <Pagination
          totalCount={rows.length}
          page={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 20, 50]}
          showTotal
        />
      </div>
    );
  },
};
