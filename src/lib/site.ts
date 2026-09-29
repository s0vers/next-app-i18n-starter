import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/locales";
import { localeConfig } from "@/i18n/locales";
import { routing } from "@/i18n/routing";

function getSiteOrigin() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL must be set to the production site's HTTPS origin.",
      );
    }

    return "http://localhost:3000";
  }

  let url: URL;
  try {
    url = new URL(configuredUrl);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be a valid absolute URL origin.");
  }

  if (
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must contain only the site origin, without credentials, path, query, or fragment.",
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTP or HTTPS.");
  }

  if (process.env.NODE_ENV === "production") {
    if (url.protocol !== "https:") {
      throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS in production.");
    }

    const hostname = url.hostname.toLowerCase();
    const isPlaceholder =
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]" ||
      hostname === "your-domain.com" ||
      hostname.endsWith(".your-domain.com") ||
      ["example.com", "example.net", "example.org"].some(
        (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
      );

    if (isPlaceholder) {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL must be set to your production domain, not a local or placeholder URL.",
      );
    }
  }

  return url.origin;
}

export const siteConfig = {
  name: "Next.js 16 i18n Starter",
  url: getSiteOrigin(),
  github: "https://github.com/s0vers/next-app-i18n-starter",
  author: {
    name: "Sovers Tonmoy Pandey",
    alias: "s0vers",
    url: "https://s0vers.com/",
    twitter: "@s0ver5",
    github: "https://github.com/s0vers",
  },
  googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION,
} as const;

export function getLocaleUrl(
  locale: AppLocale,
  href: "/" | `/${string}` = "/",
) {
  const pathname = getPathname({ locale, href });
  return new URL(pathname, siteConfig.url).toString();
}

export function getAlternateLanguages(href: "/" | `/${string}` = "/") {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [
      localeConfig[locale].languageTag,
      getLocaleUrl(locale, href),
    ]),
  );

  return {
    ...languages,
    "x-default": getLocaleUrl(routing.defaultLocale, href),
  };
}

export function createLocalizedMetadata({
  locale,
  title,
  description,
  pathname,
}: {
  locale: AppLocale;
  title: string;
  description: string;
  pathname: "/" | `/${string}`;
}): Metadata {
  const canonical = getLocaleUrl(locale, pathname);
  const image = "/og-image.png";

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    creator: siteConfig.author.twitter,
    applicationName: siteConfig.name,
    verification: siteConfig.googleSiteVerification
      ? { google: siteConfig.googleSiteVerification }
      : undefined,
    alternates: {
      canonical,
      languages: getAlternateLanguages(pathname),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: localeConfig[locale].ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: siteConfig.author.twitter,
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
