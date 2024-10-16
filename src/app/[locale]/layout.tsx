import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import {
  getMessages,
  getTranslations,
  unstable_setRequestLocale,
} from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { jsonLdScriptProps } from "react-schemaorg";
import { WebSite } from "schema-dts";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  unstable_setRequestLocale(locale);

  const isArabic = locale === "ar";

  return (
    <html lang={locale} dir={isArabic ? "rtl" : "ltr"}>
      <head>
        <link
          rel="canonical"
          href={`https://i18n-nextjs-boilerplate.vercel.app/${locale}`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          {...jsonLdScriptProps<WebSite>({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Next.js i18n Boilerplate",
            description:
              "A humble Next.js starter with i18n, shadcn UI, light/dark themes, and language switch.",
            url: "https://i18n-nextjs-boilerplate.vercel.app",
          })}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

const locales = ["en", "ar"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://i18n-nextjs-boilerplate.vercel.app`,
      siteName: "Next.js i18n Boilerplate",
      images: [
        {
          url: "https://i18n-nextjs-boilerplate.vercel.app/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["https://i18n-nextjs-boilerplate.vercel.app/og-image.png"],
    },
    alternates: {
      canonical: `https://i18n-nextjs-boilerplate.vercel.app`,
      languages: {
        en: "https://i18n-nextjs-boilerplate.vercel.app/en",
        ar: "https://i18n-nextjs-boilerplate.vercel.app/ar",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
