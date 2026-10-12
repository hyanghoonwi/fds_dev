import type { Meta, StoryObj } from "@storybook/react-vite";
import { Thumbnail } from "@fds/core";

const meta = {
  title: "Components/Broadcast/Thumbnail",
  component: Thumbnail,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Thumbnail>;

export default meta;
type Story = StoryObj<typeof meta>;

// 이미지가 없으면 bg-base 박스만 자리를 차지한다
export const Empty: Story = {};

export const WithImage: Story = {
  args: {
    src: "https://picsum.photos/220/120",
    alt: "썸네일 예시",
  },
};
