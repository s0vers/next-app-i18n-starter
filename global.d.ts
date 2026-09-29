import en from "./dictionary/en.json";
import type { AppLocale } from "./src/i18n/locales";
import { createRegionalFormats } from "./src/i18n/regional";

declare module "next-intl" {
  interface AppConfig {
    Locale: AppLocale;
    Messages: typeof en;
    Formats: ReturnType<typeof createRegionalFormats>;
  }
}
