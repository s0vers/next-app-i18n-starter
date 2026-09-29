import * as rootParams from "next/root-params";
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { localeConfig } from "./locales";
import { createRegionalFormats } from "./regional";

export default getRequestConfig(async ({ locale }) => {
  // Page renders read the locale from the [locale] route segment. Route
  // Handlers and Server Actions pass one explicitly.
  const requested = locale ?? (await rootParams.locale());
  if (!hasLocale(routing.locales, requested)) notFound();

  const { currency, timeZone } = localeConfig[requested];

  return {
    locale: requested,
    timeZone,
    now: new Date(),
    formats: createRegionalFormats(currency),
    messages: (await import(`../../dictionary/${requested}.json`)).default,
  };
});
