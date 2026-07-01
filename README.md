# Next.js 16 i18n Starter

A production-ready boilerplate for multilingual Next.js applications. Built with **Next.js 16**, **React 19**, **next-intl 4**, and **shadcn/ui** — with locale-driven currency and date formatting, RTL support, cookie-based theme SSR, and full SEO.

**Author:** [Sovers Tonmoy Pandey](https://s0vers.com) (S0vers) · [GitHub](https://github.com/S0vers) · [@s0ver5](https://twitter.com/s0ver5)

**Live demo:** [next-app-i18n-starter.vercel.app](https://next-app-i18n-starter.vercel.app)

---

## Table of contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Internationalization](#internationalization)
  - [How routing works](#how-routing-works)
  - [Locale-driven formatting](#locale-driven-formatting)
  - [Translation files](#translation-files)
  - [Server vs client components](#server-vs-client-components)
  - [Adding a new language](#adding-a-new-language)
  - [Adding a new page](#adding-a-new-page)
- [OmitRTL](#omitrtl)
- [Theme system](#theme-system)
- [SEO](#seo)
  - [SEO architecture overview](#seo-architecture-overview)
  - [Central site config](#central-site-config)
  - [Metadata API (generateMetadata)](#metadata-api-generatemetadata)
  - [Locale-aware URLs and hreflang](#locale-aware-urls-and-hreflang)
  - [Translation-driven metadata](#translation-driven-metadata)
  - [HTML semantics (lang and dir)](#html-semantics-lang-and-dir)
  - [JSON-LD structured data](#json-ld-structured-data)
  - [Sitemap](#sitemap)
  - [Robots.txt](#robotstxt)
  - [Open Graph and Twitter Cards](#open-graph-and-twitter-cards)
  - [Open Graph image](#open-graph-image)
  - [Google Search Console verification](#google-search-console-verification)
  - [Adding SEO to a new page](#adding-seo-to-a-new-page)
  - [Production SEO checklist](#production-seo-checklist)
  - [Verifying SEO output](#verifying-seo-output)
- [Environment variables](#environment-variables)
- [Deployment](#deployment)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Features


| Area           | What's included                                                             |
| -------------- | --------------------------------------------------------------------------- |
| **Framework**  | Next.js 16 App Router, Server Components, Turbopack dev server              |
| **i18n**       | next-intl 4 — ICU messages, `useFormatter`, locale-driven currency/timezone |
| **Languages**  | English, Arabic (RTL), Chinese, Spanish, Japanese                           |
| **Formatting** | Currency, dates, compact numbers, relative time — all driven by locale      |
| **UI**         | shadcn/ui components, Tailwind CSS 4, light/dark theme                      |
| **RTL**        | Automatic `dir="rtl"` for Arabic + `OmitRTL` utility for LTR islands        |
| **SEO**        | `metadataBase`, hreflang, JSON-LD, dynamic sitemap/robots, OG image         |
| **DX**         | TypeScript, typed translation keys via `global.d.ts`, ESLint flat config    |


---

## Prerequisites

- [Bun](https://bun.sh) 1.x (recommended) or Node.js 24+
- Basic familiarity with Next.js App Router and React Server Components

---

## Getting started

```bash
# Clone
git clone https://github.com/S0vers/next-app-i18n-starter.git
cd next-app-i18n-starter

# Install
bun install

# Optional: set production URL for local SEO preview
cp .env.example .env.local
# Edit .env.local → NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Run
bun dev
```

Open [http://localhost:3000](http://localhost:3000). Use the language switcher in the header to see translations and regional formatting update.

---

## Project structure

```
next-app-i18n-starter/
├── dictionary/                     # Translation JSON files
│   ├── en.json                     # English (TypeScript source of truth)
│   ├── ar.json                     # Arabic
│   ├── zh.json                     # Chinese
│   ├── es.json                     # Spanish
│   └── ja.json                     # Japanese
├── public/
│   ├── llms.txt                    # Machine-readable context for AI tools
│   ├── og-image.png                # Open Graph image (1200×630)
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── [locale]/               # All pages are locale-scoped
│   │   │   ├── layout.tsx          # Metadata, theme SSR, providers
│   │   │   ├── page.tsx            # Home + JSON-LD structured data
│   │   │   ├── not-found.tsx       # Localized 404
│   │   │   └── [...rest]/          # Catch-all → not-found
│   │   ├── globals.css             # Tailwind + CSS variables
│   │   ├── robots.ts               # Dynamic robots.txt
│   │   └── sitemap.ts              # Sitemap with hreflang alternates
│   ├── components/
│   │   ├── pages/HomeIndex.tsx     # Landing page (hero + tabs)
│   │   ├── LocalizationTab.tsx     # Locale formatting demo
│   │   ├── LanguageSwitcher.tsx    # Locale dropdown
│   │   ├── ModeToggle.tsx          # Light/dark toggle
│   │   ├── OmmitRlt.tsx            # OmitRTL utility
│   │   ├── theme-provider.tsx      # Client theme context
│   │   └── ui/                     # shadcn/ui primitives
│   ├── i18n/
│   │   ├── request.ts              # getRequestConfig (core i18n setup)
│   │   ├── routing.ts              # Locales + URL prefix strategy
│   │   ├── regional.ts             # Per-locale currency & timezone
│   │   └── navigation.ts           # Localized Link, useRouter, getPathname
│   ├── lib/
│   │   ├── site.ts                 # Site URL, author, SEO constants
│   │   ├── theme.ts                # Theme cookie helpers
│   │   └── utils.ts                # cn() class merge helper
│   └── proxy.ts                    # next-intl proxy (Next.js 16)
├── .env.example
├── global.d.ts                     # Typed IntlMessages from en.json
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Internationalization

This template uses [next-intl](https://next-intl.dev) with the App Router pattern. All i18n configuration flows through three files:

1. `**src/i18n/routing.ts**` — which locales exist and how URLs are shaped
2. `**src/i18n/request.ts**` — per-request config (messages, timezone, formats)
3. `**src/i18n/navigation.ts**` — locale-aware navigation wrappers

### How routing works

Configured in `src/i18n/routing.ts`:

```ts
export const routing = defineRouting({
  locales: ["en", "ar", "zh", "es", "ja"],
  defaultLocale: "en",
  localeDetection: true,
  localePrefix: "as-needed",
});
```

With `localePrefix: "as-needed"`:


| Locale | URL   | Notes                        |
| ------ | ----- | ---------------------------- |
| `en`   | `/`   | Default locale has no prefix |
| `ar`   | `/ar` |                              |
| `zh`   | `/zh` |                              |
| `es`   | `/es` |                              |
| `ja`   | `/ja` |                              |


`src/proxy.ts` runs on every request to detect locale from URL, cookie, or `Accept-Language` header.

**Always use navigation from `@/i18n/navigation`**, not `next/link` or `next/navigation` directly:

```tsx
import { Link, useRouter, usePathname } from "@/i18n/navigation";

// Switch locale
const router = useRouter();
const pathname = usePathname();
router.replace(pathname, { locale: "ar" });
```

### Locale-driven formatting

Currency, dates, and time zones are **not** user-configurable dropdowns — they follow the active locale. This is the recommended next-intl pattern for regional formatting.

`**src/i18n/regional.ts**` maps each locale to defaults:


| Locale | Currency | Time zone        |
| ------ | -------- | ---------------- |
| `en`   | USD      | America/New_York |
| `ar`   | SAR      | Asia/Riyadh      |
| `zh`   | CNY      | Asia/Shanghai    |
| `es`   | EUR      | Europe/Madrid    |
| `ja`   | JPY      | Asia/Tokyo       |


`**src/i18n/request.ts**` applies them on every request:

```ts
export default getRequestConfig(async ({ requestLocale }) => {
  const locale = /* validated against routing.locales */;

  return {
    locale,
    timeZone: resolveTimeZone(locale),
    now: new Date(),
    formats: createRegionalFormats(resolveCurrency(locale)),
    messages: (await import(`../../dictionary/${locale}.json`)).default,
  };
});
```

**In components**, use next-intl hooks:

```tsx
"use client";
import { useFormatter, useTimeZone, useNow } from "next-intl";

const format = useFormatter();
const now = useNow({ updateInterval: 30_000 });

format.number(29.99, "price");           // → "$29.99" (en) or "¥30" (ja)
format.dateTime(now, "long");              // → locale + timezone aware
format.relativeTime(twoHoursAgo, now);     // → "2 hours ago"
```

**In translation messages**, use ICU syntax:

```json
{
  "priceMessage": "This product costs {price, number, currency}",
  "usersCount": "{count, number, compact} users"
}
```

The **Localization tab** on the home page demonstrates all of this. Switch language in the header — prices and dates update instantly.

### Translation files

All strings live in `dictionary/{locale}.json`. Namespaces:


| Namespace      | Used for                                              |
| -------------- | ----------------------------------------------------- |
| `Index`        | Landing page UI, tabs, installation steps             |
| `Footer`       | Copyright, links                                      |
| `Metadata`     | SEO title, description, keywords (`generateMetadata`) |
| `Localization` | Formatting demo tab labels                            |


TypeScript enforces key consistency via `global.d.ts`:

```ts
import en from "./dictionary/en.json";
type IntlMessages = typeof en;
```

When you add a key to `en.json`, TypeScript will error until you add it to all other locale files.

### Server vs client components

**Server Component** (page or layout):

```tsx
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale); // Required for static rendering

  const t = await getTranslations({ locale, namespace: "Index" });
  return <h1>{t("title")}</h1>;
}
```

**Client Component**:

```tsx
"use client";
import { useTranslations } from "next-intl";

export function MyComponent() {
  const t = useTranslations("Index");
  return <p>{t("description")}</p>;
}
```

The root layout wraps children in `NextIntlClientProvider` with `messages`, `timeZone`, and `now` from the server.

### Adding a new language

Example: adding French (`fr`)

1. **Create translation file**
  ```bash
   cp dictionary/en.json dictionary/fr.json
   # Translate all values in fr.json
  ```
2. **Register locale** in `src/i18n/routing.ts`:
  ```ts
   locales: ["en", "ar", "zh", "es", "ja", "fr"],
  ```
3. **Add regional defaults** in `src/i18n/regional.ts`:
  ```ts
   fr: { currency: "EUR", timeZone: "Europe/Paris" },
  ```
4. **Add UI label** in `src/components/LanguageSwitcher.tsx`:
  ```ts
   fr: "Français",
  ```
5. **Add OpenGraph locale** in `src/lib/site.ts`:
  ```ts
   fr: "fr_FR",
  ```
6. **Build** to verify types: `bun run build`

### Adding a new page

```tsx
// src/app/[locale]/about/page.tsx
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "About" });

  return <h1>{t("title")}</h1>;
}
```

Add `"About"` namespace to every `dictionary/*.json`. Link to it with:

```tsx
import { Link } from "@/i18n/navigation";
<Link href="/about">{t("aboutLink")}</Link>
```

---

## OmitRTL

Arabic sets `dir="rtl"` on `<html>`. Some content (code, terminal commands, logos, formatted numbers) should stay left-to-right.

Wrap those elements with `OmitRTL`:

```tsx
import OmitRTL from "@/components/OmmitRlt";

function CodeBlock({ code }: { code: string }) {
  return (
    <OmitRTL omitRTL>
      <pre><code>{code}</code></pre>
    </OmitRTL>
  );
}
```

The same utility is published as `[react-omit-rtl](https://www.npmjs.com/package/react-omit-rtl)` on npm.

---

## Theme system

Light/dark mode without flash-of-unstyled-content and without `<script>` tags (React 19 compatible).

**How it works:**

1. **Server** (`layout.tsx`) reads the `theme` cookie and sets `className="light"` or `"dark"` on `<html>` before paint.
2. **Client** (`theme-provider.tsx`) syncs toggles to cookie + `localStorage` via `useSyncExternalStore` for system preference.
3. **Toggle** (`ModeToggle.tsx`) switches between `light` and `dark`.

No blocking scripts. No `next-themes` dependency.

---

## SEO

This template ships with a complete, locale-aware SEO setup using the Next.js 16 Metadata API, next-intl URL helpers, JSON-LD structured data, and dynamic sitemap/robots generation. Everything is designed to work correctly with `localePrefix: "as-needed"` routing.

### SEO architecture overview

```
┌─────────────────────────────────────────────────────────────────┐
│  src/lib/site.ts                                                │
│  siteConfig.url, author, openGraphLocales                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
  layout.tsx          page.tsx          sitemap.ts / robots.ts
  generateMetadata    JSON-LD           crawl directives
  (head tags)         (structured data)
         │
         ▼
  dictionary/{locale}/Metadata  ←  translated title, description, keywords
         │
         ▼
  getPathname({ locale, href })  ←  correct URLs per locale (as-needed)
```

**Files involved:**


| File                          | SEO responsibility                                                      |
| ----------------------------- | ----------------------------------------------------------------------- |
| `src/lib/site.ts`             | Site name, canonical base URL, author info, OpenGraph BCP 47 locale map |
| `src/app/[locale]/layout.tsx` | `generateMetadata` — all `<head>` meta tags per locale                  |
| `src/app/[locale]/page.tsx`   | JSON-LD `WebSite` + `Person` schemas on home page                       |
| `src/app/sitemap.ts`          | `/sitemap.xml` with hreflang language alternates                        |
| `src/app/robots.ts`           | `/robots.txt` with sitemap reference                                    |
| `dictionary/*/Metadata`       | Locale-specific `title`, `description`, `keywords`                      |
| `public/og-image.png`         | Social sharing preview image (1200×630)                                 |
| `public/llms.txt`             | Machine-readable project docs for AI crawlers                           |


### Central site config

All hardcoded SEO values live in one place — `src/lib/site.ts`:

```ts
export const siteConfig = {
  name: "Next.js i18n Starter",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://next-app-i18n-starter.vercel.app",
  github: "https://github.com/S0vers/next-app-i18n-starter",
  author: {
    name: "Sovers Tonmoy Pandey",
    alias: "S0vers",
    url: "https://s0vers.com",
    twitter: "@s0ver5",
    github: "https://github.com/S0vers",
  },
} as const;

export const openGraphLocales: Record<string, string> = {
  en: "en_US",
  ar: "ar_SA",
  zh: "zh_CN",
  es: "es_ES",
  ja: "ja_JP",
};
```

Set `NEXT_PUBLIC_SITE_URL` in production so `metadataBase`, canonical URLs, sitemap entries, and OG absolute URLs all resolve to your real domain.

### Metadata API (`generateMetadata`)

Defined in `src/app/[locale]/layout.tsx`. Next.js calls this per locale at build/request time and injects the result into `<head>`.

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const canonical = await getLocaleUrl(locale);

  const languages = Object.fromEntries(
    await Promise.all(
      routing.locales.map(async (l) => [l, await getLocaleUrl(l)]),
    ),
  );

  return {
    metadataBase: new URL(siteConfig.url),
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    creator: siteConfig.author.twitter,
    applicationName: siteConfig.name,
    openGraph: { /* see below */ },
    twitter: { /* see below */ },
    alternates: { canonical, languages },
    robots: { index: true, follow: true, /* googleBot directives */ },
    other: { "google-site-verification": "..." },
  };
}
```

**What each field produces in HTML:**


| Metadata field         | Rendered output                         | Purpose                                            |
| ---------------------- | --------------------------------------- | -------------------------------------------------- |
| `metadataBase`         | Base for resolving relative URLs        | Makes `/og-image.png` resolve to full absolute URL |
| `title`                | `<title>`                               | Browser tab + search result headline               |
| `description`          | `<meta name="description">`             | Search snippet text                                |
| `keywords`             | `<meta name="keywords">`                | Legacy keyword hint (low weight today)             |
| `authors`              | `<meta name="author">`                  | Content author attribution                         |
| `creator`              | `<meta name="creator">`                 | Creator handle (@s0ver5)                           |
| `applicationName`      | `<meta name="application-name">`        | PWA / app identity                                 |
| `alternates.canonical` | `<link rel="canonical">`                | Preferred URL for this locale's page               |
| `alternates.languages` | `<link rel="alternate" hreflang="...">` | Tells Google about all language versions           |
| `openGraph.*`          | `<meta property="og:...">`              | Facebook, LinkedIn, Discord, iMessage previews     |
| `twitter.*`            | `<meta name="twitter:...">`             | Twitter/X card previews                            |
| `robots`               | `<meta name="robots">`                  | Crawl/index directives for all bots                |
| `robots.googleBot`     | `<meta name="googlebot">`               | Google-specific preview snippet settings           |


### Locale-aware URLs and hreflang

The helper `getLocaleUrl` in `layout.tsx` builds correct absolute URLs using next-intl's `getPathname`:

```ts
async function getLocaleUrl(locale: string) {
  const pathname = await getPathname({ locale, href: "/" });
  return new URL(pathname, siteConfig.url).toString();
}
```

Because routing uses `localePrefix: "as-needed"`, paths differ per locale:


| Locale | `getPathname` result | Full canonical URL (example) |
| ------ | -------------------- | ---------------------------- |
| `en`   | `/`                  | `https://your-domain.com/`   |
| `ar`   | `/ar`                | `https://your-domain.com/ar` |
| `zh`   | `/zh`                | `https://your-domain.com/zh` |
| `es`   | `/es`                | `https://your-domain.com/es` |
| `ja`   | `/ja`                | `https://your-domain.com/ja` |


**Why `getPathname` matters:** Hardcoding `/en`, `/ar` breaks with `as-needed` (English has no prefix). Always use `getPathname` for canonical, hreflang, and sitemap URLs.

`alternates.languages` produces hreflang tags like:

```html
<link rel="alternate" hreflang="en" href="https://your-domain.com/" />
<link rel="alternate" hreflang="ar" href="https://your-domain.com/ar" />
<link rel="alternate" hreflang="zh" href="https://your-domain.com/zh" />
<link rel="alternate" hreflang="es" href="https://your-domain.com/es" />
<link rel="alternate" hreflang="ja" href="https://your-domain.com/ja" />
```

Each locale's page includes hreflang links pointing to **all** language versions, including itself. This helps search engines serve the correct language to users.

### Translation-driven metadata

SEO text is not hardcoded in components — it comes from the `Metadata` namespace in each dictionary file:

```json
// dictionary/en.json
"Metadata": {
  "title": "Next.js 16 i18n Starter - Multilingual Template by S0vers",
  "description": "Next.js 16 internationalization starter with next-intl 4...",
  "keywords": "Next.js 16, next-intl, i18n, internationalization..."
}
```

Every locale (`ar.json`, `zh.json`, `es.json`, `ja.json`) has its own translated `Metadata` block. When a user visits `/ar`, Arabic title and description are served — not English with an Arabic URL.

To update SEO copy: edit `dictionary/{locale}/Metadata` in all 5 files, then rebuild.

### HTML semantics (`lang` and `dir`)

The root layout sets semantic HTML attributes on `<html>`:

```tsx
<html
  lang={locale}           // e.g. "ar", "ja" — BCP 47 language tag
  dir={isArabic ? "rtl" : "ltr"}  // text direction for the whole document
  className={ssrTheme}
>
```

Search engines and screen readers use `lang` to identify page language. `dir="rtl"` for Arabic ensures correct text flow without affecting SEO negatively — Google fully indexes RTL pages.

`generateStaticParams` pre-renders all locale variants at build time:

```ts
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
```

### JSON-LD structured data

The home page (`src/app/[locale]/page.tsx`) emits two JSON-LD blocks as server-rendered `<script type="application/ld+json">` tags. This follows the [official Next.js JSON-LD guide](https://nextjs.org/docs/app/guides/json-ld) — no `next/script`, no `react-schemaorg`, React 19 safe.

**Serialization helper (XSS prevention):**

```ts
function serializeJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
```

Escaping `<` prevents script injection if user-controlled strings ever end up in schema data.

**WebSite schema** (one per locale visit):

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Next.js i18n Starter",
  "description": "<locale-specific from Metadata namespace>",
  "url": "https://your-domain.com",
  "inLanguage": "ar",
  "author": {
    "@type": "Person",
    "name": "Sovers Tonmoy Pandey",
    "url": "https://s0vers.com"
  }
}
```

**Person schema** (author, same on all locales):

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Sovers Tonmoy Pandey",
  "alternateName": "S0vers",
  "url": "https://s0vers.com",
  "sameAs": [
    "https://github.com/S0vers",
    "https://twitter.com/s0ver5",
    "https://github.com/S0vers/next-app-i18n-starter"
  ]
}
```

Validate with [Google Rich Results Test](https://search.google.com/test/rich-results) or [Schema Markup Validator](https://validator.schema.org/).

### Sitemap

`src/app/sitemap.ts` generates `/sitemap.xml` at build time.

```ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const languages = Object.fromEntries(
    await Promise.all(
      routing.locales.map(async (locale) => [
        locale,
        new URL(await getPathname({ locale, href: "/" }), siteConfig.url).toString(),
      ]),
    ),
  );

  return [{
    url: siteConfig.url,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }];
}
```

**Design decision:** One sitemap entry (the site root) with `alternates.languages` for all locales — not separate rows per locale. This matches the [next-intl sitemap pattern](https://next-intl.dev/docs/environments/actions-metadata-route-handlers#sitemap) and avoids duplicate-content signals.

Example output structure:

```xml
<url>
  <loc>https://your-domain.com</loc>
  <lastmod>2026-06-30</lastmod>
  <changefreq>monthly</changefreq>
  <priority>1</priority>
  <xhtml:link rel="alternate" hreflang="en" href="https://your-domain.com/" />
  <xhtml:link rel="alternate" hreflang="ar" href="https://your-domain.com/ar" />
  <xhtml:link rel="alternate" hreflang="zh" href="https://your-domain.com/zh" />
  <xhtml:link rel="alternate" hreflang="es" href="https://your-domain.com/es" />
  <xhtml:link rel="alternate" hreflang="ja" href="https://your-domain.com/ja" />
</url>
```

When you add pages beyond the home page, extend `sitemap.ts` with additional entries — each with its own `alternates.languages` built via `getPathname({ locale, href: "/your-page" })`.

### Robots.txt

`src/app/robots.ts` generates `/robots.txt`:

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
```

Output:

```
User-Agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap.xml
```

The sitemap URL uses `siteConfig.url` so it stays correct across environments when `NEXT_PUBLIC_SITE_URL` is set.

### Open Graph and Twitter Cards

**Open Graph** (layout `generateMetadata`):


| Property          | Value source                                  |
| ----------------- | --------------------------------------------- |
| `og:title`        | `dictionary/{locale}/Metadata.title`          |
| `og:description`  | `dictionary/{locale}/Metadata.description`    |
| `og:url`          | Locale-specific canonical URL                 |
| `og:site_name`    | `siteConfig.name`                             |
| `og:locale`       | BCP 47 from `openGraphLocales` (e.g. `ar_SA`) |
| `og:type`         | `website`                                     |
| `og:image`        | `/og-image.png` → resolved via `metadataBase` |
| `og:image:width`  | `1200`                                        |
| `og:image:height` | `630`                                         |
| `og:image:alt`    | Localized title                               |


**Twitter Card:**


| Property              | Value                 |
| --------------------- | --------------------- |
| `twitter:card`        | `summary_large_image` |
| `twitter:title`       | Localized title       |
| `twitter:description` | Localized description |
| `twitter:image`       | `/og-image.png`       |
| `twitter:creator`     | `@s0ver5`             |


### Open Graph image

`public/og-image.png` is a 1200×630 PNG referenced in both Open Graph and Twitter metadata. Because `metadataBase` is set, Next.js resolves it to `https://your-domain.com/og-image.png`.

Replace this file with your own branded image before production launch. Recommended:

- 1200×630 px (1.91:1 ratio)
- Include site name and author/branding
- Keep important content in the center (cropped on some platforms)

### Google Search Console verification

Site ownership verification is configured via the Metadata API `other` field:

```ts
other: {
  "google-site-verification": "sVYBYfSJfXdBca3QoqsZtD6lsWVH6sk02RCH4YAbcm8",
},
```

This renders `<meta name="google-site-verification" content="...">` in `<head>`. Replace with your own verification token from [Google Search Console](https://search.google.com/search-console) when deploying to a new domain.

A static verification file also exists at `public/google52d37058772b10e6.html` (alternate verification method).

### Adding SEO to a new page

For a page at `src/app/[locale]/about/page.tsx`:

**Option A — page-level metadata:**

```tsx
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  const pathname = await getPathname({ locale, href: "/about" });
  const canonical = new URL(pathname, siteConfig.url).toString();

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical },
  };
}
```

**Option B — extend sitemap:**

```ts
// In sitemap.ts, add another entry:
{
  url: new URL(await getPathname({ locale: "en", href: "/about" }), siteConfig.url).toString(),
  alternates: {
    languages: Object.fromEntries(
      await Promise.all(
        routing.locales.map(async (l) => [
          l,
          new URL(await getPathname({ locale: l, href: "/about" }), siteConfig.url).toString(),
        ]),
      ),
    ),
  },
}
```

Add `metaTitle` and `metaDescription` keys to the `About` namespace in all dictionary files.

### Production SEO checklist

- [ ] Set `NEXT_PUBLIC_SITE_URL` to your production domain
- [x] Replace `public/og-image.png` with branded 1200×630 image
- [ ] Update `google-site-verification` meta tag with your Search Console token
- [ ] Translate `Metadata` namespace in all dictionary files
- [ ] Submit `https://your-domain.com/sitemap.xml` in Google Search Console
- [ ] Verify hreflang with [hreflang Tags Testing Tool](https://technicalseo.com/tools/hreflang/)
- [ ] Test JSON-LD with [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Test social previews with [opengraph.xyz](https://www.opengraph.xyz/) or Twitter Card Validator
- [ ] Confirm `/robots.txt` and `/sitemap.xml` return 200 in production
- [ ] Add new pages to `sitemap.ts` with locale alternates

### Verifying SEO output

**Local dev:**

```bash
bun dev
# Visit http://localhost:3000 and View Page Source
# Or curl headers:
curl -s http://localhost:3000 | grep -E '<title>|<meta|<link rel="canonical"|<link rel="alternate"'
```

**Per locale:**

```bash
curl -s http://localhost:3000/ar | grep '<html'
# Should show: <html lang="ar" dir="rtl" ...>

curl -s http://localhost:3000/ja | grep '<title>'
# Should show Japanese title from dictionary/ja.json Metadata
```

**Sitemap and robots:**

```bash
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/robots.txt
```

**JSON-LD:** View page source on `/` and search for `application/ld+json` — two script blocks should appear before page content.

---

## Environment variables


| Variable               | Required | Default                                    | Description                                  |
| ---------------------- | -------- | ------------------------------------------ | -------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | No       | `https://next-app-i18n-starter.vercel.app` | Canonical URL for metadata, sitemap, OG tags |


```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

See `.env.example` for the template.

---

## Deployment

Works on [Vercel](https://vercel.com) out of the box.

1. Push to GitHub
2. Import project in Vercel
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain
4. Deploy

The proxy (`src/proxy.ts`) runs automatically on Vercel's edge. No extra configuration needed for i18n routing.

For other hosts, ensure:

- Node.js 24+
- `bun run build` then `bun start` (or equivalent)
- All locale paths (`/`, `/ar`, `/zh`, etc.) route to the Next.js server

---

## Scripts

```bash
bun dev       # Start dev server (Turbopack)
bun build     # Production build + TypeScript check
bun start     # Start production server
bun lint      # Run ESLint
```

---

## Troubleshooting

### Translations not updating after adding keys

Run `bun run build` — TypeScript validates all dictionary files against `en.json`. Missing keys in other locales will cause type errors.

### Wrong locale in URL

Check `src/i18n/routing.ts` — `localePrefix: "as-needed"` means only non-default locales get a prefix. English is always `/`.

### `useTranslations` returns wrong namespace

Ensure the component is inside `NextIntlClientProvider` (set in root layout) and the namespace exists in the active locale's JSON file.

### Theme flash on load

The `theme` cookie must be set before the first paint. If you see a flash, clear cookies and reload — the server reads the cookie in `layout.tsx` and applies the class on `<html>`.

### React 19 script tag error

Do not use `<Script>` from `next/script` or inline `<script>` in client components. Use server-component JSON-LD (see `page.tsx`) or cookie-based theme init (see `layout.tsx`).

### hreflang URLs incorrect

Always build alternate URLs with `getPathname` from `@/i18n/navigation` — it respects `localePrefix: "as-needed"`. English is `/`, not `/en`. See [SEO](#seo) section for the full URL table.

### JSON-LD not appearing

JSON-LD is only on the home page (`src/app/[locale]/page.tsx`). It must be in a Server Component. View page source and search for `application/ld+json`. Do not use `next/script`.

### Wrong Open Graph image URL

Ensure `metadataBase` is set in `generateMetadata` and `NEXT_PUBLIC_SITE_URL` points to your domain. OG image path is relative: `/og-image.png`.

### Sitemap shows wrong domain

Set `NEXT_PUBLIC_SITE_URL` in `.env.local` (dev) or Vercel environment variables (production). `siteConfig.url` drives all sitemap and robots URLs.

### Metadata still in English on /ar

Check `dictionary/ar.json` has a translated `Metadata` namespace. `generateMetadata` calls `getTranslations({ locale, namespace: "Metadata" })` with the route locale.

---

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes (update all dictionary files if adding translation keys)
4. Verify: `bun run lint && bun run build`
5. Commit: `git commit -am 'Add feature'`
6. Push: `git push origin feature/your-feature`
7. Open a Pull Request

---

## License

MIT © [Sovers Tonmoy Pandey](https://s0vers.com)

See [LICENSE](LICENSE) for details.

## Acknowledgments

Open source libraries and community projects that made this starter possible: [ACKNOWLEDGMENTS.md](ACKNOWLEDGMENTS.md).

---

## AI / LLM context

Machine-readable project reference for AI coding assistants: [llms.txt](https://next-app-i18n-starter.vercel.app/llms.txt)

Includes a complete SEO implementation reference — metadata field-to-HTML mapping, hreflang URL table, JSON-LD schemas, sitemap/robots structure, verification commands, and project-specific pitfalls.

**Cursor IDE:** agent onboarding in [AGENTS.md](AGENTS.md); scoped rules in [`.cursor/rules/`](.cursor/rules/) (see [`.cursor/README.md`](.cursor/README.md)).