import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "FDS",
  tagline: "Futurewiz Design System",
  favicon: "img/favicon.ico",
  url: "https://fds.example.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  i18n: { defaultLocale: "ko", locales: ["ko"] },

  presets: [
    [
      "classic",
      {
        docs: { sidebarPath: "./sidebars.ts", routeBasePath: "docs" },
        blog: false,
        theme: { customCss: "./src/css/custom.css" },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: "FDS",
      items: [
        { type: "docSidebar", sidebarId: "main", label: "Docs", position: "left" },
        { type: "doc", docId: "api/use-overlay", label: "API", position: "left" },
        // Storybook은 개발자용 샌드박스. 배포 주소가 정해지면 교체
        { href: "http://localhost:6006", label: "Storybook", position: "right" },
      ],
    },
    colorMode: { defaultMode: "light", respectPrefersColorScheme: true },
    footer: { style: "light", copyright: `© ${new Date().getFullYear()} Futurewiz` },
  } satisfies Preset.ThemeConfig,
};

export default config;
