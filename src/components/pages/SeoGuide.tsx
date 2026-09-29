import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
      className="container mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8"
    >
      <Card className="gap-5 border-border/80 py-5 shadow-none sm:gap-6 sm:py-6">
        <CardHeader className="gap-2 px-4 sm:px-6">
          <h2
            id="launch-checklist-title"
            className="text-2xl font-bold leading-tight tracking-tight text-balance"
          >
            {t("title")}
          </h2>
          <p className="max-w-prose leading-relaxed text-pretty text-muted-foreground">
            {t("description")}
          </p>
        </CardHeader>

        <CardContent className="px-4 sm:px-6">
          <ol className="grid gap-6 sm:grid-cols-3 sm:gap-0">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="space-y-3 sm:px-6 sm:first:ps-0 sm:last:pe-0 sm:[&:not(:first-child)]:border-s sm:[&:not(:first-child)]:border-border/70"
              >
                <span
                  aria-hidden="true"
                  className="flex size-7 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground"
                >
                  {index + 1}
                </span>
                <h3 className="font-semibold leading-snug">{step.title}</h3>
                <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </section>
  );
}
