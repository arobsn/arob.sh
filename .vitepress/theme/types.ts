export const SITE_URL = "https://arob.sh";

export const isExternal = (href: string) => /^https?:\/\//.test(href);

export interface ThemeConfig {
  handle: string;
  links: { text: string; href: string }[];
}
