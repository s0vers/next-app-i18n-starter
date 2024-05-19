import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
const locales = ["en", "ar"];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    // Fetch translations from the API
    const response = await fetch(
      `${baseUrl}/api/translations/${locale}?cb=${Date.now()}`
    );
    const translations = await response.json();

    if (!translations) {
      console.error("Translations not found for locale:", locale);
      notFound();
    }

    return {
      messages: translations,
    };
  } catch (error) {
    console.error("Error fetching translations:", error);
    notFound();
  }
});
