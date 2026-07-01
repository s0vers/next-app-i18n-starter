import { getPathname } from "@/i18n/navigation";
import { localeConfig, locales } from "@/i18n/locales";
import { routing } from "@/i18n/routing";

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

export const openGraphLocales = Object.fromEntries(
  locales.map((locale) => [locale, localeConfig[locale].ogLocale]),
);

export async function getLocaleUrl(
  locale: string,
  href: "/" | `/${string}` = "/",
) {
  const pathname = await getPathname({ locale, href });
  return new URL(pathname, siteConfig.url).toString();
}

export async function getAlternateLanguages(
  href: "/" | `/${string}` = "/",
) {
  return Object.fromEntries(
    await Promise.all(
      routing.locales.map(async (locale) => [
        locale,
        await getLocaleUrl(locale, href),
      ]),
    ),
  );
}
