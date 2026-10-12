import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, FolderIcon, HomeIcon, SettingsIcon, SideNav, Text } from "@fds/core";
import type { SideNavItem } from "@fds/core";

const items: SideNavItem[] = [
  { key: "dashboard", label: "대시보드", icon: <HomeIcon /> },
  {
    key: "contents",
    label: "콘텐츠 관리",
    icon: <FolderIcon />,
    children: [
      { key: "notice", label: "공지사항" },
      { key: "event", label: "이벤트", trailing: <Badge>3</Badge> },
      { key: "banner", label: "배너" },
    ],
  },
  {
    key: "settings",
    label: "설정",
    icon: <SettingsIcon />,
    children: [
      { key: "roles", label: "역할·권한" },
      { key: "admins", label: "관리자 계정" },
    ],
  },
];

// SideNav은 라우터를 모른다. 현재 위치는 activeKey로 알려 주고, 이동은 href 또는 onNavigate로 처리한다.
const meta = {
  title: "Components/Navigation/SideNav",
  component: SideNav,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", docs: { story: { height: "420px" } } },
  argTypes: {
    items: { control: false },
    collapsed: { control: "boolean" },
    collapsible: { control: "boolean" },
    width: { control: "number" },
    collapsedWidth: { control: "number" },
    onNavigate: { control: false },
    onCollapsedChange: { control: false },
  },
  args: { items, defaultActiveKey: "notice" },
  decorators: [
    (Story) => (
      <div style={{ height: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

// 활성 메뉴를 가진 그룹(콘텐츠 관리)은 처음부터 펼쳐진다
export const Default: Story = {
  args: { header: <Text>FDS Admin</Text> },
};

// 접으면 아이콘만 보인다. 접힌 상태에서 그룹을 누르면 메뉴가 펼쳐지면서 그 그룹이 열린다.
export const Collapsed: Story = {
  args: { defaultCollapsed: true, collapsedHeader: <Text>F</Text> },
};

// 접기/펼치기를 앱이 제어한다 (예: localStorage에 저장)
export const ControlledCollapsed: Story = {
  render: function Render(args) {
    const [collapsed, setCollapsed] = useState(false);
    return (
      <SideNav
        {...args}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        header={<Text>FDS Admin</Text>}
      />
    );
  },
};

// 메뉴를 누르면 onNavigate로 키가 오고, 앱이 라우터를 호출한 뒤 activeKey를 바꾼다
export const ControlledRoute: Story = {
  render: function Render(args) {
    const [route, setRoute] = useState("notice");
    return (
      <div style={{ display: "flex", height: "100%" }}>
        <SideNav {...args} activeKey={route} onNavigate={(key) => setRoute(key)} />
        <main style={{ padding: 24, fontSize: 14 }}>현재 화면: {route}</main>
      </div>
    );
  },
};

// href가 있으면 <a>로 렌더링되고, 라우터를 쓸 때는 onNavigate에서 event.preventDefault()를 부른다
export const WithHref: Story = {
  args: {
    items: [
      { key: "dashboard", label: "대시보드", icon: <HomeIcon />, href: "#dashboard" },
      { key: "settings", label: "설정", icon: <SettingsIcon />, href: "#settings" },
      { key: "disabled", label: "준비 중", icon: <FolderIcon />, disabled: true },
    ],
    defaultActiveKey: "dashboard",
  },
};
