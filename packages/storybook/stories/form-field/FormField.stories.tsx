import { useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, CheckboxGroup, FormField, Input, RadioGroup, Select, Textarea } from "@fds/core";

// Input · Select · Textarea · CheckboxGroup · RadioGroup은 라벨·설명·에러를 props로 이미 가지고 있다.
// FormField는 FDS에 없는 컨트롤(파일 선택, 색상 선택, 서드파티 위젯 등)에 같은 레이아웃을 입히는 래퍼다.
const meta = {
  title: "Components/Common/FormField",
  component: FormField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    labelMode: { control: "inline-radio", options: ["for", "group"] },
    children: { control: false },
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

// children을 함수로 주면 id / aria-describedby / aria-invalid를 받아 컨트롤에 그대로 붙일 수 있다.
export const WrappingCustomControl: Story = {
  args: { children: null },
  render: function Render() {
    const [fileName, setFileName] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    return (
      <form
        style={{ width: 360, display: "flex", flexDirection: "column", gap: 12 }}
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <FormField
          label="대표 이미지"
          required
          description="JPG, PNG, WebP · 최대 10MB"
          error={submitted && !fileName ? "이미지를 선택해 주세요." : undefined}
        >
          {(control) => (
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              {...control}
              onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
            />
          )}
        </FormField>
        <Button type="submit" variant="primary">
          저장
        </Button>
        <span style={{ fontSize: 13 }}>선택한 파일: {fileName ?? "없음"}</span>
      </form>
    );
  },
};

// 라벨을 왼쪽에 놓고, 컨트롤이 이미 자기 id를 가졌다면 `htmlFor`로 알려 준다.
export const WithOwnId: Story = {
  args: { children: null },
  render: function Render() {
    const [color, setColor] = useState("#3182f6");
    return (
      <div style={{ width: 360 }}>
        <FormField label="대표 색상" orientation="horizontal" htmlFor="brand-color">
          <input
            id="brand-color"
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          />
        </FormField>
      </div>
    );
  },
};

// 이벤트 등록 폼. 모든 컨트롤에 같은 `orientation`/`labelWidth`를 주면 라벨과 필드의 왼쪽 선이 모두 맞는다.
// 빈 채로 저장하면 필드마다 `error`가 켜지고 첫 번째 오류 컨트롤로 포커스가 이동한다.
export const AdminForm: Story = {
  args: { children: null },
  parameters: { docs: { story: { inline: false, iframeHeight: 720 } } },
  render: function Render() {
    const labelWidth = 96;
    const [title, setTitle] = useState("");
    const [type, setType] = useState<string | null>(null);
    const [method, setMethod] = useState<string | null>(null);
    const [detail, setDetail] = useState("");
    const [channels, setChannels] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [payload, setPayload] = useState<string | null>(null);

    const titleRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLButtonElement>(null);
    const methodRef = useRef<HTMLDivElement>(null);
    const detailRef = useRef<HTMLTextAreaElement>(null);
    const channelsRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      const next: Record<string, string> = {};
      if (title.trim() === "") next.title = "이벤트명을 입력해 주세요.";
      if (type === null) next.type = "유형을 선택해 주세요.";
      if (method === null) next.method = "신청 방식을 선택해 주세요.";
      if (detail.trim() === "") next.detail = "상세 설명을 입력해 주세요.";
      if (channels.length === 0) next.channels = "채널을 하나 이상 선택해 주세요.";
      setErrors(next);

      if (Object.keys(next).length > 0) {
        setPayload(null);
        // 첫 번째 오류 컨트롤로 포커스를 옮긴다 (화면 순서대로)
        if (next.title) titleRef.current?.focus();
        else if (next.type) typeRef.current?.focus();
        else if (next.method) methodRef.current?.querySelector("input")?.focus();
        else if (next.detail) detailRef.current?.focus();
        else channelsRef.current?.querySelector("input")?.focus();
        return;
      }
      setPayload(JSON.stringify({ title, type, method, detail, channels }, null, 2));
    };

    return (
      <form
        noValidate
        onSubmit={handleSubmit}
        style={{ width: 520, display: "flex", flexDirection: "column", gap: 20 }}
      >
        <Input
          ref={titleRef}
          label="이벤트명"
          required
          orientation="horizontal"
          labelWidth={labelWidth}
          placeholder="이벤트명을 입력하세요"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={errors.title}
        />
        <Select
          ref={typeRef}
          label="유형"
          required
          orientation="horizontal"
          labelWidth={labelWidth}
          placeholder="유형을 선택하세요"
          options={[
            { value: "airdrop", label: "에어드랍" },
            { value: "listing", label: "상장" },
            { value: "offline", label: "오프라인 행사" },
          ]}
          value={type}
          onChange={setType}
          error={errors.type}
        />
        <RadioGroup
          ref={methodRef}
          label="신청 방식"
          required
          orientation="horizontal"
          labelWidth={labelWidth}
          direction="horizontal"
          options={[
            { value: "internal", label: "내부 신청" },
            { value: "external", label: "외부 링크" },
            { value: "google", label: "Google Form" },
          ]}
          value={method}
          onChange={setMethod}
          error={errors.method}
        />
        <Textarea
          ref={detailRef}
          label="상세 설명"
          required
          orientation="horizontal"
          labelWidth={labelWidth}
          description="이벤트 상세 화면에 그대로 노출돼요."
          showCount
          maxLength={200}
          placeholder="내용을 입력하세요"
          value={detail}
          onChange={setDetail}
          error={errors.detail}
        />
        <CheckboxGroup
          ref={channelsRef}
          label="채널 속성"
          required
          orientation="horizontal"
          labelWidth={labelWidth}
          direction="horizontal"
          options={[
            { value: "partner", label: "파트너" },
            { value: "trader", label: "트레이더" },
            { value: "media", label: "미디어" },
          ]}
          value={channels}
          onChange={setChannels}
          error={errors.channels}
        />
        <div style={{ paddingLeft: labelWidth + 12 }}>
          <Button type="submit" variant="primary">
            저장
          </Button>
        </div>
        {payload && (
          <pre
            style={{ margin: 0, padding: 12, background: "#f2f4f6", borderRadius: 8, fontSize: 12 }}
          >
            {payload}
          </pre>
        )}
      </form>
    );
  },
};
