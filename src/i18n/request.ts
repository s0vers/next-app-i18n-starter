import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import {
  createRegionalFormats,
  resolveCurrency,
  resolveTimeZone,
} from "./regional";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const currency = resolveCurrency(locale);
  const timeZone = resolveTimeZone(locale);

  return {
    locale,
    timeZone,
    now: new Date(),
    formats: createRegionalFormats(currency),
    messages: (await import(`../../dictionary/${locale}.json`)).default,
  };
});
