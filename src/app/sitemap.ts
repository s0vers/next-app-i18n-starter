import { MetadataRoute } from "next";
import { getAlternateLanguages, siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: await getAlternateLanguages() },
    },
  ];
}
