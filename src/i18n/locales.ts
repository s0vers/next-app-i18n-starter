export const localeConfig = {
  en: {
    label: "English",
    languageTag: "en-US",
    ogLocale: "en_US",
    currency: "USD",
    timeZone: "America/New_York",
    dir: "ltr",
    font: "geist",
  },
  ar: {
    label: "العربية",
    languageTag: "ar-SA",
    ogLocale: "ar_SA",
    currency: "SAR",
    timeZone: "Asia/Riyadh",
    dir: "rtl",
    font: "system",
  },
  zh: {
    label: "中文",
    languageTag: "zh-Hans-CN",
    ogLocale: "zh_CN",
    currency: "CNY",
    timeZone: "Asia/Shanghai",
    dir: "ltr",
    font: "system",
  },
  es: {
    label: "Español",
    languageTag: "es-ES",
    ogLocale: "es_ES",
    currency: "EUR",
    timeZone: "Europe/Madrid",
    dir: "ltr",
    font: "geist",
  },
  ja: {
    label: "日本語",
    languageTag: "ja-JP",
    ogLocale: "ja_JP",
    currency: "JPY",
    timeZone: "Asia/Tokyo",
    dir: "ltr",
    font: "system",
  },
} as const;

export type AppLocale = keyof typeof localeConfig;

export type Direction = (typeof localeConfig)[AppLocale]["dir"];

export const locales = Object.keys(localeConfig) as AppLocale[];

export type Currency = (typeof localeConfig)[AppLocale]["currency"];
