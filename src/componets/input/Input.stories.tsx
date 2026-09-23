import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" strokeLinecap="round" />
  </svg>
);

const meta = {
  title: 'Components/Input',
  component: Input,
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
    type: {
      control: 'select',
      options: ['text', 'password', 'number', 'email', 'tel', 'url'],
    },
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    unit: { control: 'text' },
    // 아이콘 같은 엘리먼트를 받는 prop이라 object 컨트롤로 자동 추론되면
    // 빈 값이 {}로 세팅돼서 렌더링 에러가 남 -> 컨트롤 비활성화
    leftAddon: { control: false },
    rightAddon: { control: false },
  },
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
};

export const HelperText: Story = {
  args: { helperText: '가입 확인 메일을 받을 이메일을 입력하세요.' },
};

export const ErrorState: Story = {
  args: { errorText: '올바른 이메일 형식이 아닙니다.', defaultValue: 'not-an-email' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'disabled@example.com' },
};

export const WithLeftAddon: Story = {
  args: { label: 'Search', placeholder: 'Search...', leftAddon: <SearchIcon /> },
};

export const WithUnit: Story = {
  args: { label: 'Weight', placeholder: '0', unit: 'kg', defaultValue: '10' },
};

export const Password: Story = {
  args: { type: 'password', label: '비밀번호', placeholder: '••••••••' },
};

export const NumberType: Story = {
  args: { type: 'number', label: '수량', placeholder: '0', unit: '개' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Input {...args} size="sm" label="Small" />
      <Input {...args} size="md" label="Medium" />
      <Input {...args} size="lg" label="Large" />
    </div>
  ),
};
