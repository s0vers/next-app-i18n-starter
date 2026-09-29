# Next.js 16 i18n Starter

A multilingual Next.js starter built with **Next.js 16**, **React 19**, **next-intl 4**, and **shadcn/ui**. It includes locale-driven formatting, Arabic RTL support, cookie-based light/dark mode, and SEO metadata for every locale.

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
- [Typography and motion](#typography-and-motion)
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
| **SEO**        | `metadataBase`, hreflang, JSON-LD, sitemap/robots, OG image                 |
| **DX**         | TypeScript, typed translation keys via `global.d.ts`, ESLint flat config    |


---

## Prerequisites

- Node.js 24.x (see `.nvmrc`)
- [Bun](https://bun.sh) 1.x (preferred package manager); pnpm also works
- Basic familiarity with Next.js App Router and React Server Components

---

## Getting started

```bash
# Clone
git clone https://github.com/S0vers/i18n-Nextjs-BoilerPlate.git
cd i18n-Nextjs-BoilerPlate

# Install
bun install

# Optional: set production URL for local SEO preview
cp .env.example .env.local
# Edit .env.local → NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Run
bun dev
```

Open [http://localhost:3000](http://localhost:3000). Use the language switcher in the header to see translations and regional formatting update.

Before deploying a fork, set `NEXT_PUBLIC_SITE_URL`, update the site and author details in `src/lib/site.ts`, replace the Open Graph image, and replace the demo site's Google verification token and file. See the [production SEO checklist](#production-seo-checklist).

---

## Project structure

```
i18n-Nextjs-BoilerPlate/
├── dictionary/                     # Translation JSON files
│   ├── en.json                     # English (TypeScript source of truth)
│   ├── ar.json                     # Arabic
│   ├── zh.json                     # Chinese
│   ├── es.json                     # Spanish
│   └── ja.json                     # Japanese
├── public/
│   ├── llms.txt                    # Machine-readable context for AI tools
│   ├── og-image.png                # Open Graph image (1200×630)
│   └── google52d37058772b10e6.html # Demo site's verification file
├── src/
│   ├── app/
│   │   ├── [locale]/               # All pages are locale-scoped
│   │   │   ├── layout.tsx          # Metadata, theme SSR, providers
│   │   │   ├── page.tsx            # Home + JSON-LD structured data
│   │   │   ├── not-found.tsx       # Localized 404
│   │   │   └── [...rest]/          # Catch-all → not-found
│   │   ├── globals.css             # Tailwind + CSS variables
│   │   ├── favicon.ico             # Site icon
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
│   │   ├── locales.ts              # Locale labels and regional defaults
│   │   ├── request.ts              # getRequestConfig (core i18n setup)
│   │   ├── routing.ts              # Locales + URL prefix strategy
│   │   ├── regional.ts             # Number and date format definitions
│   │   └── navigation.ts           # Localized Link, useRouter, getPathname
│   ├── lib/
│   │   ├── site.ts                 # Site URL, author, SEO constants
│   │   ├── theme.ts                # Theme cookie helpers
│   │   └── utils.ts                # cn() class merge helper
│   └── proxy.ts                    # next-intl proxy (Next.js 16)
├── .env.example
├── global.d.ts                     # next-intl AppConfig types
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Internationalization

This template uses [next-intl](https://next-intl.dev) with the App Router pattern. The i18n setup uses these files:

1. `src/i18n/locales.ts` — locale labels, currency, time zone, font, and Open Graph locale
2. `src/i18n/routing.ts` — URL prefix strategy
3. `src/i18n/request.ts` — per-request messages, time zone, and formats
4. `src/i18n/navigation.ts` — locale-aware navigation wrappers

### How routing works

Configured in `src/i18n/routing.ts`:

```ts
import { defineRouting } from "next-intl/routing";
import { locales } from "./locales";

export const routing = defineRouting({
  locales,
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


`src/proxy.ts` handles locale detection for application routes using the URL, cookie, or `Accept-Language` header.

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

`src/i18n/locales.ts` defines each locale's defaults:


| Locale | Currency | Time zone        |
| ------ | -------- | ---------------- |
| `en`   | USD      | America/New_York |
| `ar`   | SAR      | Asia/Riyadh      |
| `zh`   | CNY      | Asia/Shanghai    |
| `es`   | EUR      | Europe/Madrid    |
| `ja`   | JPY      | Asia/Tokyo       |


`src/i18n/request.ts` applies them on every request:

```ts
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const { currency, timeZone } = localeConfig[locale];

  return {
    locale,
    timeZone,
    now: new Date(),
    formats: createRegionalFormats(currency),
    messages: (await import(`../../dictionary/${locale}.json`)).default,
  };
});
```

**In components**, use next-intl hooks:

```tsx
"use client";
import { useFormatter, useNow } from "next-intl";

export function RegionalExamples() {
  const format = useFormatter();
  const now = useNow({ updateInterval: 30_000 });
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  return (
    <div>
      <p>{format.number(29.99, "price")}</p>
      <p>{format.dateTime(now, "long")}</p>
      <p>{format.relativeTime(twoHoursAgo, now)}</p>
    </div>
  );
}
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
| `NotFound`     | Localized 404 page                                    |


`global.d.ts` types locales, format names, and message keys from `en.json`:

```ts
import en from "./dictionary/en.json";
import type { AppLocale } from "./src/i18n/locales";
import { createRegionalFormats } from "./src/i18n/regional";

declare module "next-intl" {
  interface AppConfig {
    Locale: AppLocale;
    Messages: typeof en;
    Formats: ReturnType<typeof createRegionalFormats>;
  }
}
```

Add each new key to every dictionary. TypeScript checks keys used in code against `en.json`; it does not compare the other JSON files automatically.

### Server vs client components

**Server Component** (page or layout):

```tsx
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

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

1. Copy `dictionary/en.json` to `dictionary/fr.json` and translate every value.
2. Add one entry to `localeConfig` in `src/i18n/locales.ts`:

   ```ts
   fr: {
     label: "Français",
     ogLocale: "fr_FR",
     currency: "EUR",
     timeZone: "Europe/Paris",
     font: "geist",
   },
   ```

   Routing, the language switcher, regional formatting, and Open Graph locale derive from this config. Choose `font: "system"` if the Geist Latin subset does not cover the language.
3. Run `bun run lint` and `bun run build`, then check the new locale's page and metadata. TypeScript does not check that `fr.json` contains every English key; compare the dictionaries when translating.

### Adding a new page

```tsx
// src/app/[locale]/about/page.tsx
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
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

The file is named `OmmitRlt.tsx` for compatibility with existing imports; import its default export as `OmitRTL`.

---

## Theme system

Light/dark mode without flash-of-unstyled-content and without `<script>` tags (React 19 compatible).

**How it works:**

1. **Server** (`layout.tsx`) reads the `theme` cookie and sets `className="light"` or `"dark"` on `<html>` before paint.
2. **Client** (`theme-provider.tsx`) updates the theme class and cookie when toggled.
3. **Toggle** (`ModeToggle.tsx`) switches between `light` and `dark`.

No blocking scripts. No `next-themes` dependency.

---

## Typography and motion

`src/i18n/locales.ts` selects Geist for English and Spanish, and a system font for Arabic, Chinese, and Japanese. The layout loads the Geist Latin subset; change the locale's `font` setting when adding a language with different script coverage. Headings use balanced wrapping, while longer descriptions use readable line lengths and `text-pretty`.

Interactive controls have touch-sized targets and visible keyboard focus. Dropdowns use short enter and exit animations; keyboard-opened menus skip the entrance animation. The copy button only animates its icon for pointer input. Reduced-motion preferences disable those effects, and theme changes temporarily suppress color transitions so the whole page changes together.

---

## SEO

The SEO setup uses the Next.js Metadata API, next-intl URL helpers, JSON-LD structured data, and generated sitemap and robots routes. Canonical and alternate URLs follow `localePrefix: "as-needed"` routing.

### SEO architecture overview

```
┌─────────────────────────────────────────────────────────────────┐
│  src/lib/site.ts                                                │
│  siteConfig.url and author                                      │
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
| `src/lib/site.ts`             | Site name, canonical base URL, author info, URL helpers                 |
| `src/i18n/locales.ts`         | Locale settings, including fonts and Open Graph locale tags            |
| `src/app/[locale]/layout.tsx` | `generateMetadata` — all `<head>` meta tags per locale                  |
| `src/app/[locale]/page.tsx`   | JSON-LD `WebSite` + `Person` schemas on home page                       |
| `src/app/sitemap.ts`          | `/sitemap.xml` with hreflang language alternates                        |
| `src/app/robots.ts`           | `/robots.txt` with sitemap reference                                    |
| `dictionary/*/Metadata`       | Locale-specific `title`, `description`, `keywords`                      |
| `public/og-image.png`         | Social sharing preview image (1200×630)                                 |
| `public/llms.txt`             | Machine-readable project reference                                      |


### Central site config

Shared site identity and the URL used by SEO helpers live in `src/lib/site.ts`:

```ts
export const siteConfig = {
  name: "Next.js i18n Starter",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://next-app-i18n-starter.vercel.app",
  github: "https://github.com/S0vers/i18n-Nextjs-BoilerPlate",
  author: {
    name: "Sovers Tonmoy Pandey",
    alias: "S0vers",
    url: "https://s0vers.com",
    twitter: "@s0ver5",
    github: "https://github.com/S0vers",
  },
} as const;

```

Set `NEXT_PUBLIC_SITE_URL` in production so `metadataBase`, canonical URLs, sitemap entries, and OG absolute URLs all resolve to your real domain. Also replace the demo author's details in this file, translated metadata in `dictionary/*.json`, and the Search Console verification in `layout.tsx`.

### Metadata API (`generateMetadata`)

Defined in `src/app/[locale]/layout.tsx`. Next.js calls this per locale at build/request time and injects the result into `<head>`.

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
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
    openGraph: { /* see below */ },
    twitter: { /* see below */ },
    alternates: { canonical, languages },
    robots: { index: true, follow: true, /* googleBot directives */ },
    verification: { google: "..." },
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

The helper `getLocaleUrl` in `src/lib/site.ts` builds correct absolute URLs using next-intl's `getPathname`:

```ts
function getLocaleUrl(locale: AppLocale) {
  const pathname = getPathname({ locale, href: "/" });
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
  className={initialTheme}
>
```

Search engines and screen readers use `lang` to identify page language. `dir="rtl"` for Arabic ensures correct text flow without affecting SEO negatively — Google fully indexes RTL pages.

`generateStaticParams` enumerates the supported locale routes. The layout reads a theme cookie, so the homepage is rendered per request:

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
  "url": "https://your-domain.com/ar",
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
    "https://twitter.com/s0ver5"
  ]
}
```

Validate with [Google Rich Results Test](https://search.google.com/test/rich-results) or [Schema Markup Validator](https://validator.schema.org/).

### Sitemap

`src/app/sitemap.ts` generates `/sitemap.xml` from the configured locales.

```ts
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = getAlternateLanguages();

  return routing.locales.map((locale) => ({
    url: getLocaleUrl(locale),
    alternates: { languages },
  }));
}
```

Each localized URL has its own sitemap entry, and every entry lists all language variants, including itself and an `x-default` fallback. This follows [Google's localized sitemap guidance](https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap). There is no synthetic `lastModified` date; add one only when you can supply a verified content update date.

Example output structure:

```xml
<url>
  <loc>https://your-domain.com/</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://your-domain.com/" />
  <xhtml:link rel="alternate" hreflang="ar" href="https://your-domain.com/ar" />
  <xhtml:link rel="alternate" hreflang="zh" href="https://your-domain.com/zh" />
  <xhtml:link rel="alternate" hreflang="es" href="https://your-domain.com/es" />
  <xhtml:link rel="alternate" hreflang="ja" href="https://your-domain.com/ja" />
  <xhtml:link rel="alternate" hreflang="x-default" href="https://your-domain.com/" />
</url>
<!-- Repeat with /ar, /zh, /es, and /ja as each entry's <loc>. -->
```

When you add pages beyond the home page, extend `sitemap.ts` with an entry for every localized URL, each with the same `getAlternateLanguages("/your-page")` map.

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
| `og:locale`       | Locale tag from `localeConfig` (e.g. `ar_SA`) |
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

Site ownership verification is configured via the Metadata API `verification` field:

```ts
verification: {
  google: "sVYBYfSJfXdBca3QoqsZtD6lsWVH6sk02RCH4YAbcm8",
},
```

This renders `<meta name="google-site-verification" content="...">` in `<head>`. Replace with your own verification token from [Google Search Console](https://search.google.com/search-console) when deploying to a new domain.

A static verification file also exists at `public/google52d37058772b10e6.html` (alternate verification method).

### Adding SEO to a new page

For a page at `src/app/[locale]/about/page.tsx`:

**Page-level metadata:**

```tsx
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getAlternateLanguages, getLocaleUrl } from "@/lib/site";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "About" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: getLocaleUrl(locale, "/about"),
      languages: getAlternateLanguages("/about"),
    },
  };
}
```

**Sitemap entries:**

```ts
const languages = getAlternateLanguages("/about");
const aboutEntries = routing.locales.map((locale) => ({
  url: getLocaleUrl(locale, "/about"),
  alternates: { languages },
}));
```

Add `metaTitle` and `metaDescription` keys to the `About` namespace in all dictionary files.

### Production SEO checklist

- [ ] Set `NEXT_PUBLIC_SITE_URL` to your production domain
- [ ] Replace the demo site name, repository link, and author details in `src/lib/site.ts`
- [ ] Replace `public/og-image.png` with your branded 1200×630 image
- [ ] Replace the demo Search Console token in `src/app/[locale]/layout.tsx` and remove or replace `public/google52d37058772b10e6.html`
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
# Or inspect the HTML response:
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

Add the key to `en.json` and every other dictionary. TypeScript checks message keys used in code against `en.json`, but does not compare the other locale files automatically. Restart the dev server if an edited JSON file is not picked up.

### Wrong locale in URL

Check `src/i18n/routing.ts` — `localePrefix: "as-needed"` means only non-default locales get a prefix. English is always `/`.

### `useTranslations` returns wrong namespace

Ensure the component is inside `NextIntlClientProvider` (set in root layout) and the namespace exists in the active locale's JSON file.

### Theme flash on load

The server reads the `theme` cookie in `layout.tsx` and applies the class on `<html>` before rendering. Check that the cookie is `light` or `dark` and has path `/` if the initial theme is wrong.

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
