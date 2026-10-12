import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileUpload } from "@fds/core";

// FileUpload는 서버로 올리지 않는다. 형식·크기·개수를 검사해서 통과한 파일만 목록에 넣고, 업로드는 앱이 한다.
// 통과하지 못한 파일은 안내만 띄우므로 이미 올린 파일(교체 대상)은 그대로 남는다.
const meta = {
  title: "Components/Form/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
    hint: { control: "text" },
    accept: { control: "text" },
    maxSize: { control: "number" },
    maxFiles: { control: "number" },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    preview: { control: "boolean" },
    value: { control: false },
    defaultValue: { control: false },
    onChange: { control: false },
    onReject: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: "첨부 파일" } };

// accept / maxSize로 안내 문구가 자동으로 만들어진다 ("JPG, PNG, WebP · 최대 10MB")
export const ImageOnly: Story = {
  args: {
    label: "대표 이미지",
    required: true,
    accept: "image/jpeg,image/png,image/webp",
    maxSize: 10 * 1024 * 1024,
  },
};

// 단일(maxFiles=1)은 새 파일이 기존 파일을 교체한다. 형식·크기가 맞지 않으면 기존 파일이 유지된다.
export const Replace: Story = {
  args: {
    label: "썸네일",
    accept: "image/*",
    maxSize: 2 * 1024 * 1024,
    defaultValue: [new File(["demo"], "thumbnail.png", { type: "image/png" })],
  },
};

// maxFiles가 2 이상이면 추가되고, 가득 차면 더 받지 않는다
export const Multiple: Story = {
  args: { label: "첨부 파일", maxFiles: 3, maxSize: 5 * 1024 * 1024, description: "최대 3개" },
};

export const Horizontal: Story = {
  args: { label: "대표 이미지", orientation: "horizontal", accept: "image/*" },
};

// error를 주면 기본 안내 대신 이 문구가 나온다
export const WithError: Story = {
  args: { label: "대표 이미지", required: true, error: "대표 이미지를 등록해 주세요." },
};

export const Disabled: Story = { args: { label: "첨부 파일", disabled: true } };

// ---- 실제 사용 예 -----------------------------------------------------------------------

// 제어 모드: files를 state가 들고, 받지 못한 파일은 onReject로 알 수 있다.
export const Controlled: Story = {
  render: function Render() {
    const [files, setFiles] = useState<File[]>([]);
    const [rejected, setRejected] = useState<string[]>([]);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <FileUpload
          label="증빙 서류"
          accept=".pdf,image/png,image/jpeg"
          maxSize={5 * 1024 * 1024}
          maxFiles={3}
          value={files}
          onChange={(next) => {
            setFiles(next);
            setRejected([]);
          }}
          onReject={(rejections) =>
            setRejected(rejections.map(({ file, reason }) => `${file.name} (${reason})`))
          }
        />
        <div style={{ fontSize: 12 }}>
          <div>올릴 파일: {files.map((file) => file.name).join(", ") || "없음"}</div>
          {rejected.length > 0 && <div>받지 못한 파일: {rejected.join(", ")}</div>}
        </div>
      </div>
    );
  },
};
