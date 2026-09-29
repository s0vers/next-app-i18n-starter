import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import {
  getMessages,
  getNow,
  getTimeZone,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import { localeConfig } from "@/i18n/locales";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  getAlternateLanguages,
  getLocaleUrl,
  siteConfig,
} from "@/lib/site";
import {
  resolveSSRTheme,
  THEME_COOKIE_NAME,
} from "@/lib/theme";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const isArabic = locale === "ar";
  const useGeist = localeConfig[locale].font === "geist";
  const messages = await getMessages();
  const timeZone = await getTimeZone();
  const now = await getNow();

  const cookieStore = await cookies();
  const initialTheme = resolveSSRTheme(cookieStore.get(THEME_COOKIE_NAME)?.value);

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      className={initialTheme}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${useGeist ? "font-sans" : ""} antialiased [font-synthesis:none]`}
      >
        <ThemeProvider initialTheme={initialTheme}>
          <NextIntlClientProvider messages={messages} timeZone={timeZone} now={now}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const canonical = getLocaleUrl(locale);
  const languages = getAlternateLanguages();

  return {
    metadataBase: new URL(siteConfig.url),
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    creator: siteConfig.author.twitter,
    applicationName: siteConfig.name,
    verification: {
      google: "sVYBYfSJfXdBca3QoqsZtD6lsWVH6sk02RCH4YAbcm8",
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonical,
      siteName: siteConfig.name,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
      locale: localeConfig[locale].ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.png"],
      creator: siteConfig.author.twitter,
    },
    alternates: {
      canonical,
      languages,
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
