import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/locales";
import { routing } from "@/i18n/routing";

export const siteConfig = {
  name: "Next.js i18n Starter",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://next-app-i18n-starter.vercel.app",
  github: "https://github.com/S0vers/i18n-Nextjs-BoilerPlate",
  author: {
    name: "Sovers Tonmoy Pandey",
    alias: "S0vers",
    url: "https://s0vers.com",
    twitter: "@s0ver5",
    github: "https://github.com/S0vers",
  },
} as const;

export function getLocaleUrl(
  locale: AppLocale,
  href: "/" | `/${string}` = "/",
) {
  const pathname = getPathname({ locale, href });
  return new URL(pathname, siteConfig.url).toString();
}

export function getAlternateLanguages(
  href: "/" | `/${string}` = "/",
) {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, getLocaleUrl(locale, href)]),
  );

  return { ...languages, "x-default": languages[routing.defaultLocale] };
}
