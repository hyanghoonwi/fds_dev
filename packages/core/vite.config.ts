import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      name: "fds",
      fileName: (format) => `index.${format}.js`,
      cssFileName: "style",
    },
    rollupOptions: {
      // React가 번들에 포함되면 용량 증가 및 버전 충돌이 생기므로 제외
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    },
  },
});
