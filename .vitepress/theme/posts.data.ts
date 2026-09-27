import { createContentLoader } from "vitepress";

export interface Post {
  title: string;
  url: string;
  description: string | undefined;
  date: { time: number; iso: string; short: string; long: string };
  readingTime: number;
}

declare const data: Post[];
export { data };

const WORDS_PER_MINUTE = 230;

export default createContentLoader("posts/*.md", {
  includeSrc: true,
  transform(raw): Post[] {
    return raw
      .filter(({ frontmatter }) => !frontmatter.draft)
      .map(({ url, frontmatter, src = "" }) => ({
        title: frontmatter.title,
        url,
        description: frontmatter.description,
        date: formatDate(frontmatter.date),
        readingTime: Math.max(1, Math.round(src.split(/\s+/).length / WORDS_PER_MINUTE)),
      }))
      .sort((a, b) => b.date.time - a.date.time);
  },
});

function formatDate(raw: string | Date): Post["date"] {
  const date = new Date(raw);
  const format = (month: "short" | "long") =>
    date.toLocaleDateString("en-US", { year: "numeric", month, day: "numeric", timeZone: "UTC" });

  return {
    time: +date,
    iso: date.toISOString().slice(0, 10),
    short: format("short"),
    long: format("long"),
  };
}
