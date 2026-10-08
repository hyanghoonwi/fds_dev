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
            // 도메인 무관하게 쓰는 범용 컴포넌트
            "Common",
            [
              "Button",
              "IconButton",
              "Input",
              "Select",
              "Textarea",
              "Checkbox",
              "RadioGroup",
              "FormField",
              "Switch",
              "SegmentedControl",
              "Modal",
              "Badge",
              "Text",
              "Spinner",
              "ProgressBar",
              "ResizeHandle",
              "Popover",
              "Calendar",
              "TimePanel",
              "DatePicker",
              "TimePicker",
              "DateTimePicker",
            ],
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
