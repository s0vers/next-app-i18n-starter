"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeConfig } from "@/i18n/locales";
import { routing } from "@/i18n/routing";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLanguage = useLocale();
  const t = useTranslations("Index");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          /* The name says what the button does. Without it a screen reader only hears the current language. */
          <Button
            variant="outline"
            size="sm"
            className="min-h-11 px-3"
            aria-label={`${t("language")}: ${localeConfig[currentLanguage].label}`}
          />
        }
      >
        {localeConfig[currentLanguage].label}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Radio items expose the current language to assistive tech (aria-checked). */}
        <DropdownMenuRadioGroup
          value={currentLanguage}
          onValueChange={(locale) =>
            router.replace(pathname, { locale: locale as typeof routing.locales[number] })
          }
        >
          {routing.locales.map((locale) => (
            <DropdownMenuRadioItem
              key={locale}
              value={locale}
              className="min-h-11"
              // Each name is written in its own language, so mark it for screen readers.
              lang={localeConfig[locale].languageTag}
            >
              {localeConfig[locale].label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
