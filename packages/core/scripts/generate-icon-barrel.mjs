#!/usr/bin/env node
/** src/components/icon/*Icon.tsx 를 스캔해 index.ts(barrel)를 다시 만든다. */
import { readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const dir = resolve("src/components/icon");
const files = (await readdir(dir)).filter((f) => f.endsWith("Icon.tsx")).sort();
const lines = files.map((f) => `export * from "./${f.replace(/\.tsx$/, "")}";`);
await writeFile(
  resolve(dir, "index.ts"),
  `// 자동 생성: node scripts/generate-icon-barrel.mjs\n${lines.join("\n")}\n`,
);
console.log(`${files.length} icons`);
