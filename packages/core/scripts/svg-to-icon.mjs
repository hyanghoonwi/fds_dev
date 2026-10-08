#!/usr/bin/env node
/**
 * Figma에서 내려받은 SVG를 FDS 아이콘 컴포넌트(TSX)로 변환한다.
 *
 *   node scripts/svg-to-icon.mjs <Name> <svg 경로|URL> [--node 46:3676] [--out src/components/icon]
 *
 *   <Name>   PascalCase, 접미사 Icon은 자동으로 붙는다 (User → UserIcon.tsx)
 *   --node   출처 Figma 노드 id (파일 상단 주석으로 남긴다)
 *
 * 변환 규칙: stroke/fill 색은 currentColor, id/style 제거, opacity=0 그룹 제거,
 * 속성은 JSX camelCase, width/height는 size prop(기본값은 원본 width).
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const COLORS = /^#(292d32|000|000000)$/i;
const ATTR_RENAME = {
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-dasharray": "strokeDasharray",
  "fill-rule": "fillRule",
  "clip-rule": "clipRule",
  "clip-path": "clipPath",
  "fill-opacity": "fillOpacity",
  "stroke-opacity": "strokeOpacity",
};

export function parseAttrs(source) {
  const attrs = [];
  for (const m of source.matchAll(/([\w:-]+)="([^"]*)"/g)) {
    attrs.push([m[1], m[2]]);
  }
  return attrs;
}

function parse(svg) {
  const root = { tag: "root", attrs: [], children: [] };
  const stack = [root];
  for (const m of svg.matchAll(/<(\/?)([a-zA-Z]+)([^>]*?)(\/?)>/g)) {
    const [, closing, tag, rest, selfClosing] = m;
    if (closing) {
      stack.pop();
      continue;
    }
    const node = { tag, attrs: parseAttrs(rest), children: [] };
    stack[stack.length - 1].children.push(node);
    if (!selfClosing) {
      stack.push(node);
    }
  }
  return root.children[0];
}

function clean(node) {
  const attrs = node.attrs
    .filter(([k]) => k !== "id")
    .map(([k, v]) => [k, COLORS.test(v) ? "currentColor" : v]);
  const children = node.children.map(clean).flat();
  if (node.tag === "g") {
    if (attrs.some(([k, v]) => k === "opacity" && v === "0")) {
      return [];
    }
    if (attrs.length === 0) {
      return children; // 의미 없는 래퍼 그룹은 펼친다
    }
  }
  return [{ tag: node.tag, attrs, children }];
}

function render(node, indent) {
  const pad = "  ".repeat(indent);
  const attrs = node.attrs.map(([k, v]) => `${pad}  ${ATTR_RENAME[k] ?? k}="${v}"`);
  if (node.children.length === 0) {
    return `${pad}<${node.tag}\n${attrs.join("\n")}\n${pad}/>`;
  }
  const inner = node.children.map((c) => render(c, indent + 1)).join("\n");
  const open = attrs.length
    ? `${pad}<${node.tag}\n${attrs.join("\n")}\n${pad}>`
    : `${pad}<${node.tag}>`;
  return `${open}\n${inner}\n${pad}</${node.tag}>`;
}

async function main() {
  const [name, source, ...flags] = process.argv.slice(2);
  if (!name || !source) {
    console.error("usage: svg-to-icon.mjs <Name> <svg path|url> [--node id] [--out dir]");
    process.exit(1);
  }
  const flag = (key, fallback) => {
    const i = flags.indexOf(key);
    return i >= 0 ? flags[i + 1] : fallback;
  };
  const outDir = resolve(flag("--out", "src/components/icon"));
  const node = flag("--node");
  const svg = /^https?:/.test(source)
    ? await (await fetch(source)).text()
    : await readFile(source, "utf8");

  const svgNode = parse(svg);
  const attr = (k) => svgNode.attrs.find(([key]) => key === k)?.[1];
  const width = Number.parseFloat(attr("width") ?? "24");
  const viewBox = attr("viewBox") ?? `0 0 ${width} ${width}`;
  const fill = attr("fill") === "none" || attr("fill") === undefined ? "none" : "currentColor";
  const body = svgNode.children
    .flatMap(clean)
    .map((c) => render(c, 3))
    .join("\n");

  const componentName = `${name.replace(/Icon$/, "")}Icon`;
  const header = node ? `// Vuesax Linear · Figma node ${node}\n` : "";
  const code = `${header}import type { IconProps } from "./MoonIcon";

export function ${componentName}({ size = ${width}, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="${viewBox}" fill="${fill}" {...props}>
${body}
    </svg>
  );
}
`;
  await writeFile(resolve(outDir, `${componentName}.tsx`), code);
  console.log(`${componentName}  ←  ${node ?? source}`);
}

main();
