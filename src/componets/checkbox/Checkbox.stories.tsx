import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
  args: {
    label: '전체 동의',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: '일부 선택됨' },
};

export const SelectAllGroup: Story = {
  render: () => {
    const items = ['이메일 알림', 'SMS 알림', '푸시 알림'];
    const [checked, setChecked] = useState<boolean[]>([true, false, false]);
    const allChecked = checked.every(Boolean);
    const someChecked = checked.some(Boolean);

    return (
      <div className="flex flex-col gap-2">
        <Checkbox
          label="전체 선택"
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          onChange={(e) => setChecked(checked.map(() => e.target.checked))}
        />
        <div className="ml-6 flex flex-col gap-2">
          {items.map((item, index) => (
            <Checkbox
              key={item}
              label={item}
              checked={checked[index]}
              onChange={(e) =>
                setChecked((prev) => prev.map((value, i) => (i === index ? e.target.checked : value)))
              }
            />
          ))}
        </div>
      </div>
    );
  },
};
