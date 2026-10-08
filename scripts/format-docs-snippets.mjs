#!/usr/bin/env node
/**
 * docs의 ```tsx 코드 블록을 Prettier 스타일로 정리한다.
 *
 * `prettier --write`만으로는 JSX 요소가 여러 개 나란히 있는 예시가 문법 오류라 건너뛰어지고,
 * JSX 한 줄짜리 예시는 끝에 `;`가 붙는다. 이 스크립트가 그 두 경우를 처리한다.
 *   1) JSX만 있는(또는 일반 코드 뒤에 JSX가 오는) 블록은 JSX 부분을 `<>…</>`로 감싸 포맷한 뒤 벗겨 낸다.
 *   2) 그 결과 JSX 표현식 뒤의 `;`도 생기지 않는다.
 *
 * 사용: node scripts/format-docs-snippets.mjs   (보통은 `npm run format:docs`)
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import prettier from "prettier";

const ROOT = "packages/docs/docs";
const WIDTH = 80;
const FENCE = /```(tsx|jsx)\n([\s\S]*?)\n```/g;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])),
  );
  return nested.flat().filter((f) => /\.mdx?$/.test(f));
}

const options = { parser: "babel-ts", semi: true, singleQuote: false, trailingComma: "all" };

async function formatJsxOnly(code) {
  const wrapped = await prettier.format(`<>\n${code}\n</>`, { ...options, printWidth: WIDTH + 2 });
  const lines = wrapped.trimEnd().split("\n");
  // 첫 줄 `<>`와 마지막 줄 `</>;`를 벗기고 들여쓰기 2칸을 되돌린다
  return lines
    .slice(1, -1)
    .map((l) => (l.startsWith("  ") ? l.slice(2) : l))
    .join("\n");
}

/**
 * 블록을 "앞쪽 일반 코드"와 "뒤쪽 JSX"로 나눠 각각 포맷한다.
 * - 전체가 JSX면 전부 JSX로 본다.
 * - 아니면 최상위(들여쓰기 없는) `<`로 시작하는 첫 줄부터를 JSX 꼬리로 본다.
 * 어느 쪽이든 문법상 포맷할 수 없으면 원본을 그대로 둔다.
 */
async function formatSnippet(code) {
  const lines = code.split("\n");
  const jsxStart = lines.findIndex((l) => l.startsWith("<"));
  if (jsxStart === -1) {
    return code;
  }
  // 앞선 포맷에서 JSX 끝에 붙은 `;`는 감싸기 전에 제거한다 (`</>` 안에서는 문법 오류)
  const tail = lines
    .slice(jsxStart)
    .join("\n")
    .replace(/>;\s*$/, ">");
  const formattedTail = await formatJsxOnly(tail);
  if (jsxStart === 0) {
    return formattedTail;
  }
  const head = lines.slice(0, jsxStart);
  const gap = head[head.length - 1].trim() === "" ? "\n\n" : "\n";
  const formattedHead = (
    await prettier.format(head.join("\n"), { ...options, printWidth: WIDTH })
  ).trimEnd();
  return formattedHead + gap + formattedTail;
}

let changed = 0;
for (const file of await walk(ROOT)) {
  const source = await readFile(file, "utf8");
  const pending = [];
  source.replace(FENCE, (match, lang, code) => {
    pending.push({ match, lang, code });
    return match;
  });
  let next = source;
  for (const { match, lang, code } of pending) {
    let out = code;
    try {
      out = await formatSnippet(code);
    } catch {
      out = code; // 문법상 포맷할 수 없으면 그대로 둔다
    }
    if (out !== code) {
      next = next.replace(match, "```" + lang + "\n" + out + "\n```");
    }
  }
  if (next !== source) {
    await writeFile(file, next);
    changed += 1;
    console.log("formatted", file);
  }
}
console.log(`${changed} files updated`);
