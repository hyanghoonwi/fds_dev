import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";
import logo from "./assets/fds-logo.png";

const theme = create({
  base: "light",
  brandTitle: "FDS",
  brandImage: logo,
  brandTarget: "_self",

  colorPrimary: "#3182F6",
  colorSecondary: "#3182F6",

  appBg: "#F7F9FC",
  appContentBg: "#FFFFFF",
  appPreviewBg: "#FFFFFF",
  appBorderColor: "#E7EBF2",
  appBorderRadius: 8,

  fontBase: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
  fontCode: "ui-monospace, SFMono-Regular, Menlo, monospace",

  textColor: "#333D4B",
  textInverseColor: "#FFFFFF",
  textMutedColor: "#62676D",

  barTextColor: "#62676D",
  barSelectedColor: "#3182F6",
  barHoverColor: "#3182F6",
  barBg: "#FFFFFF",

  buttonBg: "#F7F9FC",
  buttonBorder: "#E7EBF2",
  booleanBg: "#EFF0F1",
  booleanSelectedBg: "#3182F6",

  inputBg: "#FFFFFF",
  inputBorder: "#E7EBF2",
  inputTextColor: "#333D4B",
  inputBorderRadius: 8,
});

addons.setConfig({
  theme,
  sidebar: {
    showRoots: false,
  },
});
