import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import HomeIndex from "@/components/pages/HomeIndex";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  // Enable static rendering
  setRequestLocale(locale);

  return <HomeIndex />;
}
