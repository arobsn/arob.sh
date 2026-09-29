import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import type { SiteConfig } from "vitepress";
import { SITE_URL, github } from "./theme/site.ts";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// light palette from style.css.
const colors = { bg: "#fbfbfa", text: "#1c1c1a", muted: "#6f6f6b", border: "#e7e7e4" };

const domain = new URL(SITE_URL).host;

export function ogImagePath(relativePath: string) {
  return relativePath.startsWith("posts/")
    ? `/og/${relativePath.replace(/\.md$/, "")}.png`
    : "/og.png";
}

export async function generateOgImages({ outDir, site }: SiteConfig) {
  const fonts = await loadFonts();
  const render = (card: Card) => renderPng(card, fonts);

  await write(
    join(outDir, ogImagePath("index.md")),
    await render({
      title: site.title,
      description: site.description,
      footer: [domain, github.label],
    }),
  );

  const { default: postsLoader } = await import("./theme/posts.data.ts");
  for (const post of await postsLoader.load()) {
    await write(
      join(outDir, ogImagePath(`${post.url.slice(1)}.md`)),
      await render({
        title: post.title,
        description: post.description,
        footer: [`${site.title} · ${domain}`, `${post.date.long} · ${post.readingTime} min read`],
      }),
    );
  }
}

interface Card {
  title: string;
  description?: string;
  footer: [string, string];
}

type Fonts = Parameters<typeof satori>[1]["fonts"];

async function loadFonts(): Promise<Fonts> {
  // satori reads woff but not woff2, so use the static Lora package's woff files.
  const require = createRequire(import.meta.url);
  const file = (weight: number) =>
    readFile(require.resolve(`@fontsource/lora/files/lora-latin-${weight}-normal.woff`));

  return [
    { name: "Lora", data: await file(400), weight: 400, style: "normal" },
    { name: "Lora", data: await file(600), weight: 600, style: "normal" },
  ];
}

async function renderPng({ title, description, footer }: Card, fonts: Fonts) {
  const svg = await satori(
    el(
      "div",
      {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "80px 88px",
        background: colors.bg,
        color: colors.text,
        fontFamily: "Lora",
      },
      el(
        "div",
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          borderRadius: 14,
          background: colors.text,
          color: colors.bg,
          fontSize: 34,
          fontWeight: 600,
        },
        "a",
      ),
      el(
        "div",
        { display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1 },
        el(
          "div",
          {
            fontSize: titleSize(title),
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          },
          title,
        ),
        description &&
          el(
            "div",
            { marginTop: 24, fontSize: 34, lineHeight: 1.4, color: colors.muted },
            truncate(description, 140),
          ),
      ),
      el(
        "div",
        {
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 28,
          borderTop: `2px solid ${colors.border}`,
          fontSize: 26,
          color: colors.muted,
        },
        el("div", {}, footer[0]),
        el("div", {}, footer[1]),
      ),
    ),
    { width: OG_WIDTH, height: OG_HEIGHT, fonts },
  );

  return new Resvg(svg, { font: { loadSystemFonts: false } }).render().asPng();
}

function el(type: string, style: Record<string, unknown>, ...children: unknown[]) {
  const nodes = children.filter(Boolean);
  // a lone child must not be wrapped in an array, or satori counts it as several
  return { type, key: null, props: { style, children: nodes.length === 1 ? nodes[0] : nodes } };
}

function titleSize(title: string) {
  if (title.length > 60) return 56;
  if (title.length > 35) return 64;
  return 76;
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

async function write(file: string, data: Uint8Array) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, data);
}
