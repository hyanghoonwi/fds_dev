import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { NewMessagePreview } from "@fds/core";

const meta = {
  title: "Components/Broadcast/NewMessagePreview",
  component: NewMessagePreview,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    nickname: "유저1",
    message: "지금 들어왔는데 어디까지 진행됐나요? 설명 좀 부탁드려요",
    onClick: fn(),
    style: { width: 320 },
  },
} satisfies Meta<typeof NewMessagePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// 스트리머/매니저 발신자: 닉네임이 브랜드 컬러
export const Highlighted: Story = {
  args: { nickname: "스트리머", isNicknameHighlighted: true },
};
