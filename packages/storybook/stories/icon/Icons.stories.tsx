import type { Meta, StoryObj } from "@storybook/react-vite";
import * as core from "@fds/core";
import { iconGroups } from "@fds/core";

// 아이콘 이름은 iconGroups(카테고리)로 관리한다. 새 아이콘은 core의 iconGroups에 등록하면 여기에 자동으로 나온다.
const icons = core as unknown as Record<string, React.ComponentType>;

const meta = {
  title: "Foundations/Icons",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {Object.entries(iconGroups).map(([group, names]) => (
        <section key={group}>
          <h3 style={{ margin: "0 0 12px", fontSize: 14 }}>
            {group} <span style={{ fontWeight: 400, color: "#8b95a1" }}>{names.length}</span>
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(112px, 1fr))",
              gap: 8,
            }}
          >
            {names.map((name) => {
              const Icon = icons[`${name}Icon`];
              return (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    padding: "14px 6px",
                    fontSize: 11,
                  }}
                >
                  <Icon />
                  <span style={{ wordBreak: "break-all", textAlign: "center" }}>{name}</span>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  ),
};
