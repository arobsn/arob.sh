import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { defineConfig, type HeadConfig } from "vitepress";
import { SITE_URL, accounts, contacts, isExternal } from "./theme/site.ts";

const jsonLd = (data: object): HeadConfig => [
  "script",
  { type: "application/ld+json" },
  JSON.stringify({ "@context": "https://schema.org", ...data }),
];

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "blog",
  cleanUrls: true,
  appearance: false, // dark mode follows the OS via prefers-color-scheme
  sitemap: { hostname: SITE_URL },

  title: "Alison Oliveira",
  description:
    "Alison Oliveira is a senior software engineer from Brazil writing about systems design, cryptography, and open source.",

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    ["meta", { media: "(prefers-color-scheme: light)", name: "theme-color", content: "#fbfbfa" }],
    ["meta", { media: "(prefers-color-scheme: dark)", name: "theme-color", content: "#111110" }],
    ["meta", { name: "twitter:creator", content: `@${accounts.x}` }],
  ],

  transformPageData(pageData, { siteConfig }) {
    if (pageData.isNotFound) return;

    const { site } = siteConfig;
    const url = `${SITE_URL}/${pageData.relativePath.replace(/(index)?\.md$/, "")}`;
    const { title = site.title, description = site.description, date } = pageData.frontmatter;
    const isPost = pageData.relativePath.startsWith("posts/");
    const author = { "@type": "Person", name: site.title, url: SITE_URL };

    const head: HeadConfig[] = [
      ["link", { rel: "canonical", href: url }],
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
      ["meta", { property: "og:site_name", content: site.title }],
      ["meta", { name: "twitter:card", content: "summary" }],
    ];

    if (isPost) {
      const published = date ? new Date(date).toISOString().slice(0, 10) : undefined;
      head.push(
        ["meta", { property: "og:type", content: "article" }],
        jsonLd({
          "@type": "BlogPosting",
          headline: title,
          description,
          url,
          datePublished: published,
          author,
        }),
      );
      if (published) {
        head.push(["meta", { property: "article:published_time", content: published }]);
      }
    } else {
      head.push(["meta", { property: "og:type", content: "website" }]);
    }

    if (pageData.frontmatter.layout === "home") {
      head.push(
        jsonLd({
          ...author,
          jobTitle: "Senior Software Engineer",
          sameAs: contacts.filter(({ href }) => isExternal(href)).map(({ href }) => href),
        }),
      );
    }

    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(...head);
  },

  transformHead({ assets, pageData }) {
    const head: HeadConfig[] = [];
    if (pageData.isNotFound) head.push(["meta", { name: "robots", content: "noindex" }]);

    const font = assets.find((file) => /lora-latin-wght-normal\.[\w-]+\.woff2$/.test(file));
    if (font) {
      head.push([
        "link",
        { rel: "preload", href: font, as: "font", type: "font/woff2", crossorigin: "" },
      ]);
    }
    return head;
  },

  async buildEnd({ outDir }) {
    const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
    await writeFile(join(outDir, "robots.txt"), robots);
  },
});
