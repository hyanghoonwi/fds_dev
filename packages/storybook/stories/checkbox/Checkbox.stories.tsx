import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Checkbox, CheckboxGroup } from "@fds/core";

const meta = {
  title: "Components/Common/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    label: { control: "text" },
    description: { control: "text" },
    onChange: { control: false },
  },
  args: {
    label: "추천",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// 비제어: defaultChecked로 시작하고 상태는 컴포넌트가 가진다
export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    label: "주요일정 노출",
    description: "체크하면 홈 화면의 주요일정 영역에 함께 노출돼요.",
  },
};

// 상태 모음 (설명용 줄 배치는 순수 HTML)
export const States: Story = {
  render: function Render() {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Checkbox label="기본" />
        <Checkbox label="체크됨" defaultChecked />
        <Checkbox label="부분 선택" indeterminate />
        <Checkbox label="비활성" disabled />
        <Checkbox label="비활성 + 체크됨" disabled defaultChecked />
        <Checkbox label="에러 (필수 항목)" invalid />
      </div>
    );
  },
};

// 단일 체크 + 제어 모드: 값은 onChange의 boolean으로 받는다
export const Controlled: Story = {
  render: function Render() {
    const [featured, setFeatured] = useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Checkbox label="대표 콘텐츠" checked={featured} onChange={setFeatured} />
        <span style={{ fontSize: 13 }}>현재 값: {String(featured)}</span>
      </div>
    );
  },
};

// 채널 속성처럼 같은 주제의 체크박스 묶음
export const Group: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>(["partner"]);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <strong id="channel-attr" style={{ fontSize: 14 }}>
          채널 속성
        </strong>
        <CheckboxGroup
          aria-labelledby="channel-attr"
          options={[
            { value: "partner", label: "파트너" },
            { value: "trader", label: "트레이더" },
            { value: "media", label: "미디어", description: "뉴스·영상 채널" },
            { value: "closed", label: "운영 종료", disabled: true },
          ]}
          value={value}
          onChange={setValue}
        />
        <span style={{ fontSize: 13 }}>선택: {JSON.stringify(value)} (옵션 순서로 정렬)</span>
      </div>
    );
  },
};

export const GroupHorizontal: Story = {
  render: function Render() {
    return (
      <CheckboxGroup
        aria-label="채널 속성"
        orientation="horizontal"
        defaultValue={["partner"]}
        options={[
          { value: "partner", label: "파트너" },
          { value: "trader", label: "트레이더" },
          { value: "media", label: "미디어" },
        ]}
      />
    );
  },
};

// 일부만 선택되면 "전체 선택"이 부분 선택(-)이 되고, 누르면 전체 선택된다
export const SelectAllWithIndeterminate: Story = {
  render: function Render() {
    const menus = ["회원 관리", "콘텐츠", "신고", "설정"];
    const [checked, setChecked] = useState<string[]>(["콘텐츠"]);
    const all = checked.length === menus.length;
    const some = checked.length > 0 && !all;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 200 }}>
        <Checkbox
          label="전체 선택"
          checked={all}
          indeterminate={some}
          onChange={(next) => setChecked(next ? menus : [])}
        />
        <div style={{ borderTop: "1px solid #e7ebf2", paddingTop: 10, paddingLeft: 28 }}>
          <CheckboxGroup
            aria-label="메뉴"
            options={menus.map((menu) => ({ value: menu, label: menu }))}
            value={checked}
            onChange={setChecked}
          />
        </div>
        <span style={{ fontSize: 13 }}>
          {all ? "전체 선택" : some ? `${checked.length}개 선택 (부분 선택)` : "선택 없음"}
        </span>
      </div>
    );
  },
};

