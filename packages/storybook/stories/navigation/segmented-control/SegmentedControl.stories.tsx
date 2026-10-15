import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { useArgs } from "storybook/preview-api";
import { SegmentedControl } from "@fds/core";

const meta = {
  title: "Components/Navigation/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
    onChange: { control: false },
  },
  args: {
    items: [
      { value: "chat", label: "채팅" },
      { value: "vod", label: "VOD 목록" },
    ],
    value: "chat",
    onChange: () => {},
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs();
    return (
      <div style={{ width: 280 }}>
        <SegmentedControl {...args} onChange={(value) => updateArgs({ value })} />
      </div>
    );
  },
};

// 활성 탭 아래에 페이지 점을 표시한다 (공지가 여러 개일 때 등)
export const WithDots: Story = {
  args: {
    items: [
      { value: "chat", label: "채팅" },
      { value: "notice", label: "공지", dotsCount: 3, activeDotIndex: 1 },
    ],
    value: "notice",
  },
  render: Default.render,
};

// 항목 최소 높이: sm 28 · md 32(기본) · lg 40 · xl 48px
export const Sizes: Story = {
  render: function Render(args) {
    const [value, setValue] = useState("chat");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 320 }}>
        {(["sm", "md", "lg", "xl"] as const).map((size) => (
          <SegmentedControl key={size} {...args} size={size} value={value} onChange={setValue} />
        ))}
      </div>
    );
  },
};
