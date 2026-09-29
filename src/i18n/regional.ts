import type { Currency } from "./locales";

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
