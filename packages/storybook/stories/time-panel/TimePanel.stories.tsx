import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimePanel } from "@fds/core";

// TimePanel = "시"/"분" 목록으로 시간을 고르는 패널이다. 확인 버튼·팝업이 없어서
// 화면에 바로 놓거나 Popover, Modal 안에 넣어 쓴다. 시/분을 고를 때마다 onChange가 바로 호출된다.
// 값은 value로만 제어하므로 아래 스토리처럼 useState로 받아서 다시 넘긴다.
const meta = {
  title: "Components/Common/TimePanel",
  component: TimePanel,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    value: { control: "text" },
    minuteStep: { control: "number" },
    autoFocus: { control: "boolean" },
    onChange: { control: false },
  },
} satisfies Meta<typeof TimePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

// 값이 없는 상태에서 시를 고르면 "HH:00", 분을 고르면 "00:mm"이 된다
export const Default: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | null>(args.value ?? null);
    return (
      <div style={{ padding: 12, border: "1px solid var(--fds-border-line)", borderRadius: 12 }}>
        <TimePanel {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

// 열릴 때 선택된 14시/30분이 목록 가운데 근처에 보이고 은은한 파란 배경으로 표시된다
export const WithValue: Story = {
  args: { value: "14:30" },
  render: Default.render,
};

// 분 목록이 10분 간격(00, 10, … 50)으로 표시된다
export const MinuteStep10: Story = {
  args: { value: "09:30", minuteStep: 10 },
  render: Default.render,
};

// 선택값을 바깥에서 보여 주는 제어 예
export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | null>("18:15");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        <div style={{ padding: 12, border: "1px solid var(--fds-border-line)", borderRadius: 12 }}>
          <TimePanel {...args} value={value} onChange={setValue} />
        </div>
        <div style={{ fontSize: 13 }} data-testid="value">
          선택한 시간: <strong>{value ?? "없음"}</strong>
        </div>
      </div>
    );
  },
};