// name을 주면 네이티브 폼 제출로 전달된다. 같은 name의 체크된 값이 모두 담긴다.
export const InForm: Story = {
  render: function Render() {
    const [entries, setEntries] = useState<string[][] | null>(null);
    return (
      <form
        style={{ display: "flex", flexDirection: "column", gap: 14, width: 280 }}
        onSubmit={(event) => {
          event.preventDefault();
          setEntries(
            [...new FormData(event.currentTarget).entries()].map(([k, v]) => [k, String(v)]),
          );
        }}
      >
        <Checkbox name="featured" value="yes" label="대표 콘텐츠" />
        <CheckboxGroup
          aria-label="채널 속성"
          name="attr"
          defaultValue={["partner"]}
          options={[
            { value: "partner", label: "파트너" },
            { value: "trader", label: "트레이더" },
            { value: "media", label: "미디어" },
          ]}
        />
        <Button type="submit" variant="primary">
          제출
        </Button>
        {entries && (
          <pre
            style={{ margin: 0, fontSize: 12, background: "#f2f4f6", padding: 10, borderRadius: 8 }}
          >
            {entries.length ? entries.map(([k, v]) => `${k}=${v}`).join("\n") : "(전송된 값 없음)"}
          </pre>
        )}
      </form>
    );
  },
};

// 기획서의 권한 격자(메뉴 × 권한): "조회 권한이 없으면 하위 권한은 선택 불가"
// 이 규칙은 앱 로직이고, Checkbox는 controlled/disabled/indeterminate만 지원하면 된다.
export const PermissionMatrix: Story = {
  render: function Render() {
    const menus = ["회원 관리", "콘텐츠", "신고", "설정"];
    const perms = ["조회", "등록", "수정", "삭제", "승인"];
    type Matrix = Record<string, Record<string, boolean>>;
    const [matrix, setMatrix] = useState<Matrix>(() =>
      Object.fromEntries(
        menus.map((m) => [
          m,
          Object.fromEntries(perms.map((p) => [p, m === "콘텐츠" && p === "조회"])),
        ]),
      ),
    );

    const setCell = (menu: string, perm: string, next: boolean) =>
      setMatrix((prev) => {
        const row = { ...prev[menu], [perm]: next };
        // 조회를 끄면 같은 행의 나머지 권한을 모두 해제한다
        if (perm === "조회" && !next) {
          for (const p of perms) row[p] = false;
        }
        return { ...prev, [menu]: row };
      });

    // 열 전체 선택: 조회 열은 모든 행이 대상, 나머지 열은 조회가 켜진 행만 대상
    const eligible = (perm: string) => menus.filter((m) => perm === "조회" || matrix[m]["조회"]);
    const setColumn = (perm: string, next: boolean) =>
      setMatrix((prev) => {
        const result: Matrix = {};
        for (const m of menus) {
          const row = { ...prev[m] };
          if (perm === "조회" || prev[m]["조회"]) row[perm] = next;
          if (perm === "조회" && !next) for (const p of perms) row[p] = false;
          result[m] = row;
        }
        return result;
      });

    const granted = Object.fromEntries(
      menus
        .map((m) => [m, perms.filter((p) => matrix[m][p])])
        .filter(([, list]) => list.length > 0),
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `110px repeat(${perms.length}, 84px)`,
            alignItems: "center",
            rowGap: 10,
            fontSize: 13,
          }}
        >
          <span style={{ fontWeight: 600 }}>메뉴</span>
          {perms.map((perm) => {
            const rows = eligible(perm);
            const on = rows.filter((m) => matrix[m][perm]).length;
            return (
              <Checkbox
                key={perm}
                label={perm}
                disabled={rows.length === 0}
                checked={rows.length > 0 && on === rows.length}
                indeterminate={on > 0 && on < rows.length}
                onChange={(next) => setColumn(perm, next)}
              />
            );
          })}
          {menus.map((menu) => (
            <div key={menu} style={{ display: "contents" }}>
              <span>{menu}</span>
              {perms.map((perm) => (
                <Checkbox
                  key={perm}
                  aria-label={`${menu} ${perm}`}
                  checked={matrix[menu][perm]}
                  disabled={perm !== "조회" && !matrix[menu]["조회"]}
                  onChange={(next) => setCell(menu, perm, next)}
                />
              ))}
            </div>
          ))}
        </div>
        <pre
          style={{ margin: 0, fontSize: 12, background: "#f2f4f6", padding: 10, borderRadius: 8 }}
        >
          {JSON.stringify(granted, null, 2)}
        </pre>
      </div>
    );
  },
};
