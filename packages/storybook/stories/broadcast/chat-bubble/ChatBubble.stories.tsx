import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatBubble } from "@fds/core";

const meta = {
  title: "Components/Broadcast/ChatBubble",
  component: ChatBubble,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["received", "sent"],
    },
  },
  args: {
    children: "안녕하세요",
  },
} satisfies Meta<typeof ChatBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Received: Story = {
  args: { variant: "received" },
};

export const Sent: Story = {
  args: { variant: "sent" },
};

export const LongText: Story = {
  args: {
    variant: "received",
    children:
      "줄바꿈이 발생해도 디자인이 유지되는지 확인하기 위한 긴 메시지 예시입니다. 최대 너비를 넘어가면 자동으로 다음 줄로 넘어가야 합니다.",
  },
};
