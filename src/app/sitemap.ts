import { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const languages = Object.fromEntries(
    await Promise.all(
      routing.locales.map(async (locale) => [
        locale,
        new URL(
          await getPathname({ locale, href: "/" }),
          siteConfig.url,
        ).toString(),
      ]),
    ),
  );

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
    },
  ];
}
