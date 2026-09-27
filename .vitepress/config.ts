import { defineConfig } from "vitepress";
import { SITE_URL, type ThemeConfig } from "./theme/types.ts";

// https://vitepress.dev/reference/site-config
export default defineConfig<ThemeConfig>({
  srcDir: "blog",
  cleanUrls: true,
  appearance: false, // dark mode follows the OS via prefers-color-scheme

  title: "Alison Oliveira",
  description: "Software engineer writing about everything.",

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    ["meta", { name: "theme-color", content: "#fbfbfa", media: "(prefers-color-scheme: light)" }],
    ["meta", { name: "theme-color", content: "#111110", media: "(prefers-color-scheme: dark)" }],
  ],

  themeConfig: {
    handle: "arobsn",
    links: [
      { text: "email", href: "mailto:hi@arob.sh" },
      { text: "telegram", href: "https://t.me/arobsn" },
      { text: "github", href: "https://github.com/arobsn" },
      { text: "x", href: "https://x.com/Alisovsky" },
    ],
  },

  transformPageData(pageData, { siteConfig }) {
    const url = `${SITE_URL}/${pageData.relativePath.replace(/(index)?\.md$/, "")}`;
    const title = pageData.frontmatter.title ?? siteConfig.site.title;

    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(
      ["link", { rel: "canonical", href: url }],
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { name: "twitter:card", content: "summary" }],
    );
  },

  transformHead({ assets }) {
    const font = assets.find((file) => /lora-latin-wght-normal\.[\w-]+\.woff2$/.test(file));
    if (!font) return;

    return [
      ["link", { rel: "preload", href: font, as: "font", type: "font/woff2", crossorigin: "" }],
    ];
  },
});
