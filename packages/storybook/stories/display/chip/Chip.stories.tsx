import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "@fds/core";

// Chip은 선택한 값이나 태그를 작은 알약으로 보여 준다. `Select multiple`이 고른 값을 아래에 쌓을 때도 쓴다.
const meta = {
  title: "Components/Display/Chip",
  component: Chip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
    removeLabel: { control: "text" },
    onRemove: { control: false },
  },
  args: { label: "비트코인 (BTC)" },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

// onRemove가 없으면 보기만 하는 칩이다
export const Default: Story = {};

// onRemove를 주면 ×가 생긴다. 칩을 실제로 지우는 일은 앱이 한다.
export const Removable: Story = {
  args: { onRemove: () => {} },
};

export const Disabled: Story = {
  args: { onRemove: () => {}, disabled: true },
};

// 긴 문구는 칩 안에서 말줄임된다
export const LongLabel: Story = {
  args: { label: "아주 긴 이름의 코인(운영1팀 · 콘텐츠 검수 및 승인 대상)", onRemove: () => {} },
  decorators: [
    (Story) => (
      <div style={{ width: 220 }}>
        <Story />
      </div>
    ),
  ],
};

// 목록으로 쓰는 예: 지우면 목록에서 빠진다
export const List: Story = {
  render: function Render() {
    const [tags, setTags] = useState(["#비트코인", "#이벤트", "#공지", "#점검"]);
    return (
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          margin: 0,
          padding: 0,
          listStyle: "none",
        }}
      >
        {tags.map((tag) => (
          <li key={tag}>
            <Chip label={tag} onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))} />
          </li>
        ))}
      </ul>
    );
  },
};
