"use client";

import { ServerCrash } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useTranslations("Index.error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60dvh] px-4 text-center">
      <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-destructive/10">
        <ServerCrash className="w-10 h-10 text-destructive" />
      </div>
      <h1 className="mb-2 text-3xl font-bold leading-(--leading-heading) tracking-(--tracking-heading) text-balance sm:text-4xl">
        {t("server")}
      </h1>
      <p className="mb-8 max-w-prose text-lg leading-relaxed text-pretty text-muted-foreground">{t("sorry")}</p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button onClick={() => retry()} variant="default">
          {t("tryAgain")}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">{t("returnHome")}</Link>
        </Button>
      </div>
    </div>
  );
}
