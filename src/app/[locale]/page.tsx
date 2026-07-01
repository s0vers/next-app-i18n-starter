import { setRequestLocale, getTranslations } from "next-intl/server";
import HomeIndex from "@/components/pages/HomeIndex";
import { getGithubStarCount } from "@/lib/github";
import { siteConfig } from "@/lib/site";

function serializeJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
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
    url: siteConfig.url,
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
      siteConfig.github,
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
