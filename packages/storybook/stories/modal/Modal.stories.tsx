import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { Button, Modal, type ModalProps } from "@fds/core";

// 트리거 버튼을 누르면 열리는 모달. 열림 상태는 story args(open)로 관리하고,
// 액션 버튼은 close 핸들러를 받아 스토리별로 구성한다.
const withTrigger = (renderActions?: (close: () => void) => ReactNode) =>
  function Render(args: ModalProps) {
    const [{ open }, updateArgs] = useArgs();
    const close = () => updateArgs({ open: false });
    return (
      <>
        <Button variant="primary" onClick={() => updateArgs({ open: true })}>
          모달 열기
        </Button>
        <Modal {...args} open={open} onClose={close} actions={renderActions?.(close)} />
      </>
    );
  };

const meta = {
  title: "Components/Common/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: { story: { height: "360px" } },
  },
  // Modal은 position: fixed라 Docs에 인라인으로 두면 문서 전체를 덮는다.
  // 조상에 transform이 있으면 fixed가 그 조상 기준이 되므로, Docs 보기에서만 미리보기 상자 안에 가둔다.
  // (iframe(inline: false)은 아래 Props 표의 컨트롤 변경이 반영되지 않는다)
  decorators: [
    (Story, context) =>
      context.viewMode === "docs" ? (
        <div
          style={{
            transform: "translateZ(0)",
            position: "relative",
            width: "100%",
            height: 360,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Story />
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
          <Story />
        </div>
      ),
  ],
  argTypes: {
    open: { control: "boolean" },
    header: { control: "text" },
    dimmed: { control: "boolean" },
    position: { control: "object" },
    onClose: { control: false },
    children: { control: false },
    actions: { control: false },
  },
  args: {
    open: false,
    onClose: () => {},
    header: "채팅 차단",
    children: (
      <p style={{ margin: 0, fontSize: 14 }}>
        이 사용자를 차단하시겠어요? 차단하면 더 이상 메시지가 보이지 않아요.
      </p>
    ),
    style: { width: 320 },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 확인창: 버튼 2개 (균등 분할)
export const Confirm: Story = {
  render: withTrigger((close) => (
    <>
      <Button variant="line" onClick={close}>
        취소
      </Button>
      <Button variant="danger" onClick={close}>
        차단
      </Button>
    </>
  )),
};

// 제목이 없는 알림형, 버튼 1개 (Figma 40:479)
export const Alert: Story = {
  args: {
    header: undefined,
    children: <p style={{ margin: 0, fontSize: 14, textAlign: "center" }}>연결이 끊어졌어요.</p>,
  },
  render: withTrigger((close) => (
    <Button variant="primary" onClick={close}>
      확인
    </Button>
  )),
};

// 트리거 버튼 아래에 띄우는 설정 메뉴류: 딤 처리 없이 position으로 위치 지정
export const Anchored: Story = {
  args: {
    dimmed: false,
    position: { top: 56, left: "50%", transform: "translateX(-50%)" },
    header: "설정",
  },
  render: withTrigger(),
};
