import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toaster, toast } from './Toast';
import { Button } from '@/componets/button/Button';

const meta = {
  title: 'Components/Toast',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Button label="기본 토스트" onClick={() => toast({ title: '저장되었습니다.' })} />
  ),
};

export const Success: Story = {
  render: () => (
    <Button
      label="성공 토스트"
      onClick={() =>
        toast({ title: '저장 완료', description: '변경 사항이 저장되었습니다.', variant: 'success' })
      }
    />
  ),
};

export const ErrorToast: Story = {
  render: () => (
    <Button
      variant="outline"
      label="에러 토스트"
      onClick={() =>
        toast({ title: '저장 실패', description: '잠시 후 다시 시도해주세요.', variant: 'error' })
      }
    />
  ),
};

export const Warning: Story = {
  render: () => (
    <Button
      variant="ghost"
      label="경고 토스트"
      onClick={() => toast({ title: '저장되지 않은 변경 사항이 있습니다.', variant: 'warning' })}
    />
  ),
};
