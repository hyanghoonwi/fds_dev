import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "@fds/core";

const meta = {
  title: "Components/Actions/Button",
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
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
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

// sm(28px) / md(36px, 기본) / lg(44px) / xl(52px)
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {(["primary", "line"] as const).map((variant) => (
        <div key={variant} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {(["sm", "md", "lg", "xl"] as const).map((size) => (
            <Button key={size} {...args} size={size} variant={variant}>
              {size}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
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
