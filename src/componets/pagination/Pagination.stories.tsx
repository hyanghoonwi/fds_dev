import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';
import { DataTable, type DataTableColumn } from '@/componets/data-table/DataTable';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    currentPage: { control: 'number' },
    totalPages: { control: 'number' },
    siblingCount: { control: 'number' },
  },
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// Pagination은 currentPage를 스스로 들고 있지 않는 controlled 컴포넌트라,
// 스토리에서도 실제로 상태를 관리해야 클릭이 동작하는 걸 볼 수 있다.
export const Default: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
};

export const ManyPages: Story = {
  args: { totalPages: 42 },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
};

export const FirstPage: Story = {
  args: { currentPage: 1, totalPages: 20 },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
};

export const LastPage: Story = {
  args: { currentPage: 20, totalPages: 20 },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
};

// Pagination과 DataTable은 서로 모르는 사이 — 페이지 상태와 "어떤 데이터를 자를지"는
// 이 스토리(=실제 페이지 컴포넌트 역할)가 들고 있고, 두 컴포넌트에 controlled하게 꽂아준다.
interface User {
  id: number;
  name: string;
  email: string;
}

const allUsers: User[] = Array.from({ length: 47 }, (_, i) => ({
  id: i + 1,
  name: `사용자 ${i + 1}`,
  email: `user${i + 1}@example.com`,
}));

const columns: DataTableColumn<User>[] = [
  { key: 'id', header: 'ID', width: '60px' },
  { key: 'name', header: '이름' },
  { key: 'email', header: '이메일' },
];

const PAGE_SIZE = 10;

export const WithDataTable: Story = {
  parameters: { layout: 'padded' },
  render: () => {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(allUsers.length / PAGE_SIZE);
    const pageData = allUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
      <div className="flex flex-col items-center gap-4">
        <DataTable columns={columns} data={pageData} rowKey={(row) => row.id} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    );
  },
};
