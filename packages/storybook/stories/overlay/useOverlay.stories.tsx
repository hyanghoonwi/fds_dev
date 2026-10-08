import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Modal, OverlayProvider, useOverlay } from "@fds/core";

// useOverlay: <OverlayProvider> 한 곳만 두면, 어디서든 함수 안에서 모달 같은 overlay를 열 수 있다.
// openAsync는 닫힐 때 close(value)로 넘긴 값을 Promise로 돌려준다.
const meta = {
  title: "Hooks/useOverlay",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    // overlay가 position: fixed라 Docs 페이지 전체를 덮지 않도록 iframe 안에서 렌더링
    docs: { story: { inline: false, iframeHeight: 360 } },
  },
  decorators: [
    (Story) => (
      <OverlayProvider>
        <Story />
      </OverlayProvider>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// open: 열기만 하고, 닫기는 render 함수가 받은 close로 처리한다
export const Open: Story = {
  render: function Render() {
    const overlay = useOverlay();
    return (
      <Button
        variant="primary"
        onClick={() =>
          overlay.open(({ isOpen, close }) => (
            <Modal
              open={isOpen}
              onClose={close}
              header="공지"
              style={{ width: 320 }}
              actions={
                <Button variant="primary" onClick={() => close()}>
                  확인
                </Button>
              }
            >
              <p style={{ margin: 0, fontSize: 14 }}>함수 안에서 연 모달이에요.</p>
            </Modal>
          ))
        }
      >
        모달 열기
      </Button>
    );
  },
};

// openAsync: 사용자의 선택을 await로 받는다 (취소/바깥 클릭/Esc는 close()라서 undefined)
export const Confirm: Story = {
  render: function Render() {
    const overlay = useOverlay();
    const handleDelete = async () => {
      const ok = await overlay.openAsync<boolean>(({ isOpen, close }) => (
        <Modal
          open={isOpen}
          onClose={() => close(false)}
          header="채팅 차단"
          style={{ width: 320 }}
          actions={
            <>
              <Button variant="line" onClick={() => close(false)}>
                취소
              </Button>
              <Button variant="danger" onClick={() => close(true)}>
                차단
              </Button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 14 }}>이 사용자를 차단하시겠어요?</p>
        </Modal>
      ));
      await overlay.openAsync(({ isOpen, close }) => (
        <Modal
          open={isOpen}
          onClose={close}
          style={{ width: 320 }}
          actions={
            <Button variant="primary" onClick={() => close()}>
              확인
            </Button>
          }
        >
          <p style={{ margin: 0, fontSize: 14, textAlign: "center" }}>
            {ok ? "차단했어요." : "취소했어요."}
          </p>
        </Modal>
      ));
    };
    return (
      <Button variant="danger" onClick={handleDelete}>
        차단하기
      </Button>
    );
  },
};

// 여러 개를 연달아 열면 쌓인다. closeAll로 한 번에 닫을 수 있다.
export const Stacked: Story = {
  render: function Render() {
    const overlay = useOverlay();
    const openLayer = (depth: number) => {
      overlay.open(({ isOpen, close }) => (
        <Modal
          open={isOpen}
          onClose={close}
          header={`${depth}번째 모달`}
          style={{ width: 320 }}
          actions={
            <>
              <Button variant="line" onClick={() => overlay.closeAll()}>
                모두 닫기
              </Button>
              <Button variant="primary" onClick={() => openLayer(depth + 1)}>
                하나 더
              </Button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 14 }}>아래에 쌓인 모달은 닫기 전까지 유지돼요.</p>
        </Modal>
      ));
    };
    return (
      <Button variant="primary" onClick={() => openLayer(1)}>
        모달 쌓기
      </Button>
    );
  },
};

// 쌓인 모달에서 Esc는 맨 위 모달 하나만 닫는다 (Stacked 스토리에서 Esc를 눌러 확인)

// 닫히는 중(exitDelay 대기)에 같은 id로 다시 열어도 새로 연 overlay가 지워지지 않는다
export const ReopenWhileClosing: Story = {
  render: function Render() {
    const overlay = useOverlay();
    return (
      <Button
        variant="primary"
        onClick={() => {
          const render: Parameters<typeof overlay.open>[0] = ({ isOpen, close }) => (
            <Modal
              open={isOpen}
              onClose={close}
              header="다시 열린 모달"
              style={{ width: 320 }}
              actions={
                <Button variant="primary" onClick={() => close()}>
                  확인
                </Button>
              }
            >
              <p style={{ margin: 0, fontSize: 14 }}>닫는 중에 다시 열어도 남아 있어요.</p>
            </Modal>
          );
          overlay.open(render, { overlayId: "reopen", exitDelay: 400 });
          overlay.close("reopen");
          overlay.open(render, { overlayId: "reopen", exitDelay: 400 });
        }}
      >
        열고 → 닫고 → 바로 다시 열기
      </Button>
    );
  },
};

// 같은 overlayId로 openAsync를 두 번 불러도 모달은 하나만 뜨고, 두 Promise가 같은 값으로 끝난다
export const DuplicateOverlayId: Story = {
  render: function Render() {
    const overlay = useOverlay();
    const [result, setResult] = useState("아직 선택 안 함");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
        <Button
          variant="primary"
          onClick={async () => {
            const render: Parameters<typeof overlay.openAsync<string>>[0] = ({ isOpen, close }) => (
              <Modal
                open={isOpen}
                onClose={() => close("취소")}
                header="같은 id로 두 번 연 모달"
                style={{ width: 320 }}
                actions={
                  <>
                    <Button variant="line" onClick={() => close("취소")}>
                      취소
                    </Button>
                    <Button variant="primary" onClick={() => close("확인")}>
                      확인
                    </Button>
                  </>
                }
              >
                <p style={{ margin: 0, fontSize: 14 }}>모달은 하나만 떠요.</p>
              </Modal>
            );
            const [first, second] = await Promise.all([
              overlay.openAsync<string>(render, { overlayId: "dup" }),
              overlay.openAsync<string>(render, { overlayId: "dup" }),
            ]);
            setResult(`첫 번째: ${first}, 두 번째: ${second}`);
          }}
        >
          같은 id로 두 번 열기
        </Button>
        <span style={{ fontSize: 14 }}>결과: {result}</span>
      </div>
    );
  },
};
