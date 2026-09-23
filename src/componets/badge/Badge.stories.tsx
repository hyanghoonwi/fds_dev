import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger', 'neutral'],
    },
    label: { control: 'text' },
  },
  args: {
    label: 'Badge',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Success: Story = {
  args: { variant: 'success', label: '활성' },
};

export const Warning: Story = {
  args: { variant: 'warning', label: '승인 대기' },
};

export const Danger: Story = {
  args: { variant: 'danger', label: '실패' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge variant="default" label="Default" />
      <Badge variant="primary" label="Primary" />
      <Badge variant="success" label="Success" />
      <Badge variant="warning" label="Warning" />
      <Badge variant="danger" label="Danger" />
      <Badge variant="neutral" label="Neutral" />
    </div>
  ),
};
