"use client";

import { localeConfig } from "@/i18n/locales";
import {
  useFormatter,
  useLocale,
  useNow,
  useTimeZone,
  useTranslations,
} from "next-intl";

const LICENSE_PRICE = 29.99;
const SUBSCRIPTION_PRICE = 9.99;
const USERS_COUNT = 12840;

function FormatExample({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid min-w-0 gap-1 py-3 sm:grid-cols-2 sm:items-baseline sm:gap-4">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>
      <p dir="auto" className="break-words text-sm font-medium tabular-nums text-foreground">
        {value}
      </p>
    </div>
  );
}

export default function LocalizationTab() {
  const t = useTranslations("Localization");
  const format = useFormatter();
  const locale = useLocale();
  const timeZone = useTimeZone();
  const now = useNow({ updateInterval: 30_000 });
  const defaults = localeConfig[locale];
  const lastUpdated = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const tz = (timeZone ?? defaults.timeZone).replace(/_/g, " ");

  return (
    <div className="space-y-6">
      <div className="max-w-prose space-y-2 leading-relaxed text-pretty text-muted-foreground">
        <p>{t("description")}</p>
        <p>{t("switchLanguageHint")}</p>
      </div>
      <p className="rounded-md bg-muted/60 px-3 py-2 text-sm leading-relaxed text-foreground">
        {t("localeDefaults", {
          currency: defaults.currency,
          timeZone: tz,
        })}
      </p>

      <section className="space-y-3">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">{t("currencySection")}</h4>
          <p dir="auto" className="text-lg font-semibold tabular-nums">
            {format.number(LICENSE_PRICE, "price")}
          </p>
        </div>
        <div className="divide-y border-y">
          <FormatExample
            label={t("priceMessage", { price: LICENSE_PRICE })}
            value={format.number(LICENSE_PRICE, "price")}
          />
          <FormatExample
            label={t("subscriptionPrice", { price: SUBSCRIPTION_PRICE })}
            value={format.number(SUBSCRIPTION_PRICE, "price")}
          />
          <FormatExample
            label={t("usersCount", { count: USERS_COUNT })}
            value={format.number(USERS_COUNT, "compact")}
          />
        </div>
      </section>

      <section className="space-y-3">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">{t("timeSection")}</h4>
          <p dir="auto" className="text-sm font-medium tabular-nums">
            {format.dateTime(now, "long")}
          </p>
        </div>
        <div className="divide-y border-y">
          <FormatExample
            label={t("currentDateTime")}
            value={format.dateTime(now, "short")}
          />
          <FormatExample
            label={t("relativeTime")}
            value={format.relativeTime(lastUpdated, now)}
          />
          <FormatExample
            label={t("utcReference")}
            value={format.dateTime(now, {
              timeZone: "UTC",
              dateStyle: "medium",
              timeStyle: "medium",
            })}
          />
        </div>
      </section>
    </div>
  );
}
