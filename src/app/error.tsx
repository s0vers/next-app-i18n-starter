"use client";

import { ServerCrash } from "lucide-react";
import { use, useEffect } from "react";

import { Button } from "@/components/ui/button";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default function Error({
  params,
  error,
  reset,
}: {
  params: Promise<{ locale: string }>;
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("error");

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-red-100">
        <ServerCrash className="w-10 h-10 text-red-600" />
      </div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mb-8 text-lg text-gray-600">{t("sorry")}</p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button onClick={() => reset()} variant="default">
          {t("tryAgain")}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">{t("returnHome")}</Link>
        </Button>
      </div>
    </div>
  );
}
