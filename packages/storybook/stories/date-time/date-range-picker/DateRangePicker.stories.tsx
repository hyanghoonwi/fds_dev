import { useState } from "react";
import type { FormEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, DateRangePicker, relativeDateRange } from "@fds/core";
import type { DateRangeValue } from "@fds/core";

// DateRangePicker = DatePicker 두 개 + 시작일/종료일 보정. 종료일이 시작일보다 이른 범위는 만들어지지 않는다.
// - 종료일 달력은 시작일 이전을 막고, 비어 있으면 시작일이 있는 달에서 열린다.
// - 시작일을 종료일보다 뒤로 고르면 종료일이 비워진다(종료일을 먼저 바꾸지 않고 기간을 통째로 옮길 수 있다).
const meta = {
  title: "Components/Date & Time/DateRangePicker",
  component: DateRangePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { story: { height: "420px" } },
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    allowUndecidedEnd: { control: "boolean" },
    min: { control: "text" },
    max: { control: "text" },
    value: { control: false },
    defaultValue: { control: false },
    presets: { control: false },
    isDateDisabled: { control: false },
    onChange: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 460, height: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: "기간" } };

// 시작일을 종료일(10/20)보다 뒤인 10/25로 고르면 종료일이 비워지고, 종료일 달력은 10월에서 열린다
export const MoveRangeLater: Story = {
  args: { label: "기간", defaultValue: { start: "2026-10-06", end: "2026-10-20" } },
};

export const WithValue: Story = {
  args: { label: "기간", defaultValue: { start: "2026-10-06", end: "2026-10-20" } },
};

export const Horizontal: Story = {
  args: {
    label: "노출 기간",
    orientation: "horizontal",
    defaultValue: { start: "2026-10-06", end: "2026-10-20" },
  },
};

export const WithError: Story = {
  args: { label: "기간", required: true, error: "기간을 선택해 주세요." },
};

// 선택 가능한 범위(min/max)는 시작일·종료일 모두에 적용된다
export const MinMax: Story = {
  args: { label: "예약 기간", min: "2026-10-10", max: "2026-10-25" },
};

// "종료일 미정"을 켜면 종료일이 비활성화되고 값에 endUndecided: true가 담긴다
export const AllowUndecidedEnd: Story = {
  args: {
    label: "이벤트 기간",
    allowUndecidedEnd: true,
    defaultValue: { start: "2026-10-06", end: null, endUndecided: true },
  },
};

// 프리셋은 누를 때마다 오늘 기준으로 계산된다(value를 함수로 준 경우)
export const WithPresets: Story = {
  args: {
    label: "조회 기간",
    presets: [
      { label: "오늘", value: () => relativeDateRange(0, 0) },
      { label: "최근 7일", value: () => relativeDateRange(-6, 0) },
      { label: "최근 30일", value: () => relativeDateRange(-29, 0) },
    ],
    defaultValue: relativeDateRange(-6, 0),
  },
};

export const Disabled: Story = {
  args: { label: "기간", disabled: true, defaultValue: { start: "2026-10-06", end: "2026-10-20" } },
};

// ---- 실제 사용 예 -----------------------------------------------------------------------

// 제어 모드 폼: 값은 { start, end, endUndecided } 객체이고, 검증은 앱이 한다.
export const ControlledForm: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 560 } } },
  decorators: [
    (Story) => (
      <div style={{ width: 460, minHeight: 480 }}>
        <Story />
      </div>
    ),
  ],
  render: function Render() {
    const [range, setRange] = useState<DateRangeValue>({ start: null, end: null });
    const [error, setError] = useState<string>();
    const [payload, setPayload] = useState<string | null>(null);

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      if (!range.start || (!range.end && !range.endUndecided)) {
        setError("시작일과 종료일을 선택해 주세요.");
        setPayload(null);
        return;
      }
      setError(undefined);
      setPayload(JSON.stringify(range, null, 2));
    };

    return (
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <DateRangePicker
          label="노출 기간"
          required
          allowUndecidedEnd
          presets={[
            { label: "오늘~14일", value: () => relativeDateRange(0, 14) },
            { label: "오늘~30일", value: () => relativeDateRange(0, 30) },
          ]}
          value={range}
          onChange={(next) => {
            setRange(next);
            setError(undefined);
          }}
          error={error}
        />
        <Button type="submit" variant="primary">
          저장
        </Button>
        {payload && <pre style={{ margin: 0, fontSize: 12 }}>{payload}</pre>}
      </form>
    );
  },
};
