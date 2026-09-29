import { defineRouting } from "next-intl/routing";
import { locales } from "./locales";

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  // Keep the default-locale URL stable instead of redirecting it from a saved
  // locale cookie or Accept-Language preference. Users can switch via links.
  localeDetection: false,
  localePrefix: "as-needed",
  // With detection off nothing reads the NEXT_LOCALE cookie, so do not set it.
  // A Set-Cookie on every page response also blocks shared caching.
  localeCookie: false,
  // Page metadata and the sitemap own the hreflang set (see createLocalizedMetadata).
  // The proxy's Link header would repeat it with different tags, and for pages
  // that may not exist in every locale.
  alternateLinks: false,
});
