import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { localeConfig } from "./locales";
import { createRegionalFormats } from "./regional";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const { currency, timeZone } = localeConfig[locale];

  return {
    locale,
    timeZone,
    now: new Date(),
    formats: createRegionalFormats(currency),
    messages: (await import(`../../dictionary/${locale}.json`)).default,
  };
});
