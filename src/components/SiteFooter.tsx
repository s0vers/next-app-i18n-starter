import { useTranslations } from "next-intl";

import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="w-full shrink-0 border-t bg-background">
      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-2 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <p>{t("copyright")}</p>
        <a
          href={siteConfig.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 min-w-11 items-center justify-center decoration-from-font [text-underline-position:from-font] hover:text-primary hover:underline"
        >
          {t("githubLink")}
        </a>
      </div>
    </footer>
  );
}
