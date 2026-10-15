import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, type BadgeVariant } from "@fds/core";

const meta = {
  title: "Components/Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
    variant: {
      control: "select",
      options: ["neutral", "info", "success", "warning", "danger", "purple"],
    },
  },
  args: {
    children: "전체방송",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// 6가지 variant. 색은 시맨틱 토큰이라 다크 모드에서는 값만 바뀐다.
export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      <Badge variant="neutral">접수대기</Badge>
      <Badge variant="info">검토중</Badge>
      <Badge variant="success">정상</Badge>
      <Badge variant="warning">확정 필요</Badge>
      <Badge variant="danger">반려</Badge>
      <Badge variant="purple">검증</Badge>
    </div>
  ),
};

// 어드민에서 반복되는 상태 어휘와 권장 variant (기획서 와이어프레임 기준)
const statusRows: { group: string; items: { label: string; variant: BadgeVariant }[] }[] = [
  {
    group: "처리 상태",
    items: [
      { label: "접수대기", variant: "neutral" },
      { label: "검토중", variant: "info" },
      { label: "처리완료", variant: "success" },
      { label: "반려", variant: "danger" },
    ],
  },
  {
    group: "연동 상태",
    items: [
      { label: "NORMAL", variant: "success" },
      { label: "DELAY", variant: "warning" },
      { label: "ERROR", variant: "danger" },
      { label: "MAINT.", variant: "neutral" },
    ],
  },
  {
    group: "노출 여부",
    items: [
      { label: "노출", variant: "success" },
      { label: "미노출", variant: "neutral" },
      { label: "공개", variant: "success" },
      { label: "숨김", variant: "neutral" },
    ],
  },
  {
    group: "승인",
    items: [
      { label: "승인", variant: "success" },
      { label: "확인중", variant: "warning" },
      { label: "반려", variant: "danger" },
      { label: "VALID", variant: "purple" },
    ],
  },
];

export const StatusVocabulary: Story = {
  render: () => (
    <table style={{ borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: "6px 16px 6px 0", fontWeight: 600 }}>구분</th>
          <th style={{ textAlign: "left", padding: "6px 0", fontWeight: 600 }}>상태</th>
        </tr>
      </thead>
      <tbody>
        {statusRows.map((row) => (
          <tr key={row.group} style={{ borderTop: "1px solid var(--fds-border-line)" }}>
            <td style={{ padding: "10px 16px 10px 0" }}>{row.group}</td>
            <td style={{ padding: "10px 0" }}>
              <span style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {row.items.map((item) => (
                  <Badge key={item.label} variant={item.variant}>
                    {item.label}
                  </Badge>
                ))}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

// sm · md(기본) · lg · xl
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <Badge key={size} {...args} size={size} />
      ))}
    </div>
  ),
};
