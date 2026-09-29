"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Check } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeConfig } from "@/i18n/locales";
import { routing } from "@/i18n/routing";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLanguage = useLocale();
  const [keyboardMenu, setKeyboardMenu] = useState(false);

  return (
    <DropdownMenu dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="min-h-11 px-3"
          onKeyDown={() => setKeyboardMenu(true)}
          onPointerDown={() => setKeyboardMenu(false)}
        >
          {localeConfig[currentLanguage].label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onKeyDown={() => setKeyboardMenu(true)}
        style={keyboardMenu ? { animation: "none" } : undefined}
      >
        {routing.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            className="min-h-11 justify-between"
            onClick={() => router.replace(pathname, { locale })}
            aria-current={locale === currentLanguage ? "true" : undefined}
          >
            {localeConfig[locale].label}
            {locale === currentLanguage && <Check className="size-4" aria-hidden />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
