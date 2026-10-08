import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// core 소스를 직접 참조해 빌드 없이 HMR 동작 (storybook dev / vitest 공용)
export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      "@fds/core": resolve(import.meta.dirname, "../../core/src/index.ts"),
    },
  },
});
