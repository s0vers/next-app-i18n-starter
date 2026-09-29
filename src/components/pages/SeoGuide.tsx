import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";

export default async function SeoGuide({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "SeoGuide" });
  const steps = [
    { title: t("step1Title"), description: t("step1Description") },
    { title: t("step2Title"), description: t("step2Description") },
    { title: t("step3Title"), description: t("step3Description") },
  ];

  return (
    <section
      aria-labelledby="launch-checklist-title"
      className="container mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl space-y-6 border-t border-border/70 pt-8">
        <div className="space-y-2">
          <h2
            id="launch-checklist-title"
            className="text-2xl font-semibold tracking-tight text-balance"
          >
            {t("title")}
          </h2>
          <p className="leading-relaxed text-pretty text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <ol className="grid gap-5 sm:grid-cols-3">
          {steps.map((step) => (
            <li key={step.title} className="space-y-2">
              <h3 className="font-medium">{step.title}</h3>
              <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
