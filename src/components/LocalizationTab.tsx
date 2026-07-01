"use client";

import { localeRegionalDefaults } from "@/i18n/regional";
import {
  useFormatter,
  useLocale,
  useNow,
  useTimeZone,
  useTranslations,
} from "next-intl";
import OmitRTL from "./OmmitRlt";

const LICENSE_PRICE = 29.99;
const SUBSCRIPTION_PRICE = 9.99;
const USERS_COUNT = 12840;

function FormatExample({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground sm:text-sm">
        {label}
      </p>
      <OmitRTL omitRTL>
        <p className="rounded bg-muted/50 px-2 py-2 font-mono text-xs sm:px-3 sm:text-sm">
          {value}
        </p>
      </OmitRTL>
    </div>
  );
}

export default function LocalizationTab() {
  const t = useTranslations("Localization");
  const format = useFormatter();
  const locale = useLocale();
  const timeZone = useTimeZone();
  const now = useNow({ updateInterval: 30_000 });
  const defaults =
    localeRegionalDefaults[locale as keyof typeof localeRegionalDefaults];
  const lastUpdated = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const tz = (timeZone ?? defaults.timeZone).replace(/_/g, " ");

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t("description")}</p>
      <p className="text-sm text-muted-foreground">{t("switchLanguageHint")}</p>
      <p className="text-sm text-muted-foreground">
        {t("localeDefaults", {
          currency: defaults.currency,
          timeZone: tz,
        })}
      </p>

      <FormatExample
        label={t("currencySection")}
        value={format.number(LICENSE_PRICE, "price")}
      />
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
      <FormatExample
        label={t("timeSection")}
        value={format.dateTime(now, "long")}
      />
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
  );
}
