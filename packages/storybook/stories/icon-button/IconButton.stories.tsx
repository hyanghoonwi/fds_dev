import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { IconButton } from "@fds/core";
import { MoonIcon } from "@fds/core";
import { PaperPlaneIcon } from "@fds/core";

const meta = {
  title: "Components/Common/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md"],
    },
    variant: {
      control: "select",
      options: ["line", "primary", "tint", "ad"],
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
  args: { variant: "primary", size: "md", "aria-label": "전송", children: <PaperPlaneIcon /> },
};

export const Ad: Story = {
  args: { variant: "ad", size: "sm", "aria-label": "광고", children: null },
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
