"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LocalSwitcher() {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const localActive = useLocale();

  const onSelectChange = (nextLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = nextLocale; // Replace the current locale with the next one
    const newPath = segments.join("/");

    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <label className="border-2 rounded-2xl py-2">
          <p className="sr-only">change language</p>
          <span className="bg-transparent text-2xl p-4">{localActive}</span>
        </label>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSelectChange("en")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelectChange("ar")}>
          العربية
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelectChange("fr")}>
          Français
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
