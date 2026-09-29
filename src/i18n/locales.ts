export const localeConfig = {
  en: {
    label: "English",
    ogLocale: "en_US",
    currency: "USD",
    timeZone: "America/New_York",
    font: "geist",
  },
  ar: {
    label: "العربية",
    ogLocale: "ar_SA",
    currency: "SAR",
    timeZone: "Asia/Riyadh",
    font: "system",
  },
  zh: {
    label: "中文",
    ogLocale: "zh_CN",
    currency: "CNY",
    timeZone: "Asia/Shanghai",
    font: "system",
  },
  es: {
    label: "Español",
    ogLocale: "es_ES",
    currency: "EUR",
    timeZone: "Europe/Madrid",
    font: "geist",
  },
  ja: {
    label: "日本語",
    ogLocale: "ja_JP",
    currency: "JPY",
    timeZone: "Asia/Tokyo",
    font: "system",
  },
} as const;

export type AppLocale = keyof typeof localeConfig;

export const locales = Object.keys(localeConfig) as AppLocale[];

export type Currency = (typeof localeConfig)[AppLocale]["currency"];
