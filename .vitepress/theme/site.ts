export const SITE_URL = "https://arob.sh";

export const accounts = {
  email: "hi@arob.sh",
  github: "arobsn",
  x: "Alisovsky",
  telegram: "arobsn",
};

export interface Contact {
  name: keyof typeof accounts;
  href: string;
  label: string;
}

export const contacts: Contact[] = [
  { name: "email", href: `mailto:${accounts.email}`, label: accounts.email },
  { name: "github", href: `https://github.com/${accounts.github}`, label: `@${accounts.github}` },
  { name: "x", href: `https://x.com/${accounts.x}`, label: `@${accounts.x}` },
  { name: "telegram", href: `https://t.me/${accounts.telegram}`, label: `@${accounts.telegram}` },
];

export const github = contacts.find((contact) => contact.name === "github")!;

export const isExternal = (href: string) => /^https?:\/\//.test(href);
