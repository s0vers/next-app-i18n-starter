import { LocalSwitcher } from "@/components/LanguageToggle";
import { ModeToggle } from "@/components/ModeToggle";
import OmitRTL from "@/components/OmmitRlt";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import Link from "next/link";

export default function Home({
	params: { locale },
}: Readonly<{ params: { locale: string } }>) {
	unstable_setRequestLocale(locale);
	const t = useTranslations("Index");
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<ModeToggle />
			<LocalSwitcher />
			<h1 className="text-2xl font-semibold text-center">{t("title")}</h1>
			<OmitRTL omitRTL={true}>
				<Link
					href="tel:+1234567890"
					className="text-2xl font-semibold text-center"
				>
					+1234567890
				</Link>
			</OmitRTL>
		</main>
	);
}
