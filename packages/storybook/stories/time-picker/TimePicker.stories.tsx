import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TimePicker } from "@fds/core";

const meta = {
  title: "Components/Common/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    // iframe(inline: false)은 아래 Props 표의 컨트롤 변경이 반영되지 않아, 인라인으로 렌더링하고 팝업이 들어갈 높이를 확보한다.
    docs: { story: { height: "360px" } },
  },
  argTypes: {
    value: { control: "text" },
    defaultValue: { control: "text" },
    minuteStep: { control: "number" },
    label: { control: "text" },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    error: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    onChange: { control: false },
  },
  args: {
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280, minHeight: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// antd showTime 방식: 입력창/시계 아이콘을 누르면 아래에 "시"/"분" 스크롤 목록이 열린다.
// 항목을 눌러도 팝오버는 열린 채 유지되고 draft(선택 표시)만 바뀐다. "확인"을 눌러야 입력창에 "HH:mm"이 반영되며 onChange가 호출된다.
// Esc·바깥 클릭·트리거 재클릭으로 닫으면 draft를 버린다. 아무것도 고르지 않으면 "확인"은 비활성이다.
export const Default: Story = {};

// 열릴 때 현재 값(14:30)이 목록 가운데 근처에 보이고 선택 표시(은은한 파란 배경)가 된다
export const WithValue: Story = {
  args: { defaultValue: "14:30" },
};

// 분 목록이 10분 간격(00, 10, … 50)으로 표시된다
export const MinuteStep10: Story = {
  args: { minuteStep: 10, defaultValue: "09:30" },
};

// 라벨을 눌러도 팝오버가 열린다 (입력창 클릭과 동일)
export const WithLabel: Story = {
  args: { label: "방송 시작 시간", required: true },
};

export const WithError: Story = {
  args: { label: "방송 시작 시간", required: true, error: "시작 시간을 선택해 주세요." },
};

export const Horizontal: Story = {
  args: { label: "시작 시간", orientation: "horizontal", defaultValue: "18:00" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "14:30" },
};
