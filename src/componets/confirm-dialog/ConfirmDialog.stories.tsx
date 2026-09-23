import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfirmDialog } from './ConfirmDialog';
import { Button } from '@/componets/button/Button';

const meta = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    open: false,
    onOpenChange: () => {},
    title: '',
    onConfirm: () => {},
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button label="다이얼로그 열기" onClick={() => setOpen(true)} />
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="변경 사항을 저장할까요?"
          description="저장하면 목록 화면으로 돌아갑니다."
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

export const Danger: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outline" label="사용자 삭제" onClick={() => setOpen(true)} />
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          variant="danger"
          title="사용자를 삭제하시겠어요?"
          description="삭제하면 되돌릴 수 없습니다."
          confirmLabel="삭제"
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};
