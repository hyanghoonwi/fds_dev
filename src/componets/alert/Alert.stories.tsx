import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    title: '알려드립니다',
    description: '이 작업은 몇 분 정도 걸릴 수 있습니다.',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: { variant: 'info' },
};

export const Success: Story = {
  args: { variant: 'success', title: '저장되었습니다', description: '변경 사항이 반영되었습니다.' },
};

export const Warning: Story = {
  args: { variant: 'warning', title: '저장되지 않은 변경 사항이 있습니다', description: undefined },
};

export const ErrorAlert: Story = {
  args: { variant: 'error', title: '요청에 실패했습니다', description: '잠시 후 다시 시도해주세요.' },
};
