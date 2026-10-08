import { useState } from "react";
import type { FormEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Input, Modal, Select } from "@fds/core";
import type { SelectOption } from "@fds/core";

// 어드민 목록 필터의 "전체" 옵션은 값이 빈 문자열("")인 실제 옵션이다 (placeholder가 아님).
const statusOptions: SelectOption[] = [
  { value: "", label: "전체" },
  { value: "pending", label: "접수대기" },
  { value: "reviewing", label: "검토중" },
  { value: "done", label: "처리완료" },
  { value: "rejected", label: "반려" },
];

const typeOptions: SelectOption[] = [
  { value: "", label: "전체" },
  { value: "event", label: "이벤트" },
  { value: "airdrop", label: "에어드랍" },
  { value: "notice", label: "공지" },
];

const roleOptions: SelectOption[] = [
  { value: "super", label: "슈퍼관리자" },
  { value: "operator", label: "운영자" },
  { value: "viewer", label: "조회 전용" },
];

// 타입어헤드 확인용: "서"를 누르면 서산, "서울"을 이어서 누르면 서울로 이동한다.
const cityOptions: SelectOption[] = [
  "가평",
  "강릉",
  "거제",
  "경주",
  "구미",
  "군산",
  "김해",
  "대구",
  "대전",
  "목포",
  "부산",
  "서산",
  "서울",
  "속초",
  "수원",
  "순천",
  "안동",
  "여수",
  "울산",
  "원주",
  "인천",
  "전주",
  "제주",
  "천안",
  "청주",
  "춘천",
  "충주",
  "통영",
  "평택",
  "포항",
  "하남",
  "화성",
].map((city) => ({ value: city, label: city }));

const meta = {
  title: "Components/Common/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    // 목록이 position: absolute로 열리므로 Docs에서는 iframe 안에서 렌더링해 잘리지 않게 한다
    docs: { story: { inline: false, iframeHeight: 420 } },
  },
  argTypes: {
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    required: { control: "boolean" },
    placeholder: { control: "text" },
    maxMenuHeight: { control: "number" },
    onChange: { control: false },
    options: { control: false },
  },
  args: {
    options: statusOptions,
    placeholder: "상태 선택",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// "전체"(값 "")가 선택된 상태는 placeholder가 아니라 "전체"로 보인다
export const WithValue: Story = {
  args: { defaultValue: "" },
};

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | null>("reviewing");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Select {...args} value={value} onChange={setValue} />
        <span style={{ fontSize: 13 }}>선택값: {JSON.stringify(value)}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="line" onClick={() => setValue(null)}>
            선택 해제
          </Button>
          <Button variant="line" onClick={() => setValue("")}>
            전체로
          </Button>
        </div>
      </div>
    );
  },
};

