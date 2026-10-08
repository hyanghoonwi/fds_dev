import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "@fds/core";

const meta = {
  title: "Components/Common/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["line", "primary", "tint", "danger"],
    },
    disabled: { control: "boolean" },
    icon: { control: false },
  },
  args: {
    children: "재접속",
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {
  args: { variant: "line" },
};

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Tint: Story = {
  args: { variant: "tint" },
};

export const Danger: Story = {
  args: { variant: "danger" },
};

export const Disabled: Story = {
  args: { variant: "line", disabled: true },
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12 }}>
      <Button {...args} variant="line" />
      <Button {...args} variant="primary" />
      <Button {...args} variant="tint" />
      <Button {...args} variant="danger" />
    </div>
  ),
};
