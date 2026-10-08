import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "@fds/core";

const meta = {
  title: "Components/Common/Text",
  component: Text,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    as: { control: "inline-radio", options: ["span", "p"] },
    variant: { control: "inline-radio", options: ["title", "caption"] },
  },
  args: {
    children: "방송 제목 텍스트",
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Title: Story = {
  args: { variant: "title" },
};

export const Caption: Story = {
  args: { variant: "caption", children: "2시간 전" },
};
