import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar, formatDateValue } from "@fds/core";

// Calendar는 날짜를 고르는 "패널"이다. 테두리·그림자·열고 닫는 동작이 없어서
// 화면에 바로 놓거나, DatePicker 팝업이나 Modal 안에 넣어 쓴다. 값은 `YYYY-MM-DD` 문자열이다.
const meta = {
  title: "Components/Common/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    value: { control: false },
    defaultValue: { control: "text" },
    onChange: { control: false },
    min: { control: "text" },
    max: { control: "text" },
    initialMonth: { control: "text" },
    isDateDisabled: { control: false },
    autoFocus: { control: "boolean" },
  },
  // 패널 자체는 배경이 없으므로, 스토리에서는 구분이 되도록 박스 안에 둔다
  decorators: [
    (Story) => (
      <div
        style={{
          padding: 16,
          border: "1px solid var(--fds-border-line)",
          borderRadius: 12,
          background: "var(--fds-bg-surface)",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 비제어: defaultValue로 시작하고, 선택은 컴포넌트가 들고 있는다
export const Default: Story = {
  args: { defaultValue: "2026-10-08" },
};

// 제어: 부모가 값을 들고 있고, onChange로 받은 문자열을 state에 저장한다
export const Controlled: Story = {
  render: function Render() {
    const [date, setDate] = useState<string | null>("2026-10-08");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        <Calendar value={date} onChange={setDate} />
        <div style={{ fontSize: 13 }}>
          선택한 날짜: <strong>{date ?? "없음"}</strong>
        </div>
        <button
          type="button"
          style={{ fontSize: 12, cursor: "pointer" }}
          onClick={() => setDate(formatDateValue(new Date()))}
        >
          오늘로 바꾸기 (formatDateValue)
        </button>
      </div>
    );
  },
};

// min/max(포함) 밖의 날짜는 선택할 수 없고, 범위 밖으로 가는 달 이동 버튼은 비활성화된다
export const MinMax: Story = {
  args: { defaultValue: "2026-10-15", min: "2026-10-10", max: "2026-10-25" },
};

// isDateDisabled로 주말과 공휴일을 막는다
export const DisabledDates: Story = {
  args: {
    initialMonth: "2026-10",
    isDateDisabled: (date) => {
      const holidays = ["2026-10-03", "2026-10-09"];
      return date.getDay() === 0 || date.getDay() === 6 || holidays.includes(formatDateValue(date));
    },
  },
};

// 선택된 날짜가 없을 때 처음 보여줄 달
export const InitialMonth: Story = {
  args: { initialMonth: "2027-01" },
};
