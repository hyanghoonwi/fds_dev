import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import remarkGfm from "remark-gfm";
import sharedConfig from "./vite.shared.ts";

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    {
      name: "@storybook/addon-docs",
      // MDX에서 표(`| a | b |`)와 체크리스트 같은 GFM 문법을 쓰려면 필요하다
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    "@storybook/addon-mcp",
  ],
  framework: "@storybook/react-vite",
  viteFinal: (config) => mergeConfig(config, sharedConfig),
};
export default config;
