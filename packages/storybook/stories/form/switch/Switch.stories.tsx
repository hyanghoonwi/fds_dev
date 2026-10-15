import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { Switch } from "@fds/core";
import { useState } from "react";

const meta = {
  title: "Components/Form/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
    onChange: { control: false },
  },
  args: {
    checked: false,
    onChange: () => {},
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return <Switch {...args} onChange={(checked) => updateArgs({ checked })} />;
  },
};

export const Checked: Story = {
  args: { checked: true },
  render: Default.render,
};

export const Disabled: Story = {
  args: { disabled: true },
};

// 트랙: sm 40×24 · md 50×30(기본) · lg 60×36 · xl 70×42px
export const Sizes: Story = {
  render: function Render(args) {
    const [checked, setChecked] = useState(true);
    return (
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {(["sm", "md", "lg", "xl"] as const).map((size) => (
          <Switch key={size} {...args} size={size} checked={checked} onChange={setChecked} />
        ))}
      </div>
    );
  },
};
