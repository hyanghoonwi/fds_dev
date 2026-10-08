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
    label: { control: "text" },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    description: { control: "text" },
    error: { control: "text" },
    required: { control: "boolean" },
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

// 라벨은 `label` prop으로 준다. 라벨을 누르면 입력창에 포커스가 가고, `required`면 `*`가 붙는다.
export const WithLabel: Story = {
  args: { label: "상세 설명", required: true, placeholder: "내용을 입력하세요" },
  render: function Render(args) {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: 320 }}>
        <Textarea {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

// 라벨이 왼쪽에 놓인다 (Input의 `orientation="horizontal"`과 같다)
export const Horizontal: Story = {
  args: { label: "상세 설명", orientation: "horizontal", placeholder: "내용을 입력하세요" },
  render: function Render(args) {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: 420 }}>
        <Textarea {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

// 설명과 글자수가 함께 있으면 설명이 먼저, 글자수는 그 아래 왼쪽에 놓인다
export const WithDescription: Story = {
  args: {
    label: "상세 설명",
    description: "방송 소개에 그대로 노출돼요.",
    showCount: true,
    maxLength: 200,
    placeholder: "내용을 입력하세요",
  },
  render: function Render(args) {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: 320 }}>
        <Textarea {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

// 에러가 있으면 설명 대신 에러가 보이고, 입력창에 에러 링이 켜진다. 글자수는 그대로 아래에 남는다.
export const WithError: Story = {
  args: {
    label: "상세 설명",
    required: true,
    description: "방송 소개에 그대로 노출돼요.",
    showCount: true,
    maxLength: 200,
    placeholder: "내용을 입력하세요",
  },
  render: function Render(args) {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: 320 }}>
        <Textarea
          {...args}
          value={value}
          onChange={setValue}
          error={value.trim().length === 0 ? "상세 설명을 입력해 주세요." : undefined}
        />
      </div>
    );
  },
};
