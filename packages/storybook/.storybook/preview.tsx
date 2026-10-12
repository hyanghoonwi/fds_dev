import type { Preview } from "@storybook/react-vite";
import "../../core/src/index.css";

const preview: Preview = {
  // 모든 스토리에 Docs 탭을 동일하게 제공
  tags: ["autodocs"],

  parameters: {
    options: {
      storySort: {
        order: [
          "Foundations",
          "Components",
          [
            // 사용자 입력 컨트롤
            "Form",
            [
              "Input",
              "Textarea",
              "Select",
              "Checkbox",
              "RadioGroup",
              "Switch",
              "SegmentedControl",
              "FileUpload",
              "FormField",
            ],
            // 날짜·시간. Overview(구조 설명) → 바로 쓰는 필드 → 재료가 되는 패널 순서
            "Date & Time",
            [
              "Overview",
              "DatePicker",
              "DateRangePicker",
              "TimePicker",
              "DateTimePicker",
              "Calendar",
              "TimePanel",
            ],
            "Actions",
            ["Button", "IconButton"],
            "Navigation",
            ["SideNav", "SegmentedControl", "Pagination"],
            // Popover는 날짜 필드뿐 아니라 어디서나 쓰는 범용 오버레이다
            "Overlay",
            ["Modal", "Popover"],
            "Display",
            ["Badge", "Chip", "DataTable", "Text", "Spinner", "ProgressBar"],
            "Layout",
            ["ResizeHandle"],
            // 방송/채팅 도메인 전용 컴포넌트
            "Broadcast",
            [
              "ChatBubble",
              "EmojiPicker",
              "NewMessagePreview",
              "ScrollToBottomButton",
              "Adjuster",
              "LiveBadge",
              "Thumbnail",
            ],
          ],
          "Hooks",
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },

  initialGlobals: {
    theme: "light",
  },

  globalTypes: {
    theme: {
      description: "라이트/다크 테마",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "circlehollow", title: "Light" },
          { value: "dark", icon: "circle", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? "light";
      return (
        <div
          data-theme={theme}
          style={{
            minHeight: "100%",
            padding: 24,
            background: theme === "dark" ? "#333D4B" : "#FFFFFF",
            color: theme === "dark" ? "#FFFFFF" : "#333D4B",
            transition: "background-color 0.15s ease, color 0.15s ease",
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
