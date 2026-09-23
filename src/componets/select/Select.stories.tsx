import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const roleOptions = [
  { value: 'admin', label: '관리자' },
  { value: 'editor', label: '에디터' },
  { value: 'viewer', label: '뷰어' },
  { value: 'guest', label: '게스트', disabled: true },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    placeholder: { control: 'text' },
    options: { control: false },
  },
  args: {
    label: '역할',
    options: roleOptions,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: { defaultValue: 'editor' },
};

export const HelperText: Story = {
  args: { helperText: '관리자만 사용자 삭제 권한을 가집니다.' },
};

export const ErrorState: Story = {
  args: { errorText: '역할을 선택해주세요.' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'viewer' },
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Select {...args} size="sm" label="Small" />
      <Select {...args} size="md" label="Medium" />
      <Select {...args} size="lg" label="Large" />
    </div>
  ),
};
