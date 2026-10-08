import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { Switch } from "@fds/core";

const meta = {
  title: "Components/Common/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
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
