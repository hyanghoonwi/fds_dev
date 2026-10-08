import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Input, SearchIcon, UserIcon, EyeIcon } from "@fds/core";

const meta = {
  title: "Components/Common/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    label: { control: "text" },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    labelWidth: { control: "number" },
    leftAddon: { control: false },
    rightAddon: { control: false },
    description: { control: "text" },
    error: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    placeholder: "메시지를 입력하세요",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

// 라벨이 입력 필드 위에 놓인다 (기본 배치)
export const WithLabel: Story = {
  args: { label: "닉네임", placeholder: "닉네임을 입력하세요" },
};

// 라벨이 입력 필드 왼쪽에 놓인다
export const Horizontal: Story = {
  args: { label: "닉네임", orientation: "horizontal", placeholder: "닉네임을 입력하세요" },
};

// description: 입력 필드 아래에 설명(도움말)을 표시한다. 에러가 있으면 에러가 설명을 대신한다.
export const WithDescription: Story = {
  args: {
    label: "닉네임",
    placeholder: "닉네임을 입력하세요",
    description: "2~12자의 한글, 영문, 숫자만 사용할 수 있어요.",
  },
};

export const HorizontalWithDescription: Story = {
  args: {
    label: "닉네임",
    orientation: "horizontal",
    placeholder: "닉네임을 입력하세요",
    description: "2~12자의 한글, 영문, 숫자만 사용할 수 있어요.",
  },
};

// 라벨 뒤에 필수 표시(*)가 붙고 입력 필드에 required가 적용된다
export const Required: Story = {
  args: { label: "이메일", required: true, placeholder: "name@example.com", type: "email" },
};

// error 메시지가 있으면 입력 필드가 에러 스타일이 되고 메시지가 아래에 표시된다
export const WithError: Story = {
  args: {
    label: "이메일",
    required: true,
    defaultValue: "name@",
    error: "올바른 이메일 형식이 아니에요.",
  },
};

// 설명과 에러가 함께 있으면 에러만 표시된다
export const DescriptionReplacedByError: Story = {
  args: {
    label: "이메일",
    defaultValue: "name@",
    description: "회사 메일을 입력해 주세요.",
    error: "올바른 이메일 형식이 아니에요.",
  },
};

// 라벨이 길어 줄바꿈되면 labelWidth로 라벨 영역을 늘린다
export const HorizontalLongLabel: Story = {
  args: {
    label: "알림 수신 이메일",
    orientation: "horizontal",
    labelWidth: 128,
    placeholder: "name@example.com",
  },
};

// leftAddon: 아이콘 등 입력값 왼쪽에 붙는 요소
export const LeftAddon: Story = {
  args: { leftAddon: <SearchIcon />, placeholder: "검색어를 입력하세요" },
};

// rightAddon: 단위 텍스트 (type="number"와 함께 쓰면 증감 버튼이 숨겨진다)
export const Unit: Story = {
  args: { label: "글자 크기", type: "number", defaultValue: 14, rightAddon: "px" },
};

// rightAddon: 아이콘
export const RightIcon: Story = {
  args: { type: "password", defaultValue: "password", rightAddon: <EyeIcon /> },
};

// rightAddon: 버튼 — addon 안의 버튼은 자체 클릭 동작을 그대로 가진다
export const ButtonAddon: Story = {
  args: {
    label: "이메일",
    placeholder: "name@example.com",
    rightAddon: <Button variant="tint">중복확인</Button>,
  },
};

// 양쪽 addon + 라벨 + 에러 조합
export const Combined: Story = {
  args: {
    label: "최대 인원",
    leftAddon: <UserIcon />,
    rightAddon: "명",
    type: "number",
    defaultValue: 0,
    required: true,
    orientation: "horizontal",
    error: "1명 이상 입력해 주세요.",
  },
};

export const HorizontalWithError: Story = {
  args: {
    label: "이메일",
    required: true,
    orientation: "horizontal",
    defaultValue: "name@",
    error: "올바른 이메일 형식이 아니에요.",
  },
};
