import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { ProgressBar } from "@fds/core";

const meta = {
  title: "Components/Common/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    onChange: { control: false },
  },
  args: {
    value: 40,
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {
  args: { onChange: undefined },
  render: (args) => (
    <div style={{ width: 280 }}>
      <ProgressBar {...args} />
    </div>
  ),
};

export const Interactive: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs();
    return (
      <div style={{ width: 280 }}>
        <ProgressBar {...args} onChange={(value) => updateArgs({ value })} />
      </div>
    );
  },
};