// 목록 화면의 필터 한 줄: 상태/유형 Select + 검색어 + 조회/초기화
export const FilterBar: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 720 }}>
        <Story />
      </div>
    ),
  ],
  render: function Render() {
    const initial = { status: "", type: "", keyword: "" };
    const [draft, setDraft] = useState(initial);
    const [applied, setApplied] = useState(initial);

    return (
      <form
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          setApplied(draft);
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
          <div style={{ width: 160, display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="filter-status" style={{ fontSize: 14, fontWeight: 600 }}>
              상태
            </label>
            <Select
              id="filter-status"
              options={statusOptions}
              value={draft.status}
              onChange={(status) => setDraft((prev) => ({ ...prev, status }))}
            />
          </div>
          <div style={{ width: 160, display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="filter-type" style={{ fontSize: 14, fontWeight: 600 }}>
              유형
            </label>
            <Select
              id="filter-type"
              options={typeOptions}
              value={draft.type}
              onChange={(type) => setDraft((prev) => ({ ...prev, type }))}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Input
              label="검색어"
              placeholder="제목으로 검색"
              value={draft.keyword}
              onChange={(event) => setDraft((prev) => ({ ...prev, keyword: event.target.value }))}
            />
          </div>
          <Button type="submit" variant="primary">
            조회
          </Button>
          <Button
            variant="line"
            onClick={() => {
              setDraft(initial);
              setApplied(initial);
            }}
          >
            초기화
          </Button>
        </div>
        <pre
          style={{ margin: 0, padding: 12, background: "#f2f4f6", borderRadius: 8, fontSize: 12 }}
        >
          {`적용된 조건: ${JSON.stringify(applied)}`}
        </pre>
      </form>
    );
  },
};

// 폼: name으로 FormData에 담기고, 비어 있으면 invalid 상태가 된다
export const InForm: Story = {
  render: function Render() {
    const [submitted, setSubmitted] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);

    return (
      <form
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
          if (role === null) {
            setResult(null);
            return;
          }
          const data = new FormData(event.currentTarget);
          setResult(JSON.stringify(Object.fromEntries(data.entries())));
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label htmlFor="role" style={{ fontSize: 14, fontWeight: 600 }}>
            역할{" "}
            <span aria-hidden="true" style={{ color: "#f04438" }}>
              *
            </span>
          </label>
          <Select
            id="role"
            name="role"
            required
            options={roleOptions}
            value={role}
            onChange={setRole}
            placeholder="역할을 선택하세요"
            invalid={submitted && role === null}
            aria-describedby={submitted && role === null ? "role-error" : undefined}
          />
          {submitted && role === null && (
            <p id="role-error" role="alert" style={{ margin: 0, fontSize: 11, color: "#f04438" }}>
              역할을 선택해 주세요.
            </p>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label htmlFor="status" style={{ fontSize: 14, fontWeight: 600 }}>
            상태
          </label>
          <Select id="status" name="status" options={statusOptions} defaultValue="" />
        </div>
        <Button type="submit" variant="primary">
          저장
        </Button>
        {result && (
          <pre
            style={{ margin: 0, padding: 12, background: "#f2f4f6", borderRadius: 8, fontSize: 12 }}
          >
            {`FormData: ${result}`}
          </pre>
        )}
      </form>
    );
  },
};

export const DisabledAndDisabledOption: Story = {
  render: function Render() {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12 }}>전체 비활성</span>
          <Select options={statusOptions} defaultValue="pending" disabled />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12 }}>일부 옵션 비활성 (방향키로 건너뛰고 클릭도 안 됨)</span>
          <Select
            options={[
              { value: "", label: "전체" },
              { value: "pending", label: "접수대기" },
              { value: "reviewing", label: "검토중", disabled: true },
              { value: "done", label: "처리완료" },
              { value: "rejected", label: "반려", disabled: true },
            ]}
            defaultValue=""
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12 }}>invalid</span>
          <Select options={roleOptions} placeholder="역할 선택" invalid />
        </div>
      </div>
    );
  },
};

// 32개 항목: 목록 안에서 스크롤되고, 글자를 입력하면 해당 항목으로 이동한다
export const LongListWithTypeahead: Story = {
  args: { options: cityOptions, placeholder: "지역 선택", defaultValue: "청주" },
  render: function Render(args) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Select {...args} />
        <span style={{ fontSize: 12, color: "#5c646f" }}>
          열린 상태에서 글자를 입력해 보세요. “서”는 서산, 이어서 “울”은 서울로 이동합니다.
          Home/End, 방향키도 됩니다.
        </span>
      </div>
    );
  },
};

// 모달 안에서도 열린다. Esc는 목록을 먼저 닫고, 한 번 더 누르면 모달이 닫힌다.
// Popover는 포털이 아니라 모달 본문 안에서 열리므로, 목록이 들어갈 공간(minHeight)이 필요하다.
export const InModal: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>("");

    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          회원 등록
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          header="회원 등록"
          style={{ width: 360, minHeight: 420 }}
          actions={
            <>
              <Button variant="line" onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                등록
              </Button>
            </>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="modal-role" style={{ fontSize: 14, fontWeight: 600 }}>
              역할
            </label>
            <Select
              id="modal-role"
              options={roleOptions}
              value={role}
              onChange={setRole}
              placeholder="역할을 선택하세요"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="modal-status" style={{ fontSize: 14, fontWeight: 600 }}>
              상태
            </label>
            <Select id="modal-status" options={statusOptions} value={status} onChange={setStatus} />
          </div>
        </Modal>
      </>
    );
  },
};
