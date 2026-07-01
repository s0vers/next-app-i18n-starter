export const siteConfig = {
  name: "Next.js i18n Starter",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://next-app-i18n-starter.vercel.app",
  github: "https://github.com/S0vers/next-app-i18n-starter",
  author: {
    name: "Sovers Tonmoy Pandey",
    alias: "S0vers",
    url: "https://s0vers.com",
    twitter: "@s0ver5",
    github: "https://github.com/S0vers",
  },
} as const;

export const openGraphLocales: Record<string, string> = {
  en: "en_US",
  ar: "ar_SA",
  zh: "zh_CN",
  es: "es_ES",
  ja: "ja_JP",
};
