import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmojiPicker, encodeEmojiMarker, renderEmojiMarkedText, type EmojiItem } from "@fds/core";
import { SmileIcon } from "@fds/core";

const meta = {
  title: "Components/Broadcast/EmojiPicker",
  component: EmojiPicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    icon: { control: false },
    onSelect: { control: false },
  },
  args: {
    icon: <SmileIcon size={26} />,
    placement: "top",
    align: "start",
    onSelect: () => {},
  },
} satisfies Meta<typeof EmojiPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// onSelect로 선택한 이모지를 받아서 실제로 어디에 쓸지는 이 컴포넌트를 사용하는
// 쪽에서 결정합니다 (예: 채팅 메시지로 전송, 반응 카운트 올리기 등).
export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<EmojiItem | null>(null);
    return (
      <div>
        <EmojiPicker
          {...args}
          onSelect={(emoji) => {
            setSelected(emoji);
          }}
        />
        {selected && <p style={{ marginTop: 12, fontSize: 12 }}>선택: {selected.label}</p>}
      </div>
    );
  },
};

// 텍스트와 이모지가 섞인 메시지: 전송 시 encodeEmojiMarker로 body에 끼우고, 표시할 때 renderEmojiMarkedText로 <img>로 바꾼다
export const MarkedText: Story = {
  render: () => {
    const body = `오늘 방송 최고 ${encodeEmojiMarker("clap")} 수고하셨습니다 ${encodeEmojiMarker("heart")}`;
    return (
      <p style={{ margin: 0, fontSize: 14, lineHeight: "26px" }}>
        {renderEmojiMarkedText(body, "emoji-inline")}
        <style>{".emoji-inline{width:20px;height:20px;vertical-align:middle;margin:0 2px}"}</style>
      </p>
    );
  },
};

// 이모지를 고르면 패널이 닫힌다 (기본은 연속 입력을 위해 열린 상태 유지)
export const CloseOnSelect: Story = {
  args: { closeOnSelect: true },
};
