import { unstable_setRequestLocale } from "next-intl/server";
import HomeIndex from "@/components/pages/HomeIndex";

export default function Home({
  params: { locale },
}: Readonly<{ params: { locale: string } }>) {
  unstable_setRequestLocale(locale);
  return <HomeIndex />;
}
