import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAlternateLanguages, getLocaleUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = getAlternateLanguages();

  return routing.locales.map((locale) => ({
    url: getLocaleUrl(locale),
    alternates: { languages },
  }));
}
