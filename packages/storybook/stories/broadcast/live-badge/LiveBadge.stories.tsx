import type { Meta, StoryObj } from "@storybook/react-vite";
import { LiveBadge } from "@fds/core";

const meta = {
  title: "Components/Broadcast/LiveBadge",
  component: LiveBadge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  argTypes: {
    status: {
      control: "select",
      options: ["live", "offline"],
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "#1a1a1a",
          padding: 12,
          borderRadius: 8,
          display: "inline-flex",
          gap: 8,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LiveBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Live: Story = {
  args: { status: "live" },
};

export const Offline: Story = {
  args: { status: "offline", label: "종료" },
};
