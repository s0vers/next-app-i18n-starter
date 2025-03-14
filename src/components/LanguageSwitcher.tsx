"use client";

import { memo } from "react";
import { useTransition } from "react";

import { useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/navigation";

// Define language options as a constant to avoid recreating on each render
const LANGUAGE_OPTIONS = [
  { value: "en", label: "EN" },
  { value: "ar", label: "AR" },
] as const;

type Locale = (typeof LANGUAGE_OPTIONS)[number]["value"];

// Memoized language option component
const LanguageOption = memo(({ label }: { label: string }) => (
  <div className="flex gap-2 items-center">
    <span className=" font-normal">{label}</span>
  </div>
));

LanguageOption.displayName = "LanguageOption";

function LanguageSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as Locale;

  const handleLocaleChange = (nextLocale: string) => {
    startTransition(() => {
      router.replace({ pathname }, { locale: nextLocale as Locale });
    });
  };

  return (
    <Select
      defaultValue={currentLocale}
      onValueChange={handleLocaleChange}
      disabled={isPending}
    >
      <SelectTrigger
        className={`bg-transparent gap-x-4 border-none h-auto ${
          isPending ? "opacity-50" : ""
        }`}
      >
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {LANGUAGE_OPTIONS.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              <LanguageOption label={label} />
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default memo(LanguageSwitcher);
