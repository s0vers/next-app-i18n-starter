import { defineRouting } from "next-intl/routing";
import { locales } from "./locales";

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  // Keep the default-locale URL stable instead of redirecting it from a saved
  // locale cookie or Accept-Language preference. Users can switch via links.
  localeDetection: false,
  localePrefix: "as-needed",
});
