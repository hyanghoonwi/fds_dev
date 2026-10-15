import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { IconButton } from "@fds/core";
import { MoonIcon } from "@fds/core";
import { PaperPlaneIcon } from "@fds/core";

const meta = {
  title: "Components/Actions/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    variant: {
      control: "select",
      options: ["line", "primary", "tint", "ghost", "ad"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    "aria-label": "다크모드 전환",
    children: <MoonIcon />,
    onClick: fn(),
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {
  args: { variant: "line" },
};

export const Primary: Story = {
  args: { variant: "primary", size: "lg", "aria-label": "전송", children: <PaperPlaneIcon /> },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Ad: Story = {
  args: { variant: "ad", size: "md", "aria-label": "광고", children: null },
};

export const Tint: Story = {
  args: { variant: "tint" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

// 지름: sm 32 · md 36(기본) · lg 40 · xl 48px
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <IconButton key={size} {...args} size={size} />
      ))}
    </div>
  ),
};
