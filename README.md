# Next.js 16 i18n Starter

A multilingual Next.js starter built with **Next.js 16**, **React 19**, **next-intl 4**, and **shadcn/ui**. It includes locale-driven formatting, Arabic RTL support, cookie-based light/dark mode, and SEO metadata for every locale.

**Author:** [Sovers Tonmoy Pandey](https://s0vers.com) (s0vers) · [GitHub](https://github.com/s0vers) · [@s0ver5](https://twitter.com/s0ver5)

**Live demo:** [next-app-i18n-starter.vercel.app](https://next-app-i18n-starter.vercel.app)

**New to i18n in Next.js?** Start with the [ten minute guide](GUIDE.md). It traces one request end to end, lists the mistakes this repository already made, and gives six exercises that break things on purpose.

---

## Table of contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Skills for coding assistants](#skills-for-coding-assistants)
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
  - [AI search and crawler access](#ai-search-and-crawler-access)
  - [SEO implementation plan](#seo-implementation-plan)
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
| **i18n**       | next-intl 4: ICU messages, `useFormatter`, and locale-driven formatting   |
| **Languages**  | English, Arabic (RTL), Chinese, Spanish, Japanese                           |
| **Formatting** | Locale-based currency, dates, compact numbers, and relative time          |
| **UI**         | shadcn/ui components, Tailwind CSS 4, light/dark theme                      |
| **RTL**        | Automatic `dir="rtl"` for Arabic + `OmitRTL` utility for LTR islands        |
| **SEO**        | `metadataBase`, hreflang, JSON-LD, sitemap/robots, OG image                 |
| **DX**         | TypeScript, typed translation keys via `global.d.ts`, ESLint flat config    |


---

## Prerequisites

- Node.js 24.x (see `.nvmrc`)
- [Bun](https://bun.sh) 1.x
- Basic familiarity with Next.js App Router and React Server Components

---

## Getting started

```bash
# Clone
git clone https://github.com/s0vers/next-app-i18n-starter.git
cd next-app-i18n-starter

# Install
bun install

# Set this project's public URL for local SEO preview (forks should replace it)
cp .env.example .env.local
# NEXT_PUBLIC_SITE_URL=https://next-app-i18n-starter.vercel.app

# Run
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the language switcher in the header to see translations and regional formatting update.

Before deploying a fork, set `NEXT_PUBLIC_SITE_URL`, update the site and author details in `src/lib/site.ts`, and replace the Open Graph image. Set `GOOGLE_SITE_VERIFICATION` if your Search Console property uses meta-tag verification. See the [production SEO checklist](#production-seo-checklist).

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
├── .agents/skills/                 # next-intl and SEO skills: playbooks, scripts, evals
├── AGENTS.md                       # Shared instructions for coding assistants
├── GUIDE.md                        # Ten minute tour of how i18n works here
├── .env.example
├── global.d.ts                     # next-intl AppConfig types
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Skills for coding assistants

This repository ships two skills in `.agents/skills/`. They guide work on this starter and on forks. Each skill is a short router (`SKILL.md`) that sends the agent to playbooks in `references/`, and the agent loads only the playbooks the task needs. The playbooks cover products, blogs, and GA4, which the starter itself does not include.

### next-intl-i18n

Locale routing, request config, messages, formatting, RTL and CJK layout, and localized content, checked against next-intl 4.14 and Next.js 16.3.

| Playbook | Covers |
| --- | --- |
| [Architecture and rendering](.agents/skills/next-intl-i18n/references/architecture-and-rendering.md) | Locale source decision, root params versus `setRequestLocale`, Cache Components, server and client split |
| [Routing and navigation](.agents/skills/next-intl-i18n/references/routing-and-navigation.md) | Prefix modes, cookies, proxy, `pathnames`, domains, `Link`, locale switcher |
| [Messages and formatting](.agents/skills/next-intl-i18n/references/messages-and-formatting.md) | ICU, rich text, formatters, typing, extraction |
| [RTL and scripts](.agents/skills/next-intl-i18n/references/rtl-and-scripts.md) | Arabic, Chinese, Japanese, Spanish: direction, numerals, plurals, fonts, line breaking |
| [Localized content](.agents/skills/next-intl-i18n/references/localized-content.md) | CMS content, per-locale slugs, partial translation, adding a locale |
| [Integrations and workflows](.agents/skills/next-intl-i18n/references/integrations-and-workflows.md) | Metadata, Open Graph, Server Actions, error pages, tests |
| [Verification](.agents/skills/next-intl-i18n/references/verification.md) | Done-when checks, symptom table, report shape |

Validate the locale registry (route keys, language tags, currency, time zone, direction, dictionary files) and check that every dictionary mirrors `en.json` (keys, ICU arguments, rich-text tags, plural `other` branches):

```bash
bun run i18n:check
```

### nextjs-i18n-seo

Search discovery for multilingual sites: international, technical, commerce, editorial, other site types, structured data, measurement, and AI search. Every playbook dates its sources and tags each claim as documented, standard, study, practice, or unverified.

| Playbook | Covers |
| --- | --- |
| [Technical SEO](.agents/skills/nextjs-i18n-seo/references/technical-seo.md) | Indexing diagnosis, status codes, robots, sitemap, Next.js metadata |
| [International SEO](.agents/skills/nextjs-i18n-seo/references/international-seo.md) | `hreflang`, tags, URL structure, partial translation, other engines, locale notes |
| [Structured data](.agents/skills/nextjs-i18n-seo/references/structured-data.md) | Type chooser, supported and removed features, product fields, JSON-LD pattern |
| [Commerce and products](.agents/skills/nextjs-i18n-seo/references/commerce-and-products.md) | Index rules, facets, stock states, currency markets, feeds, AI shopping |
| [Editorial and publishing](.agents/skills/nextjs-i18n-seo/references/editorial-and-publishing.md) | Article gate, archives, news, syndication, refresh, content model |
| [Content and on-page](.agents/skills/nextjs-i18n-seo/references/content-and-onpage.md) | Search intent, page elements, internal links, scaled content |
| [Site types](.agents/skills/nextjs-i18n-seo/references/site-types-and-search-features.md) | SaaS, docs, marketplace, local, jobs, video, forums, and more |
| [Measurement](.agents/skills/nextjs-i18n-seo/references/measurement.md) | Search Console, GA4, Bing, Core Web Vitals, drop diagnosis |
| [AI and agentic discovery](.agents/skills/nextjs-i18n-seo/references/ai-and-agentic-discovery.md) | AI Overviews, ChatGPT, Claude, Perplexity, Copilot, agents, what has evidence |
| [AI crawler reference](.agents/skills/nextjs-i18n-seo/references/ai-crawler-reference.md) | Crawler tokens, policy options, `robots.ts` sketch |
| [Audits, launches, migrations](.agents/skills/nextjs-i18n-seo/references/audits-launches-migrations.md) | Audit layers, launch gate, migration, adding or removing a locale |
| [Evidence and reporting](.agents/skills/nextjs-i18n-seo/references/evidence-and-reporting.md) | Evidence tags, how far a claim got, verdicts, report shape, unattended runs |
| [This template](.agents/skills/nextjs-i18n-seo/references/template-notes.md) | Helpers, routing flags, and defaults in this starter |

Check hreflang reciprocity, canonicals, `lang`, JSON-LD, sitemap agreement, and language redirects on a running site:

```bash
bun run dev
node .agents/skills/nextjs-i18n-seo/scripts/verify-seo.mjs --base http://localhost:3000
```

For a production build served locally, add `--origin https://your-domain.example` so canonicals compare against the public origin. The script proves local implementation only. Indexing and canonical selection need Search Console.

### Using the skills

In a clone of this repository, the instruction map in [AGENTS.md](AGENTS.md) points agents at the right skill. In your own project, install them with `npx skills add s0vers/next-app-i18n-starter`, which copies each skill into the folder your agent reads (Claude Code reads `.claude/skills`, and does not scan `.agents/skills` by itself). Otherwise, read the relevant `SKILL.md` and only the playbooks the task needs. Start with [AGENTS.md](AGENTS.md) for repository conventions. Each skill has an `evals/evals.json` with prompts and assertions for testing changes to the skill. Platform rules change, so recheck the owning platform's documentation for anything the playbooks date more than 90 days back.

---

## Internationalization

This template uses [next-intl](https://next-intl.dev) with the App Router pattern. The i18n setup uses these files:

1. `src/i18n/locales.ts`: locale labels, currency, time zone, font, and Open Graph locale
2. `src/i18n/routing.ts`: URL prefix strategy
3. `src/i18n/request.ts`: per-request messages, time zone, and formats
4. `src/i18n/navigation.ts`: locale-aware navigation wrappers

### How routing works

Configured in `src/i18n/routing.ts`:

```ts
import { defineRouting } from "next-intl/routing";
import { locales } from "./locales";

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localeDetection: false,
  localePrefix: "as-needed",
  localeCookie: false,
  alternateLinks: false,
});
```

`localeCookie: false` skips the `NEXT_LOCALE` cookie, which nothing reads while detection is off, and keeps `Set-Cookie` off cacheable pages. `alternateLinks: false` stops the proxy from adding its own `hreflang` `Link` header, so page metadata and the sitemap are the only source of alternates.

With `localePrefix: "as-needed"`:


| Locale | URL   | Notes                        |
| ------ | ----- | ---------------------------- |
| `en`   | `/`   | Default locale has no prefix |
| `ar`   | `/ar` |                              |
| `zh`   | `/zh` |                              |
| `es`   | `/es` |                              |
| `ja`   | `/ja` |                              |


`src/proxy.ts` routes locale-prefixed URLs and serves the default locale at `/`. Automatic locale detection from cookies or `Accept-Language` is disabled so the default URL stays stable; visitors can switch languages with the locale switcher.

**Always use navigation from `@/i18n/navigation`**, not `next/link` or `next/navigation` directly:

```tsx
import { Link, useRouter, usePathname } from "@/i18n/navigation";

// Switch locale
const router = useRouter();
const pathname = usePathname();
router.replace(pathname, { locale: "ar" });
```

### Locale-driven formatting

Currency, dates, and time zones follow the active locale. The demo does not provide separate controls for them.

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

The **Localization** tab on the home page demonstrates these formats. Change the language in the header to see the prices and dates update.

### Translation files

All strings live in `dictionary/{locale}.json`. Namespaces:


| Namespace      | Used for                                              |
| -------------- | ----------------------------------------------------- |
| `Index`        | Landing page UI, tabs, installation steps             |
| `Footer`       | Copyright, links                                      |
| `Metadata`     | Localized SEO title and description (`generateMetadata`) |
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
     languageTag: "fr",
     ogLocale: "fr_FR",
     currency: "EUR",
     timeZone: "Europe/Paris",
     dir: "ltr",
     font: "geist",
   },
   ```

   Routing, the language switcher, regional formatting, and Open Graph locale derive from this config. Choose `font: "system"` if the Geist Latin subset does not cover the language.
3. Run `bun run i18n:check`, `bun run lint`, and `bun run build`, then check the new locale's page and metadata. `i18n:check` validates the language tag, currency, time zone, and direction, and fails when `fr.json` is missing a key or changes an ICU argument. TypeScript only checks keys against `en.json`.

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

The server reads the saved theme and renders the matching class before paint, avoiding a theme flash during hydration.

### How it works

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
  dictionary/{locale}.json → Metadata namespace (translated title and description)
         │
         ▼
  getPathname({ locale, href })  ←  correct URLs per locale (as-needed)
```

### Files involved


| File                          | SEO responsibility                                                      |
| ----------------------------- | ----------------------------------------------------------------------- |
| `src/lib/site.ts`             | Site name, canonical base URL, author info, URL helpers                 |
| `src/i18n/locales.ts`         | Locale settings, including fonts and Open Graph locale tags            |
| `src/app/[locale]/layout.tsx` | `generateMetadata` builds `<head>` metadata for each locale              |
| `src/app/[locale]/page.tsx`   | Root homepage `WebSite` JSON-LD and localized launch guide               |
| `src/app/sitemap.ts`          | `/sitemap.xml` with hreflang language alternates                        |
| `src/app/robots.ts`           | `/robots.txt` with sitemap reference                                    |
| `dictionary/{locale}.json`    | Locale-specific `Metadata.title` and `Metadata.description`               |
| `public/og-image.png`         | Social sharing preview image (1200×630)                                 |
| `public/llms.txt`             | Machine-readable project reference                                      |


### Central site config

Shared site identity and the URL used by SEO helpers live in `src/lib/site.ts`:

```ts
export const siteConfig = {
  name: "Next.js 16 i18n Starter",
  url: getSiteOrigin(), // local default: http://localhost:3000; production requires NEXT_PUBLIC_SITE_URL
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

```

In local development, the URL defaults to `http://localhost:3000`. Production builds require `NEXT_PUBLIC_SITE_URL` to be a valid HTTPS origin with no path, query, or fragment; the build rejects local and common example domains. Also replace the site identity and author details in this file and translate metadata in `dictionary/*.json`. Set `GOOGLE_SITE_VERIFICATION` only when you have a token for the deployed domain.

### Metadata API (`generateMetadata`)

`src/lib/site.ts` exports `createLocalizedMetadata`, which is used by the locale layout and should be reused by page-level routes. It centralizes canonical URLs, reciprocal language alternates, Open Graph, Twitter, robots, and optional verification fields.

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return createLocalizedMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    pathname: "/",
  });
}
```

### Metadata fields in HTML


| Metadata field         | Rendered output                         | Purpose                                            |
| ---------------------- | --------------------------------------- | -------------------------------------------------- |
| `metadataBase`         | Base for resolving relative URLs        | Makes `/og-image.png` resolve to full absolute URL |
| `title`                | `<title>`                               | Browser tab + search result headline               |
| `description`          | `<meta name="description">`             | Search snippet text                                |
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


| Route locale | `lang` / `hreflang` | `getPathname` result | Full canonical URL (example) |
| ------------ | ------------------- | -------------------- | ---------------------------- |
| `en`         | `en-US`             | `/`                  | `https://your-domain.com/`   |
| `ar`         | `ar-SA`             | `/ar`                | `https://your-domain.com/ar` |
| `zh`         | `zh-Hans-CN`        | `/zh`                | `https://your-domain.com/zh` |
| `es`         | `es-ES`             | `/es`                | `https://your-domain.com/es` |
| `ja`         | `ja-JP`             | `/ja`                | `https://your-domain.com/ja` |


`getPathname` keeps URLs aligned with the routing policy. English has no prefix with `as-needed`. Use it for canonical, hreflang, and sitemap URLs.

`alternates.languages` produces hreflang tags like:

```html
<link rel="alternate" hreflang="en-US" href="https://your-domain.com/" />
<link rel="alternate" hreflang="ar-SA" href="https://your-domain.com/ar" />
<link rel="alternate" hreflang="zh-Hans-CN" href="https://your-domain.com/zh" />
<link rel="alternate" hreflang="es-ES" href="https://your-domain.com/es" />
<link rel="alternate" hreflang="ja-JP" href="https://your-domain.com/ja" />
```

Each locale's page includes hreflang links pointing to **all** language versions, including itself. This helps search engines serve the correct language to users.

### Translation-driven metadata

Page titles and descriptions come from the `Metadata` namespace in each dictionary file. The `keywords` field has been removed because Google says the meta-keywords tag has no effect on indexing or ranking.

```json
// dictionary/en.json
"Metadata": {
  "title": "Next.js 16 i18n Starter - Multilingual Template by s0vers",
  "description": "Next.js 16 internationalization starter with next-intl 4..."
}
```

Every locale (`ar.json`, `zh.json`, `es.json`, `ja.json`) has translated `Metadata` and `SeoGuide` blocks. The `/ar` route serves Arabic metadata and setup guidance in crawlable HTML.

To update SEO copy: edit the `Metadata` namespace in each of the five `dictionary/{locale}.json` files, then rebuild.

### HTML semantics (`lang` and `dir`)

The root layout sets semantic HTML attributes on `<html>`:

```tsx
<html
  lang={localeConfig[locale].languageTag} // e.g. "ar-SA", "zh-Hans-CN"
  dir={isArabic ? "rtl" : "ltr"}  // text direction for the whole document
  className={initialTheme}
>
```

`localeConfig` maps route keys to BCP 47 language tags and Open Graph locale tags. For example, the `/zh` route is marked `zh-Hans-CN` because its content and regional formats target Simplified Chinese in mainland China. `dir="rtl"` sets Arabic reading and layout direction. Search engines primarily determine page language from visible content, so translate the page itself as well as its metadata.

`generateStaticParams` enumerates the supported locale routes. The layout reads a theme cookie, so the homepage is rendered per request:

```ts
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
```

### JSON-LD structured data

The default-locale homepage (`/`) emits one server-rendered `WebSite` JSON-LD node. Other locale homepages do not emit a domain-level site-name node, and the starter does not assert an author identity in structured data. This follows Google's [site-name requirements](https://developers.google.com/search/docs/appearance/site-names) and the [Next.js JSON-LD guidance](https://nextjs.org/docs/app/guides/json-ld).

The node describes the site's canonical root:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Next.js 16 i18n Starter",
  "alternateName": "Next.js i18n Template",
  "url": "https://your-domain.com/",
  "inLanguage": "en"
}
```

The serialization helper escapes `<` before embedding JSON in an HTML script element. Validate structured data with [Schema Markup Validator](https://validator.schema.org/). Google site-name markup is not supported by the Rich Results Test; verify it with Search Console URL Inspection.

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
  <xhtml:link rel="alternate" hreflang="en-US" href="https://your-domain.com/" />
  <xhtml:link rel="alternate" hreflang="ar-SA" href="https://your-domain.com/ar" />
  <xhtml:link rel="alternate" hreflang="zh-Hans-CN" href="https://your-domain.com/zh" />
  <xhtml:link rel="alternate" hreflang="es-ES" href="https://your-domain.com/es" />
  <xhtml:link rel="alternate" hreflang="ja-JP" href="https://your-domain.com/ja" />
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
| `og:title`        | `dictionary/{locale}.json` → `Metadata.title`       |
| `og:description`  | `dictionary/{locale}.json` → `Metadata.description` |
| `og:url`          | Locale-specific canonical URL                 |
| `og:site_name`    | `siteConfig.name`                             |
| `og:locale`       | Locale tag from `localeConfig` (e.g. `ar_SA`) |
| `og:type`         | `website`                                     |
| `og:image`        | `/og-image.png` → resolved via `metadataBase` |
| `og:image:width`  | `1200`                                        |
| `og:image:height` | `630`                                         |
| `og:image:alt`    | Localized title                               |


### Twitter Card


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

The Google verification meta tag is optional and reads the server-only `GOOGLE_SITE_VERIFICATION` environment variable. Leave it unset when you do not need meta-tag verification:

```ts
verification: siteConfig.googleSiteVerification
  ? { google: siteConfig.googleSiteVerification }
  : undefined,
```

When configured, this renders `<meta name="google-site-verification" content="...">` in `<head>`. Obtain your token from [Google Search Console](https://search.google.com/search-console) and set it in deployment secrets; do not commit it to source control.

The legacy static verification file `public/google52d37058772b10e6.html` remains for the current demo property's alternate verification. Remove or replace it only after the demo property's Search Console ownership has been migrated.

### AI search and crawler access

AI search services need access to pages they can crawl and index. Put useful content in server-rendered HTML, use descriptive headings and internal links, and check crawler access in `robots.txt`, hosting rules, and any CDN configuration. These practices also support conventional search. Google does not require special AI schema and says `llms.txt` is not a Google Search ranking signal. This repository keeps `public/llms.txt` as an optional project reference for tools that read it.

The current `robots.ts` allows all user agents. Search discovery and model-training crawlers have different purposes, and site owners should choose those policies explicitly. For example, OpenAI distinguishes `OAI-SearchBot` from `GPTBot`; Anthropic distinguishes `Claude-SearchBot` from `ClaudeBot`; Perplexity distinguishes `PerplexityBot` from its user-request fetcher. Review each provider's current documentation before setting rules: [OpenAI](https://developers.openai.com/api/docs/bots), [Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), and [Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers). This starter does not impose a model-training policy for a fork. The SEO skill's [AI crawler reference](.agents/skills/nextjs-i18n-seo/references/ai-crawler-reference.md) lists current crawler tokens and three policy options, and its [AI discovery playbook](.agents/skills/nextjs-i18n-seo/references/ai-and-agentic-discovery.md) separates the documented controls from unsupported tactics.

Locale routing keeps the default-language URL stable: `localeDetection` is disabled, so `/` does not redirect based on a visitor's saved locale cookie or `Accept-Language`. Visitors can choose a language through the visible switcher, and each locale keeps a directly crawlable URL. This avoids cookie-dependent content and follows Google's guidance to expose language versions at distinct URLs. Enable automatic detection only if it is an intentional product choice and verify that every locale remains directly accessible and self-canonical.

For measurement, verify the domain and sitemap in [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters). Bing Webmaster Tools provides an AI Performance report. ChatGPT referrals may include `utm_source=chatgpt.com`; analytics can use that value when the selected provider captures query parameters. None of these steps guarantees indexing, rankings, or AI citations.

### SEO implementation plan

The production-origin guard, optional verification setting, removal of meta-keywords, root-only site-name schema, visible localized launch guide, and crawler/measurement guidance are implemented. Deployment owners still need to set their real HTTPS origin, configure verification if needed, and verify the live property and crawler access through their hosting provider and webmaster tools.

### Adding SEO to a new page

For a page at `src/app/[locale]/about/page.tsx`:

### Page-level metadata

```tsx
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { createLocalizedMetadata } from "@/lib/site";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "About" });

  return createLocalizedMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    pathname: "/about",
  });
}
```

### Sitemap entries

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
- [ ] Set `GOOGLE_SITE_VERIFICATION` if using meta-tag verification; migrate the current static demo verification only if you control that Search Console property
- [ ] Run the launch gate in the [SEO skill](.agents/skills/nextjs-i18n-seo/references/audits-launches-migrations.md#launch-gate) and confirm the origin, identity, and page copy for your fork
- [ ] Translate `Metadata` namespace in all dictionary files
- [ ] Submit `https://your-domain.com/sitemap.xml` in Google Search Console
- [ ] Verify hreflang with [hreflang Tags Testing Tool](https://technicalseo.com/tools/hreflang/)
- [ ] Validate JSON-LD with [Schema Markup Validator](https://validator.schema.org/); check site-name eligibility with Search Console URL Inspection
- [ ] Test social previews with [opengraph.xyz](https://www.opengraph.xyz/) or Twitter Card Validator
- [ ] Confirm `/robots.txt` and `/sitemap.xml` return 200 in production
- [ ] Add new pages to `sitemap.ts` with locale alternates
- [ ] Confirm the language and region targets in `src/i18n/locales.ts` match real audience and market research; translation alone does not establish local search intent

### Verifying SEO output

### Local development

```bash
bun run dev
# Visit http://localhost:3000 and View Page Source
# Or inspect the HTML response:
curl -s http://localhost:3000 | grep -E '<title>|<meta|<link rel="canonical"|<link rel="alternate"'
```

### Check each locale

```bash
curl -s http://localhost:3000/ar | grep '<html'
# Should show: <html lang="ar" dir="rtl" ...>

curl -s http://localhost:3000/ja | grep '<title>'
# Should show Japanese title from dictionary/ja.json Metadata
```

### Check the sitemap and robots file

```bash
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/robots.txt
```

View the page source for `/` and search for `application/ld+json`. The default homepage emits one `WebSite` node with the site root as its URL. Localized homepages such as `/ar` do not emit this node.

---

## Environment variables


| Variable               | Required | Default                                    | Description                                  |
| ---------------------- | -------- | ------------------------------------------ | -------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Production required | Project origin in `.env.example`; localhost fallback when unset in development | HTTPS origin for canonical URLs, sitemap, and social metadata |
| `GOOGLE_SITE_VERIFICATION` | No | Unset | Optional Search Console meta-tag verification token |


```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://next-app-i18n-starter.vercel.app
# Optional
GOOGLE_SITE_VERIFICATION=your-search-console-token
```

See `.env.example` for the template.

---

## Deployment

Works on [Vercel](https://vercel.com) out of the box.

1. Push to GitHub
2. Import project in Vercel
3. Set `NEXT_PUBLIC_SITE_URL` to `https://next-app-i18n-starter.vercel.app` for this project; forks must use their own production origin
4. Deploy

The proxy (`src/proxy.ts`) runs automatically on Vercel's edge. No extra configuration needed for i18n routing.

For other hosts, configure:

- Node.js 24+
- Run `bun run build`, then start the server with `bun run start` or the host's equivalent command.
- All locale paths (`/`, `/ar`, `/zh`, etc.) route to the Next.js server

---

## Scripts

```bash
bun run dev    # Start the development server (Turbopack)
bun run build  # Build for production and check types
bun run start  # Start the production server
bun run lint   # Run ESLint
bun run check  # ESLint, locale registry and message parity, and skills structure
```

GitHub Actions runs lint, `bun run i18n:check`, `bun run skills:check`, the build, and `node .agents/skills/nextjs-i18n-seo/scripts/verify-seo.mjs` against the production build on every push and pull request. A second workflow opens a monthly issue listing skill references whose sources are older than 90 days and any drift from the latest `next` and `next-intl`. In a fork, set `NEXT_PUBLIC_SITE_URL` in `.github/workflows/ci.yml` to your own HTTPS origin.

---

## Troubleshooting

### Translations not updating after adding keys

Add the key to `en.json` and every other dictionary. TypeScript checks message keys used in code against `en.json`, but does not compare the other locale files automatically. Restart the dev server if an edited JSON file is not picked up.

### Wrong locale in URL

Check `src/i18n/routing.ts`. With `localePrefix: "as-needed"`, only non-default locales have a prefix. English always uses `/`.

### `useTranslations` returns wrong namespace

Check that the component is inside `NextIntlClientProvider`, which is set in the root layout, and that the namespace exists in the active locale's JSON file.

### Theme flash on load

The server reads the `theme` cookie in `layout.tsx` and applies the class on `<html>` before rendering. Check that the cookie is `light` or `dark` and has path `/` if the initial theme is wrong.

### hreflang URLs incorrect

Build alternate URLs with the helpers in `@/lib/site`, which use `getPathname` and respect `localePrefix: "as-needed"`. English is `/`; it does not use `/en`. See [SEO](#seo) for the URL table.

### JSON-LD not appearing

JSON-LD currently appears only on the default-locale home page (`src/app/[locale]/page.tsx`) and is rendered by a Server Component. View the page source and search for `application/ld+json`.

### Wrong Open Graph image URL

Check that `generateMetadata` sets `metadataBase` and `NEXT_PUBLIC_SITE_URL` points to your domain. The Open Graph image path is relative: `/og-image.png`.

### Sitemap shows wrong domain

Set `NEXT_PUBLIC_SITE_URL` in `.env.local` (dev) or Vercel environment variables (production). `siteConfig.url` drives all sitemap and robots URLs.

### Metadata still in English on /ar

Check `dictionary/ar.json` has a translated `Metadata` namespace. `generateMetadata` calls `getTranslations({ locale, namespace: "Metadata" })` with the route locale.

---

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes. Update every dictionary file when adding translation keys.
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

## Instructions for coding assistants

The repository uses standard `AGENTS.md` files so coding assistants can follow the same project conventions across models and editors. Start with [AGENTS.md](AGENTS.md), then read the nearest scoped guide for the files you are changing. The `.cursor/rules/` files are optional Cursor adapters that point to those shared instructions.

Use the [skills guide](#skills-for-coding-assistants) to choose the next-intl or SEO skill and its relevant playbook.

The public [llms.txt](https://next-app-i18n-starter.vercel.app/llms.txt) is a project overview for tools that read it. Repository instructions live in `AGENTS.md`; `llms.txt` is not a Google Search ranking signal.
