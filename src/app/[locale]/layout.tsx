import { DirectionProvider } from "@radix-ui/react-direction";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import { localeConfig } from "@/i18n/locales";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { createLocalizedMetadata } from "@/lib/site";
import {
  resolveSSRTheme,
  THEME_COOKIE_NAME,
} from "@/lib/theme";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  // Only code blocks use it, so do not preload it on every page.
  preload: false,
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

  const useGeist = localeConfig[locale].font === "geist";

  const cookieStore = await cookies();
  const initialTheme = resolveSSRTheme(cookieStore.get(THEME_COOKIE_NAME)?.value);

  return (
    <html
      lang={localeConfig[locale].languageTag}
      dir={localeConfig[locale].dir}
      className={initialTheme}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${useGeist ? "font-sans [font-synthesis:none]" : ""} antialiased`}
      >
        <ThemeProvider initialTheme={initialTheme}>
          {/* Radix menus and tabs read direction from here, not from the DOM. */}
          <DirectionProvider dir={localeConfig[locale].dir}>
            {/* Inherits the locale, messages, time zone, and formats from src/i18n/request.ts */}
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </DirectionProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

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
  return createLocalizedMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    pathname: "/",
  });
}
