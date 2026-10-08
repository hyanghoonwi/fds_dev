import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import sharedConfig from "./vite.shared.ts";

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
  ],
  framework: "@storybook/react-vite",
  viteFinal: (config) => mergeConfig(config, sharedConfig),
};
export default config;
