import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://i18n-nextjs-boilerplate.vercel.app";
  const locales = ["en", "ar"];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "yearly" as "yearly", // Explicitly type the string
      priority: 1,
    },
    ...locales.map((locale) => ({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as "monthly", // Explicitly type the string
      priority: 0.8,
    })),
  ];
}
