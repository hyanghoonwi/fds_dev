import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@fds/core";

const meta = {
  title: "Components/Common/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "전체방송",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
