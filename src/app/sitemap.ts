import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://next-app-i18n-starter.vercel.app";
  const locales = ["en", "ar", "zh", "es", "jp"] as const;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    ...locales.map((locale) => ({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
