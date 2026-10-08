import { useState } from "react";
import type { FormEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Calendar,
  CalendarIcon,
  DateTimePicker,
  Input,
  Modal,
  OverlayProvider,
  Popover,
  TimePanel,
  formatDateTimeValue,
  parseDateTimeValue,
  useOverlay,
} from "@fds/core";

// useOverlay의 render 함수는 열 때의 클로저를 쓰므로, 모달 안에서 고르는 중인 값(draft)은
// 상태를 가진 컴포넌트가 들고 있어야 한다. 이 스토리 안에서만 쓰는 비공개 헬퍼다.
function PickerModalBody({
  initial,
  onConfirm,
}: {
  initial: string | null;
  onConfirm: (value: string) => void;
}) {
  const parsed = initial ? parseDateTimeValue(initial) : null;
  const [date, setDate] = useState<string | null>(parsed?.date ?? null);
  const [time, setTime] = useState<string | null>(parsed?.time ?? null);

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Calendar
          autoFocus
          value={date}
          onChange={setDate}
          initialMonth={parsed?.date.slice(0, 7)}
        />
        <TimePanel value={time} onChange={setTime} />
      </div>
      <Button
        variant="primary"
        disabled={!date || !time}
        onClick={() => date && time && onConfirm(formatDateTimeValue(date, time))}
      >
        확인
      </Button>
    </>
  );
}

// DateTimePicker = 읽기 전용 입력창 + 달력 아이콘 버튼 + 아래에 뜨는 팝업(Calendar + TimePanel + 확인)의 조합이다.
// 값은 `YYYY-MM-DDTHH:mm` 문자열(로컬 시간, 시간대 없음)이고, 입력창에는 `2026-10-15 09:30`으로 보인다.
// 날짜와 시간을 둘 다 고르고 "확인"을 눌러야 값이 확정된다.
const meta = {
  title: "Components/Common/DateTimePicker",
  component: DateTimePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    // 팝업이 열리는 컴포넌트라 Docs에서는 iframe 안에서 렌더링한다
    docs: { story: { inline: false, iframeHeight: 560 } },
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    error: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    minuteStep: { control: "number" },
    value: { control: false },
    defaultValue: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
    isDateDisabled: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360, height: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// defaultValue로 초기 날짜·시간을 넣는다 (비제어)
export const WithValue: Story = {
  args: { defaultValue: "2026-10-15T09:30" },
};

// 값 상태를 부모가 들고 있는 제어 방식 폼. 제출하면 T 형식 문자열이 그대로 payload에 담긴다.
export const ControlledForm: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 780 } } },
  decorators: [
    (Story) => (
      <div style={{ width: 360, minHeight: 680 }}>
        <Story />
      </div>
    ),
  ],
  render: function Render() {
    const [title, setTitle] = useState("");
    const [publishAt, setPublishAt] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ title?: string; publishAt?: string }>({});
    const [payload, setPayload] = useState<string | null>(null);

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      const next = {
        title: title.trim() ? undefined : "공지 제목을 입력해 주세요.",
        publishAt: publishAt ? undefined : "발행 일시를 선택해 주세요.",
      };
      setErrors(next);
      setPayload(
        next.title || next.publishAt ? null : JSON.stringify({ title, publishAt }, null, 2),
      );
    };

    return (
      <form
        noValidate
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <Input
          label="공지 제목"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="공지 제목을 입력하세요"
          error={errors.title}
        />
        <DateTimePicker
          label="발행 일시"
          required
          value={publishAt}
          onChange={(next) => {
            setPublishAt(next);
            setErrors((prev) => ({ ...prev, publishAt: undefined }));
          }}
          minuteStep={5}
          description="발행 일시 이후에는 수정할 수 없어요."
          error={errors.publishAt}
        />
        <Button type="submit" variant="primary">
          예약하기
        </Button>
        {payload && (
          <pre
            data-testid="payload"
            style={{
              margin: 0,
              padding: 12,
              fontSize: 12,
              borderRadius: 8,
              background: "var(--fds-bg-page)",
              color: "var(--fds-text-primary)",
            }}
          >
            {payload}
          </pre>
        )}
      </form>
    );
  },
};

