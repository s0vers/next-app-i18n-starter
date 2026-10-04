import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import HomeIndex from "@/components/pages/HomeIndex";
import { getGithubStarCount } from "@/lib/github";
import { siteConfig } from "@/lib/site";
import { routing } from "@/i18n/routing";
import SeoGuide from "@/components/pages/SeoGuide";

function serializeJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const starCount = await getGithubStarCount();

  const websiteJsonLd =
    locale === routing.defaultLocale
      ? {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.name,
          alternateName: "Next.js i18n Template",
          url: siteConfig.url,
          inLanguage: locale,
        }
      : null;

  return (
    <>
      {websiteJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }}
        />
      )}
      <HomeIndex starCount={starCount} />
      <SeoGuide locale={locale} />
    </>
  );
}
