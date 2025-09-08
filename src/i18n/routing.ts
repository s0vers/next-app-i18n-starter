import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "ar", "zh", "es", "ja"],

  // Used when no locale matches
  defaultLocale: "en",
  localeDetection: true,
  //to remove the locale prefix from the url
  localePrefix: "never",
});