// 비제어 + name: 보이는 입력창은 `2026-10-15 09:30`이지만, 폼에는 숨은 input이 T 형식(`2026-10-15T09:30`)을 제출한다.
export const UncontrolledFormData: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 640 } } },
  decorators: [
    (Story) => (
      <div style={{ width: 360, minHeight: 560 }}>
        <Story />
      </div>
    ),
  ],
  render: function Render() {
    const [entries, setEntries] = useState<Record<string, string> | null>(null);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      setEntries(Object.fromEntries([...data.entries()].map(([k, v]) => [k, String(v)])));
    };

    return (
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <DateTimePicker label="시작 일시" name="startAt" defaultValue="2026-10-15T09:30" />
        <Button type="submit" variant="primary">
          제출
        </Button>
        {entries && (
          <pre
            data-testid="form-data"
            style={{
              margin: 0,
              padding: 12,
              fontSize: 12,
              borderRadius: 8,
              background: "var(--fds-bg-page)",
              color: "var(--fds-text-primary)",
            }}
          >
            {JSON.stringify(entries, null, 2)}
          </pre>
        )}
      </form>
    );
  },
};

// min/max는 날짜(YYYY-MM-DD)만 제한한다. 시각 제한은 지원하지 않는다.
export const MinMax: Story = {
  args: {
    label: "예약 일시",
    min: "2026-10-10",
    max: "2026-10-25",
    defaultValue: "2026-10-15T09:00",
    description: "10월 10일 ~ 25일 중에서 선택할 수 있어요.",
  },
};

export const Horizontal: Story = {
  args: { label: "시작 일시", orientation: "horizontal" },
};

export const WithError: Story = {
  args: {
    label: "시작 일시",
    required: true,
    error: "시작 일시를 선택해 주세요.",
  },
};

export const Disabled: Story = {
  args: { label: "시작 일시", disabled: true, defaultValue: "2026-10-15T09:30" },
};

// DateTimePicker는 아래 네 요소를 조합한 것뿐이다 (고르는 중인 값 draft + 확인 버튼 포함).
// 입력창, 팝오버, 패널을 직접 조합하면 트리거 모양이나 값 처리를 마음대로 바꿀 수 있다.
export const ManualComposition: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 560 } } },
  render: function Render() {
    const [value, setValue] = useState<string | null>(null);
    const [draft, setDraft] = useState<{ date: string | null; time: string | null }>({
      date: null,
      time: null,
    });
    const current = value ? parseDateTimeValue(value) : null;

    return (
      <Popover
        label="날짜와 시간 선택"
        onOpenChange={(open) =>
          open && setDraft({ date: current?.date ?? null, time: current?.time ?? null })
        }
        trigger={({ open, toggle, anchorRef }) => (
          <Input
            readOnly
            label="시작 일시"
            placeholder="날짜·시간 선택"
            value={current ? `${current.date} ${current.time}` : ""}
            fieldRef={anchorRef}
            onClick={toggle}
            aria-haspopup="dialog"
            aria-expanded={open}
            rightAddon={<CalendarIcon />}
          />
        )}
      >
        {({ close }) => (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <Calendar
                autoFocus
                value={draft.date}
                onChange={(date) => setDraft((prev) => ({ ...prev, date }))}
              />
              <TimePanel
                value={draft.time}
                onChange={(time) => setDraft((prev) => ({ ...prev, time }))}
              />
            </div>
            <Button
              variant="primary"
              disabled={!draft.date || !draft.time}
              onClick={() => {
                if (draft.date && draft.time) {
                  setValue(formatDateTimeValue(draft.date, draft.time));
                  close();
                }
              }}
            >
              확인
            </Button>
          </div>
        )}
      </Popover>
    );
  },
};

// 입력창 대신 원하는 트리거(버튼 등)를 쓰고 싶다면, Calendar와 TimePanel을 useOverlay로 모달에 띄워 값을 await로 받는다.
export const WithOverlayModal: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 560 } } },
  decorators: [
    (Story) => (
      <OverlayProvider>
        <div style={{ width: 360, minHeight: 200 }}>
          <Story />
        </div>
      </OverlayProvider>
    ),
  ],
  render: function Render() {
    const overlay = useOverlay();
    const [value, setValue] = useState<string | null>(null);

    const pick = async () => {
      const picked = await overlay.openAsync<string>(({ isOpen, close }) => (
        <Modal
          open={isOpen}
          onClose={() => close()}
          header="날짜와 시간 선택"
          style={{ width: "min(560px, calc(100vw - 32px))" }}
        >
          <PickerModalBody initial={value} onConfirm={close} />
        </Modal>
      ));
      if (picked) {
        setValue(picked);
      }
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
        <Button variant="line" onClick={pick}>
          일시 선택 · {value ?? "선택 안 함"}
        </Button>
        <div style={{ fontSize: 13 }} data-testid="picked">
          선택한 일시: <strong>{value ?? "없음"}</strong>
        </div>
      </div>
    );
  },
};
