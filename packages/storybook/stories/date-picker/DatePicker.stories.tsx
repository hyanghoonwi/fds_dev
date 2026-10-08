import { useState } from "react";
import type { FormEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Calendar,
  DatePicker,
  Input,
  Modal,
  OverlayProvider,
  Popover,
  CalendarIcon,
  TimePicker,
  formatDateValue,
  parseDateValue,
  useOverlay,
} from "@fds/core";

// DatePicker = 읽기 전용 입력창 + 달력 아이콘 버튼 + 아래에 뜨는 팝업(Calendar)의 조합이다.
// 값은 `YYYY-MM-DD` 문자열이며, 입력창에도 그 문자열이 그대로 들어간다.
const meta = {
  title: "Components/Common/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    // iframe(inline: false)은 아래 Props 표의 컨트롤 변경이 반영되지 않아, 인라인으로 렌더링하고 팝업이 들어갈 높이를 확보한다.
    docs: { story: { height: "420px" } },
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    error: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    value: { control: false },
    defaultValue: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
    isDateDisabled: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360, height: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// defaultValue로 초기 날짜를 넣는다 (비제어)
export const WithValue: Story = {
  args: { defaultValue: "2026-10-06" },
};

export const WithLabelRequired: Story = {
  args: { label: "시작일", required: true },
};

export const WithError: Story = {
  args: { label: "시작일", required: true, error: "시작일을 선택해 주세요." },
};

export const Horizontal: Story = {
  args: { label: "시작일", orientation: "horizontal", defaultValue: "2026-10-06" },
};

// min/max(포함) 밖의 날짜는 선택할 수 없고, 범위 밖으로 가는 달 이동 버튼은 비활성화된다
export const MinMax: Story = {
  args: {
    label: "예약일",
    defaultValue: "2026-10-15",
    min: "2026-10-10",
    max: "2026-10-25",
  },
};

// isDateDisabled로 주말을 막는다
export const DisabledDates: Story = {
  args: {
    label: "영업일",
    defaultValue: "2026-10-06",
    isDateDisabled: (date) => date.getDay() === 0 || date.getDay() === 6,
  },
};

export const Disabled: Story = {
  args: { label: "시작일", disabled: true, defaultValue: "2026-10-06" },
};

// ---- 실제 사용 예 -----------------------------------------------------------------------

// 제어 방식 폼: 값은 부모의 state가 들고 있고, 검증은 값이 비었는지로 한다.
// 서버에 보내는 payload가 그대로 `{ date: "2026-10-15", time: "09:30" }`처럼 문자열이다.
export const ControlledForm: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 760 } } },
  decorators: [
    (Story) => (
      <div style={{ width: 360, minHeight: 640 }}>
        <Story />
      </div>
    ),
  ],
  render: function Render() {
    const today = formatDateValue(new Date());
    const [title, setTitle] = useState("");
    const [date, setDate] = useState<string | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ title?: string; date?: string; time?: string }>({});
    const [payload, setPayload] = useState<string | null>(null);

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      const next = {
        title: title.trim() ? undefined : "방송 제목을 입력해 주세요.",
        date: date ? undefined : "방송 날짜를 선택해 주세요.",
        time: time ? undefined : "시작 시간을 선택해 주세요.",
      };
      setErrors(next);
      setPayload(
        next.title || next.date || next.time
          ? null
          : JSON.stringify({ title, date, time }, null, 2),
      );
    };

    return (
      <form
        noValidate
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <Input
          label="방송 제목"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="방송 제목을 입력하세요"
          error={errors.title}
        />
        <DatePicker
          label="방송 날짜"
          required
          value={date}
          onChange={(next) => {
            setDate(next);
            setErrors((prev) => ({ ...prev, date: undefined }));
          }}
          min={today}
          description="오늘 이후 날짜만 선택할 수 있어요."
          error={errors.date}
        />
        <TimePicker
          label="시작 시간"
          required
          value={time}
          onChange={(next) => {
            setTime(next);
            setErrors((prev) => ({ ...prev, time: undefined }));
          }}
          error={errors.time}
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

// 기간 선택: 종료일은 시작일 이후만, 시작일은 종료일 이전만 고를 수 있게 서로의 min/max로 묶는다.
export const DateRange: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 560 } } },
  decorators: [
    (Story) => (
      <div style={{ width: 360, minHeight: 480 }}>
        <Story />
      </div>
    ),
  ],
  render: function Render() {
    const [start, setStart] = useState<string | null>("2026-10-06");
    const [end, setEnd] = useState<string | null>(null);

    // 값이 어긋난 채로 들어오는 경우(예: 프로그램에서 시작일을 바꿈)를 대비해 종료일을 정리한다
    const handleStart = (next: string) => {
      setStart(next);
      if (end && end < next) {
        setEnd(null);
      }
    };

    const startDate = start ? parseDateValue(start) : null;
    const endDate = end ? parseDateValue(end) : null;
    const nights =
      startDate && endDate
        ? Math.round((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
        : null;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <DatePicker label="시작일" value={start} onChange={handleStart} max={end ?? undefined} />
        <DatePicker
          label="종료일"
          value={end}
          onChange={setEnd}
          min={start ?? undefined}
          placeholder="종료일 선택"
        />
        <div style={{ fontSize: 13 }} data-testid="range-summary">
          {nights === null ? (
            "시작일과 종료일을 모두 선택해 주세요."
          ) : (
            <>
              {start} ~ {end} ·{" "}
              <strong>
                {nights}박 {nights + 1}일
              </strong>
            </>
          )}
        </div>
      </div>
    );
  },
};

// 비제어 + 폼 제출: `name`을 주면 입력창이 `YYYY-MM-DD` / `HH:mm` 문자열로 FormData에 들어간다.
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
        <DatePicker label="시작일" name="startDate" defaultValue="2026-10-08" />
        <TimePicker label="시작 시간" name="startTime" defaultValue="09:00" />
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

// DatePicker가 하는 일을 직접 조합한 모습: Input + Popover + Calendar.
// Input의 `fieldRef`에 Popover의 `anchorRef`를 넘기면 팝업이 입력창 바로 아래에 붙는다.
// 위의 DatePicker들은 이 조합을 미리 해 둔 편의 컴포넌트다. (`name`/`required`/`error` 같은 Input의 props도 그대로 쓸 수 있다)
export const ManualComposition: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 480 } } },
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

// 입력창 대신 원하는 트리거(버튼 등)를 쓰고 싶다면, Calendar를 useOverlay로 모달에 띄워 값을 await로 받는다.
export const WithOverlayModal: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 480 } } },
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
    const [date, setDate] = useState<string | null>(null);

    const pickDate = async () => {
      const picked = await overlay.openAsync<string>(({ isOpen, close }) => (
        <Modal open={isOpen} onClose={() => close()} header="날짜 선택" style={{ width: 320 }}>
          <Calendar autoFocus value={date} onChange={(next) => close(next)} />
        </Modal>
      ));
      if (picked) {
        setDate(picked);
      }
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
        <Button variant="line" onClick={pickDate}>
          날짜 선택 · {date ?? "선택 안 함"}
        </Button>
        <div style={{ fontSize: 13 }} data-testid="picked">
          선택한 날짜: <strong>{date ?? "없음"}</strong>
        </div>
      </div>
    );
  },
};
