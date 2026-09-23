import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    href: { control: 'text' },
    label: { control: 'text' },
    // 아이콘 같은 엘리먼트를 받는 prop이라 object 컨트롤로 자동 추론되면
    // 빈 값이 {}로 세팅돼서 렌더링 에러가 남 -> 컨트롤 비활성화
    leftAddon: { control: false },
    rightAddon: { control: false },
  },
  args: {
    label: 'Button',
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
};

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true },
};

export const WithLeftAddon: Story = {
  args: { label: 'Add item', leftAddon: <PlusIcon /> },
};

export const WithRightAddon: Story = {
  args: { label: 'Next', rightAddon: <ArrowRightIcon /> },
};

export const AsLink: Story = {
  args: { label: 'Go to example.com', href: 'https://example.com' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Button {...args} size="sm" label="Small" />
      <Button {...args} size="md" label="Medium" />
      <Button {...args} size="lg" label="Large" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button {...args} variant="primary" label="Primary" />
      <Button {...args} variant="secondary" label="Secondary" />
      <Button {...args} variant="outline" label="Outline" />
      <Button {...args} variant="ghost" label="Ghost" />
    </div>
  ),
};
