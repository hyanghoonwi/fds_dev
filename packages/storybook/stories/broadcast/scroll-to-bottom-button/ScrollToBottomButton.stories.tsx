import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ScrollToBottomButton } from "@fds/core";

const meta = {
  title: "Components/Broadcast/ScrollToBottomButton",
  component: ScrollToBottomButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof ScrollToBottomButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
