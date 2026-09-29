import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import HomeIndex from "@/components/pages/HomeIndex";
import { getGithubStarCount } from "@/lib/github";
import { getLocaleUrl, siteConfig } from "@/lib/site";
import { routing } from "@/i18n/routing";

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
  setRequestLocale(locale);

  const [t, starCount] = await Promise.all([
    getTranslations({ locale, namespace: "Metadata" }),
    getGithubStarCount(),
  ]);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: t("description"),
    url: getLocaleUrl(locale),
    inLanguage: locale,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  };

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    alternateName: siteConfig.author.alias,
    url: siteConfig.author.url,
    sameAs: [
      siteConfig.author.github,
      `https://twitter.com/${siteConfig.author.twitter.replace("@", "")}`,
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }}
      />
      <HomeIndex starCount={starCount} />
    </>
  );
}
