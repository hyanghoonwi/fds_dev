import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from './FormField';
import { Input } from '@/componets/input/Input';
import { cn } from '@/utils/cn';

const meta = {
  title: 'Components/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'label/필수표시/helperText/errorText 배치를 캡슐화한 공용 레이아웃입니다. ' +
          '`Input`은 이미 내부적으로 FormField를 사용하고 있어서, 텍스트 인풋을 만들 때는 ' +
          'FormField를 직접 쓸 필요 없이 `Input`의 label/helperText/errorText prop을 그대로 쓰면 됩니다. ' +
          'FormField를 직접 쓰는 경우는 select, textarea, checkbox 그룹처럼 아직 label/에러 레이아웃이 ' +
          '내장되어 있지 않은 커스텀 컨트롤을 감쌀 때입니다. 아래 스토리들이 그 예시입니다.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    required: { control: 'boolean' },
  },
  args: {
    label: '이름',
    htmlFor: 'formfield-name',
    children: null,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

const controlClassName =
  'h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-black';

export const Default: Story = {
  render: (args) => (
    <FormField {...args}>
      <input id={args.htmlFor} placeholder="홍길동" className={controlClassName} />
    </FormField>
  ),
};

export const Required: Story = {
  args: { required: true },
  render: (args) => (
    <FormField {...args}>
      <input id={args.htmlFor} placeholder="홍길동" className={controlClassName} />
    </FormField>
  ),
};

export const WithError: Story = {
  args: { errorText: '이름을 입력해주세요.' },
  render: (args) => (
    <FormField {...args}>
      <input id={args.htmlFor} className={controlClassName} />
    </FormField>
  ),
};

export const HorizontalLayout: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => (
    <FormField {...args}>
      <input id={args.htmlFor} placeholder="홍길동" className={controlClassName} />
    </FormField>
  ),
};

// FormField는 Input에 이미 내장되어 있다. 텍스트 인풋이면 이렇게 FormField를
// 직접 쓰지 않고 Input 하나로 끝난다 (비교용 예시).
export const AlreadyBuiltIntoInput: Story = {
  args: { label: '이메일' },
  render: () => <Input label="이메일" placeholder="you@example.com" helperText="회사 이메일을 입력하세요." />,
};

// select처럼 아직 FDS에 없는 컨트롤도 FormField로 감싸면 label/에러 레이아웃을 재사용할 수 있다.
export const WithNativeSelect: Story = {
  args: { label: '역할', htmlFor: 'formfield-role' },
  render: (args) => (
    <FormField {...args}>
      <select id={args.htmlFor} className={controlClassName}>
        <option value="admin">관리자</option>
        <option value="editor">에디터</option>
        <option value="viewer">뷰어</option>
      </select>
    </FormField>
  ),
};

export const WithTextarea: Story = {
  args: { label: '메모', htmlFor: 'formfield-memo', helperText: '최대 200자까지 입력할 수 있습니다.' },
  render: (args) => (
    <FormField {...args}>
      <textarea
        id={args.htmlFor}
        rows={4}
        maxLength={200}
        className={cn(controlClassName, 'h-auto resize-none py-2')}
      />
    </FormField>
  ),
};

// FormField는 <label>을 렌더링하지 않는 그룹(체크박스 등)에도 쓸 수 있다.
// 이때 htmlFor는 생략하고, description만 붙이는 용도로 사용한다.
export const WithCheckboxGroup: Story = {
  args: { label: '알림 설정', htmlFor: undefined },
  render: (args) => (
    <FormField {...args}>
      <div className="flex flex-col gap-2 text-sm text-gray-700">
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked /> 이메일 알림
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" /> SMS 알림
        </label>
      </div>
    </FormField>
  ),
};
