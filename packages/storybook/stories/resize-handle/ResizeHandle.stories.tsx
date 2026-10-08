import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResizeHandle } from "@fds/core";

const meta = {
  title: "Components/Common/ResizeHandle",
  component: ResizeHandle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onResize: { control: false },
  },
  args: {
    onResize: () => {},
  },
} satisfies Meta<typeof ResizeHandle>;

export default meta;
type Story = StoryObj<typeof meta>;

// onResize는 이동한 delta 값만 넘겨주고, 실제 너비/높이 상태는 이 컴포넌트를
// 사용하는 쪽(패널을 감싸는 부모)이 직접 관리합니다.
export const Bar: Story = {
  args: { type: "bar" },
  render: (args) => {
    const [width, setWidth] = useState(120);
    return (
      <div style={{ display: "flex", height: 160 }}>
        <div
          style={{
            width,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #e7ebf2",
            fontSize: 12,
          }}
        >
          {Math.round(width)}px
        </div>
        <ResizeHandle
          {...args}
          onResize={(delta) => setWidth((prev) => Math.max(60, prev + delta))}
        />
      </div>
    );
  },
};

export const Circle: Story = {
  args: { type: "circle" },
  render: (args) => {
    const [height, setHeight] = useState(100);
    return (
      <div style={{ width: 280 }}>
        <div
          style={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #e7ebf2",
            borderBottom: "none",
            fontSize: 12,
          }}
        >
          {Math.round(height)}px
        </div>
        <ResizeHandle
          {...args}
          onResize={(delta) => setHeight((prev) => Math.max(60, prev + delta))}
        />
      </div>
    );
  },
};
