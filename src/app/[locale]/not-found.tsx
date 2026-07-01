import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        {t("description")}
      </p>
      <Button asChild>
        <Link href="/">{t("homeLink")}</Link>
      </Button>
    </div>
  );
}
