import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Input, RadioGroup, Textarea } from "@fds/core";

// 상호배타 선택 입력. 값은 `string`이고, 선택이 "바뀔 때만" onChange가 호출된다.
// 방향키 이동, Tab 처리, 폼 제출은 브라우저의 네이티브 radio가 맡는다.
const meta = {
  title: "Components/Common/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    required: { control: "boolean" },
    options: { control: false },
    onChange: { control: false },
  },
  args: {
    options: [
      { value: "published", label: "게시" },
      { value: "unpublished", label: "미게시" },
    ],
    "aria-label": "게시 상태",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const preStyle = {
  margin: "16px 0 0",
  padding: 12,
  borderRadius: 8,
  background: "var(--fds-bg-page)",
  color: "var(--fds-text-primary)",
  fontSize: 12,
} as const;

// 게시/미게시 — 세로 배치(기본)
export const Default: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | null>("published");
    return <RadioGroup {...args} value={value} onChange={setValue} />;
  },
};

// 제어 모드: `value`만 주고 `onChange`로 갱신하지 않으면 선택이 바뀌지 않는다 (값은 항상 부모가 정한다)
export const FixedValue: Story = {
  args: { value: "published", onChange: () => {} },
};

// 노출/숨김 — 와이어프레임처럼 한 줄로 나열
export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    options: [
      { value: "visible", label: "노출" },
      { value: "hidden", label: "숨김" },
    ],
    "aria-label": "노출 여부",
  },
  render: function Render(args) {
    const [value, setValue] = useState<string | null>("visible");
    return <RadioGroup {...args} value={value} onChange={setValue} />;
  },
};

// 옵션마다 설명을 붙일 수 있다
export const WithDescription: Story = {
  args: {
    options: [
      { value: "internal", label: "내부 신청", description: "서비스 안의 신청 폼으로 받아요." },
      { value: "external", label: "외부 링크", description: "다른 사이트로 연결해요." },
      { value: "google", label: "Google Form", description: "구글 폼 링크로 연결해요." },
    ],
    "aria-label": "신청 방식",
  },
  render: function Render(args) {
    const [value, setValue] = useState<string | null>("internal");
    return <RadioGroup {...args} value={value} onChange={setValue} />;
  },
};

// 일부 옵션만 비활성: 클릭도, 방향키 이동도 건너뛴다
export const DisabledOption: Story = {
  args: {
    options: [
      { value: "none", label: "조치 없음" },
      { value: "warn", label: "경고" },
      { value: "suspend", label: "이용정지", disabled: true },
    ],
    "aria-label": "회원 조치",
  },
  render: function Render(args) {
    const [value, setValue] = useState<string | null>("none");
    return <RadioGroup {...args} value={value} onChange={setValue} />;
  },
};

// 저장했는데 선택이 없으면 에러 상태로 바꾼다 (invalid + 에러 문구는 앱이 그린다)
export const Invalid: Story = {
  args: {
    required: true,
    options: [
      { value: "keep", label: "콘텐츠 유지" },
      { value: "hide", label: "콘텐츠 숨김" },
      { value: "delete", label: "콘텐츠 삭제" },
    ],
    "aria-label": "콘텐츠 조치",
  },
  render: function Render(args) {
    const [value, setValue] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const invalid = submitted && value === null;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
        <RadioGroup
          {...args}
          value={value}
          onChange={setValue}
          invalid={invalid}
          aria-describedby="radio-invalid-message"
        />
        {invalid && (
          <p
            id="radio-invalid-message"
            role="alert"
            style={{ margin: 0, fontSize: 11, color: "var(--fds-brand-error)" }}
          >
            조치를 선택해 주세요.
          </p>
        )}
        <Button variant="primary" onClick={() => setSubmitted(true)}>
          저장
        </Button>
      </div>
    );
  },
};

// 선택한 방식에 따라 다른 입력이 켜진다. 다른 방식으로 바꾸면 이전 입력은 비운다.
export const ConditionalField: Story = {
  args: {
    options: [
      { value: "internal", label: "내부 신청" },
      { value: "external", label: "외부 링크" },
      { value: "google", label: "Google Form" },
    ],
    "aria-label": "신청 방식",
  },
  render: function Render(args) {
    const [method, setMethod] = useState<string | null>("internal");
    const [externalUrl, setExternalUrl] = useState("");
    const [formUrl, setFormUrl] = useState("");

    const handleChange = (next: string) => {
      setMethod(next);
      if (next !== "external") setExternalUrl("");
      if (next !== "google") setFormUrl("");
    };

    const payload = {
      method,
      ...(method === "external" ? { url: externalUrl } : {}),
      ...(method === "google" ? { formUrl } : {}),
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <RadioGroup {...args} value={method} onChange={handleChange} />
        <Input
          label="외부 링크 URL"
          placeholder="https://"
          disabled={method !== "external"}
          value={externalUrl}
          onChange={(event) => setExternalUrl(event.target.value)}
        />
        <Input
          label="Google Form 링크"
          placeholder="https://forms.gle/"
          disabled={method !== "google"}
          value={formUrl}
          onChange={(event) => setFormUrl(event.target.value)}
        />
        <pre style={preStyle}>{JSON.stringify(payload, null, 2)}</pre>
      </div>
    );
  },
};

// 승인/반려/확인중 — 반려를 고르면 사유가 필수가 되고, 사유가 비어 있으면 처리 버튼이 비활성이다.
export const ReviewDecision: Story = {
  args: {
    options: [
      { value: "pending", label: "확인중" },
      { value: "approved", label: "승인" },
      { value: "rejected", label: "반려" },
    ],
    orientation: "horizontal",
    "aria-label": "검수 결과",
  },
  render: function Render(args) {
    const [decision, setDecision] = useState<string | null>("pending");
    const [reason, setReason] = useState("");
    const [result, setResult] = useState("아직 처리 안 함");

    const rejected = decision === "rejected";
    const canSubmit = decision !== "pending" && (!rejected || reason.trim().length > 0);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <RadioGroup {...args} value={decision} onChange={setDecision} />
        {rejected && (
          <Textarea
            value={reason}
            onChange={setReason}
            placeholder="반려 사유를 입력해 주세요 (필수)"
            showCount
            maxLength={200}
          />
        )}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button
            variant={rejected ? "danger" : "primary"}
            disabled={!canSubmit}
            onClick={() => setResult(rejected ? `반려: ${reason.trim()}` : `승인`)}
          >
            처리
          </Button>
          <span style={{ fontSize: 12 }}>결과: {result}</span>
        </div>
      </div>
    );
  },
};

// name을 주면 FormData에 그 이름으로 제출된다 (비제어: defaultValue만 사용)
export const InFormData: Story = {
  args: {
    name: "decision",
    defaultValue: "visible",
    options: [
      { value: "visible", label: "노출" },
      { value: "hidden", label: "숨김" },
    ],
    "aria-label": "노출 여부",
  },
  render: function Render(args) {
    const [output, setOutput] = useState("제출 전");
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setOutput(JSON.stringify(Object.fromEntries(data.entries()), null, 2));
        }}
      >
        <RadioGroup {...args} />
        <div style={{ marginTop: 12 }}>
          <Button type="submit" variant="primary">
            제출
          </Button>
        </div>
        <pre style={preStyle}>{output}</pre>
      </form>
    );
  },
};
