// ponytail: single edit point when adding a locale — routing, regional, OG, and switcher derive from here
export const localeConfig = {
  en: {
    label: "English",
    ogLocale: "en_US",
    currency: "USD",
    timeZone: "America/New_York",
  },
  ar: {
    label: "العربية",
    ogLocale: "ar_SA",
    currency: "SAR",
    timeZone: "Asia/Riyadh",
  },
  zh: {
    label: "中文",
    ogLocale: "zh_CN",
    currency: "CNY",
    timeZone: "Asia/Shanghai",
  },
  es: {
    label: "Español",
    ogLocale: "es_ES",
    currency: "EUR",
    timeZone: "Europe/Madrid",
  },
  ja: {
    label: "日本語",
    ogLocale: "ja_JP",
    currency: "JPY",
    timeZone: "Asia/Tokyo",
  },
} as const;

export type AppLocale = keyof typeof localeConfig;

export const locales = Object.keys(localeConfig) as AppLocale[];

export type Currency = (typeof localeConfig)[AppLocale]["currency"];
export type AppTimeZone = (typeof localeConfig)[AppLocale]["timeZone"];
