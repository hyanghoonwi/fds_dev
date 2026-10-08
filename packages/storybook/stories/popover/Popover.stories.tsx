import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, CalendarIcon, Calendar, Input, Modal, Popover } from "@fds/core";

// Popover = 기준 요소(anchor) 가까이에 뜨는 범용 오버레이다. 날짜·시간은 모른다.
//
// "기존 Input에 달력을 꽂는 방법"은 이 한 장면으로 끝난다.
//   1) Popover의 `trigger`에 Input을 넣는다 (읽기 전용 + 클릭 시 toggle).
//   2) Input의 `fieldRef`에 `anchorRef`를 넘겨, 팝업이 입력창 바로 아래에 붙게 한다.
//   3) 팝업 내용(children)에 Calendar를 넣고, 날짜를 고르면 값을 저장한 뒤 `close()`를 부른다.
// DatePicker / TimePicker는 이 조합을 미리 해 둔 편의 컴포넌트일 뿐이다.
const meta = {
  title: "Components/Common/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    // iframe(inline: false)은 아래 Props 표의 컨트롤 변경이 반영되지 않아, 인라인으로 렌더링하고 팝업이 들어갈 높이를 확보한다.
    docs: { story: { height: "380px" } },
  },
  argTypes: {
    placement: {
      control: "select",
      options: ["bottom-start", "bottom-end", "top-start", "top-end"],
    },
    offset: { control: "number" },
    open: { control: false },
    trigger: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

// 입력창에 달력 꽂기: Input + Popover + Calendar를 직접 조합한 모습 (DatePicker가 하는 일과 같다)
export const WithInputTrigger: Story = {
  args: { label: "날짜 선택", trigger: null, children: null },
  decorators: [
    (Story) => (
      <div style={{ width: 360, height: 400 }}>
        <Story />
      </div>
    ),
  ],
  render: function Render() {
    const [date, setDate] = useState<string | null>(null);
    return (
      <Popover
        label="날짜 선택"
        trigger={({ open, toggle, anchorRef }) => (
          <Input
            readOnly
            label="시작일"
            placeholder="날짜 선택"
            value={date ?? ""}
            fieldRef={anchorRef}
            onClick={toggle}
            aria-haspopup="dialog"
            aria-expanded={open}
            rightAddon={<CalendarIcon />}
          />
        )}
      >
        {({ close }) => (
          <Calendar
            autoFocus
            value={date}
            onSelect={(next) => {
              setDate(next);
              close();
            }}
          />
        )}
      </Popover>
    );
  },
};

// 버튼 트리거: 버튼의 `ref`에 anchorRef를 넘기면 팝업이 버튼에 붙는다. 컨테이너는 내용 폭(w-fit)으로 둔다.
export const WithButtonTrigger: Story = {
  args: { label: "더보기 메뉴", trigger: null, children: null },
  decorators: [
    (Story) => (
      <div style={{ height: 240 }}>
        <Story />
      </div>
    ),
  ],
  render: function Render() {
    return (
      <Popover
        label="더보기 메뉴"
        containerClassName="w-fit"
        trigger={({ open, toggle, anchorRef }) => (
          <Button
            ref={anchorRef}
            variant="line"
            onClick={toggle}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            더보기
          </Button>
        )}
      >
        {({ close }) => (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 160 }}>
            <Button variant="line" onClick={close}>
              방송 공유
            </Button>
            <Button variant="line" onClick={close}>
              링크 복사
            </Button>
            <Button variant="danger" onClick={close}>
              신고하기
            </Button>
          </div>
        )}
      </Popover>
    );
  },
};

// 네 가지 placement. 기준 요소(버튼)의 왼쪽/오른쪽 가장자리에 맞춰 아래 또는 위에 뜬다.
export const Placement: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 520 } } },
  args: { label: "placement", trigger: null, children: null },
  render: function Render() {
    const placements = ["bottom-start", "bottom-end", "top-start", "top-end"] as const;
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 200px)",
          columnGap: 40,
          rowGap: 160,
          padding: "80px 40px",
        }}
      >
        {placements.map((placement) => (
          <Popover
            key={placement}
            defaultOpen
            label={placement}
            placement={placement}
            containerClassName="w-full"
            trigger={({ anchorRef, toggle }) => (
              <Button ref={anchorRef} variant="line" onClick={toggle} style={{ width: "100%" }}>
                {placement}
              </Button>
            )}
          >
            <span style={{ fontSize: 12, whiteSpace: "nowrap" }}>{placement} 정렬</span>
          </Popover>
        ))}
      </div>
    );
  },
};

// 제어 모드: open / onOpenChange로 바깥에서 열고 닫는다.
export const Controlled: Story = {
  args: { label: "제어 모드", trigger: null, children: null },
  decorators: [
    (Story) => (
      <div style={{ width: 320, height: 240 }}>
        <Story />
      </div>
    ),
  ],
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button variant="primary" onClick={() => setOpen(true)}>
            열기
          </Button>
          <Button variant="line" onClick={() => setOpen(false)}>
            닫기
          </Button>
          <span style={{ fontSize: 13 }} data-testid="state">
            상태: {open ? "열림" : "닫힘"}
          </span>
        </div>
        <Popover
          label="제어 모드"
          open={open}
          onOpenChange={setOpen}
          trigger={({ anchorRef }) => (
            <Input readOnly fieldRef={anchorRef} placeholder="이 입력창 아래에 붙어요" />
          )}
        >
          <span style={{ fontSize: 13 }}>바깥 클릭이나 Esc로도 닫혀요.</span>
        </Popover>
      </div>
    );
  },
};

// Modal 안에서도 쓸 수 있다. 팝오버가 열려 있을 때 Esc는 팝오버만 닫고, 한 번 더 누르면 모달이 닫힌다.
export const InsideModal: Story = {
  args: { label: "모달 안", trigger: null, children: null },
  parameters: { docs: { story: { inline: false, iframeHeight: 520 } } },
  render: function Render() {
    const [modalOpen, setModalOpen] = useState(true);
    return (
      <>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          모달 열기
        </Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          header="방송 예약"
          style={{ width: 360 }}
        >
          <Popover
            label="날짜 선택"
            trigger={({ open, toggle, anchorRef }) => (
              <Input
                readOnly
                label="시작일"
                placeholder="날짜 선택"
                fieldRef={anchorRef}
                onClick={toggle}
                aria-expanded={open}
                rightAddon={<CalendarIcon />}
              />
            )}
          >
            <span style={{ fontSize: 13 }}>Esc를 누르면 이 팝오버만 닫혀요.</span>
          </Popover>
        </Modal>
      </>
    );
  },
};
