import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Adjuster } from "@fds/core";

const meta = {
  title: "Components/Broadcast/Adjuster",
  component: Adjuster,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    type: "fontSize",
    onDecrease: fn(),
    onIncrease: fn(),
  },
} satisfies Meta<typeof Adjuster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FontSize: Story = {};

// 최소/최대 크기에 도달한 쪽 버튼을 비활성화한다
export const MinReached: Story = {
  args: { decreaseDisabled: true },
};

export const MaxReached: Story = {
  args: { increaseDisabled: true },
};
