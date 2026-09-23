import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { DataTable, type DataTableColumn } from './DataTable';

interface User {
  id: number;
  name: string;
  email: string;
  status: '활성' | '정지';
}

const users: User[] = [
  { id: 1, name: '김민준', email: 'minjun@example.com', status: '활성' },
  { id: 2, name: '이서연', email: 'seoyeon@example.com', status: '활성' },
  { id: 3, name: '박지훈', email: 'jihoon@example.com', status: '정지' },
];

const columns: DataTableColumn<User>[] = [
  { key: 'id', header: 'ID', width: '60px' },
  { key: 'name', header: '이름' },
  { key: 'email', header: '이메일' },
  {
    key: 'status',
    header: '상태',
    align: 'center',
    render: (row) => (
      <span
        className={
          row.status === '활성'
            ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700'
            : 'rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500'
        }
      >
        {row.status}
      </span>
    ),
  },
];

// DataTable은 제네릭 컴포넌트라 Storybook의 Meta<T> 타입 추론이 안 먹혀서,
// 이 스토리 파일 안에서만 쓰는 타입 고정용 래퍼가 필요함. 실제 라이브러리에서
// export되는 컴포넌트는 그대로 DataTable이라서, Storybook Docs에도 DataTable로
// 보이도록 displayName을 맞춰준다.
const DataTableStoryWrapper = (props: ComponentProps<typeof DataTable<User>>) => (
  <DataTable {...props} />
);
DataTableStoryWrapper.displayName = 'DataTable';

const meta = {
  title: 'Components/DataTable',
  component: DataTableStoryWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    columns,
    data: users,
    rowKey: (row: User) => row.id,
  },
} satisfies Meta<typeof DataTableStoryWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { isLoading: true },
};

export const Empty: Story = {
  args: { data: [] },
};

export const Clickable: Story = {
  args: {
    onRowClick: (row: User) => alert(`${row.name} 클릭됨`),
  },
};

const manyUsers: User[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `사용자 ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: i % 3 === 0 ? '정지' : '활성',
}));

export const ScrollableWithStickyHeader: Story = {
  args: {
    data: manyUsers,
    maxHeight: '320px',
  },
};

// 컨테이너보다 넓은 고정 width를 줘서 실제로 넘치는 상황을 만든다 (컬럼 수를 늘리는 대신
// 폭을 넓혀서 데모함 — column.key가 row 필드와 매핑돼야 해서 가짜 컬럼을 늘리기 애매함)
const wideColumns: DataTableColumn<User>[] = [
  { key: 'id', header: 'ID', width: '150px' },
  { key: 'name', header: '이름', width: '300px' },
  { key: 'email', header: '이메일', width: '400px' },
  { key: 'status', header: '상태', align: 'center', width: '300px' },
];

export const HorizontalScroll: Story = {
  args: {
    columns: wideColumns,
  },
};

export const Selectable: Story = {
  render: (args) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-500">{selectedRowKeys.length}명 선택됨</p>
        <DataTable
          {...args}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={(keys) => setSelectedRowKeys(keys as number[])}
        />
      </div>
    );
  },
};
