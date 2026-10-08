import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { useArgs } from "storybook/preview-api";
import { Textarea } from "@fds/core";

const meta = {
  title: "Components/Common/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onChange: { control: false },
    showCount: { control: "boolean" },
    maxLength: { control: "number" },
  },
  args: {
    value: "",
    onChange: () => {},
    placeholder: "메시지를 입력하세요 (Shift+Enter로 줄바꿈)",
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs();
    return (
      <div style={{ width: 280 }}>
        <Textarea
          {...args}
          onChange={(value) => updateArgs({ value })}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              alert(`전송: ${args.value}`);
              updateArgs({ value: "" });
            }
          }}
        />
      </div>
    );
  },
};

// 값은 스토리 안의 useState로 관리한다 (args 채널은 비동기라 빠른 입력이 덮어써질 수 있다)

// showCount: 입력창 아래 왼쪽에 `현재/최대`를 표시한다. 최대값은 maxLength를 쓴다.
export const WithCount: Story = {
  args: { showCount: true, maxLength: 100, placeholder: "최대 100자까지 입력할 수 있어요" },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ width: 280 }}>
        <Textarea {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

// maxLength가 없으면 현재 글자수만 표시한다
export const CountOnly: Story = {
  args: { showCount: true, value: "글자수만 표시돼요" },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ width: 280 }}>
        <Textarea {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

// 입력으로는 maxLength를 넘길 수 없지만, 값이 코드로 주어져 넘친 경우 글자수가 에러 색으로 바뀐다
export const OverLimit: Story = {
  args: { showCount: true, maxLength: 10, value: "초과된 값이 외부에서 주어진 경우" },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ width: 280 }}>
        <Textarea {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true, showCount: true, maxLength: 100, value: "비활성 상태" },
  render: (args) => (
    <div style={{ width: 280 }}>
      <Textarea {...args} />
    </div>
  ),
};
