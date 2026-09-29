import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { ModeToggle } from "./ModeToggle";

// Rendered by the locale layout, so the home page, the 404 page, and the error
// page all share it. A Server Component: only the two controls are client code.
export function SiteHeader() {
  const t = useTranslations("Index");

  return (
    <header className="w-full shrink-0 border-b bg-background">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-h-11 min-w-0 items-center gap-2 text-base font-bold transition-colors duration-150 ease-out motion-reduce:transition-none hover:text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:text-lg"
          title={t("boilerplateName")}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
            <Globe className="size-4" aria-hidden />
          </span>
          <span className="truncate">{t("boilerplateName")}</span>
        </Link>
        <div
          className="flex shrink-0 gap-1 sm:gap-2"
          role="group"
          aria-label={t("settings")}
        >
          <LanguageSwitcher />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
