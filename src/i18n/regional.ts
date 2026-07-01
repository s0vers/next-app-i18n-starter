import { routing } from "./routing";

export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "CNY" | "SAR";
export type AppTimeZone =
  | "America/New_York"
  | "Europe/London"
  | "Europe/Berlin"
  | "Europe/Madrid"
  | "Asia/Tokyo"
  | "Asia/Shanghai"
  | "Asia/Riyadh";

export const localeRegionalDefaults: Record<
  (typeof routing.locales)[number],
  { currency: Currency; timeZone: AppTimeZone }
> = {
  en: { currency: "USD", timeZone: "America/New_York" },
  ar: { currency: "SAR", timeZone: "Asia/Riyadh" },
  zh: { currency: "CNY", timeZone: "Asia/Shanghai" },
  es: { currency: "EUR", timeZone: "Europe/Madrid" },
  ja: { currency: "JPY", timeZone: "Asia/Tokyo" },
};

export function resolveCurrency(locale: string): Currency {
  const defaults =
    localeRegionalDefaults[locale as keyof typeof localeRegionalDefaults];
  return defaults?.currency ?? "USD";
}

export function resolveTimeZone(locale: string): AppTimeZone {
  const defaults =
    localeRegionalDefaults[locale as keyof typeof localeRegionalDefaults];
  return defaults?.timeZone ?? "America/New_York";
}

export function createRegionalFormats(currency: Currency) {
  return {
    dateTime: {
      short: {
        dateStyle: "medium" as const,
        timeStyle: "short" as const,
      },
      long: {
        dateStyle: "full" as const,
        timeStyle: "long" as const,
      },
    },
    number: {
      currency: {
        style: "currency" as const,
        currency,
      },
      price: {
        style: "currency" as const,
        currency,
        maximumFractionDigits: 2,
      },
      compact: {
        notation: "compact" as const,
        maximumFractionDigits: 1,
      },
    },
  };
}
