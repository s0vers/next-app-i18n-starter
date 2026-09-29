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
│   │   │   ├── layout.tsx          # Metadata, theme SSR, providers, page shell
│   │   │   ├── page.tsx            # Home + JSON-LD structured data
│   │   │   ├── not-found.tsx       # Localized 404
│   │   │   ├── error.tsx           # Localized error boundary
│   │   │   └── [...rest]/          # Catch-all → not-found
│   │   ├── global-error.tsx        # Last-resort error page (replaces the root layout)
│   │   ├── globals.css             # Tailwind + CSS variables
│   │   ├── favicon.ico             # Site icon
│   │   ├── robots.ts               # Dynamic robots.txt
│   │   └── sitemap.ts              # Sitemap with hreflang alternates
│   ├── components/
│   │   ├── pages/HomeIndex.tsx     # Landing page (hero + tabs), a Server Component
│   │   ├── CopyableCode.tsx        # Copy button, the page's client island
│   │   ├── SiteHeader.tsx          # Logo, language switcher, theme toggle (every page)
│   │   ├── SiteFooter.tsx          # Footer (every page)
│   │   ├── LocalizationTab.tsx     # Locale formatting demo
│   │   ├── LanguageSwitcher.tsx    # Locale dropdown
│   │   ├── ModeToggle.tsx          # Light/dark toggle
│   │   ├── OmitRtl.tsx             # Forces LTR inside RTL pages
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
├── CONTRIBUTING.md                 # How to set up and send a change
├── SECURITY.md                     # How to report a vulnerability
├── GUIDE.md                        # Ten minute tour of how i18n works here
├── .env.example
├── global.d.ts                     # next-intl AppConfig types
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Skills for coding assistants

This repository ships eight skills in `.agents/skills/`: one for next-intl and seven for SEO. They guide work on this starter and on forks. Each skill is a short `SKILL.md` that sends the agent to playbooks in its own `references/` folder, and the agent loads only what the task needs. A skill installed on its own carries everything it needs, and the SEO skills name each other instead of linking. The playbooks cover products, blogs, and GA4, which the starter itself does not include.

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

### The SEO skills

Search work is split into seven skills, so an agent loads only the one a task needs. Each has a narrow description that names what it is not for, and each keeps its playbooks in its own `references/` folder. Every playbook dates its sources and tags each claim as documented, standard, study, practice, or unverified.

| Skill | Use it for |
| --- | --- |
| [nextjs-seo-technical](.agents/skills/nextjs-seo-technical/SKILL.md) | Pages that are not indexed, robots, sitemap, canonicals, redirects, metadata, audits, launch checks, migrations. Holds `verify-seo.mjs` |
| [nextjs-seo-international](.agents/skills/nextjs-seo-international/SKILL.md) | `hreflang`, language tags, locale URLs, partial translation, the switcher, market launches, this starter's helpers |
| [nextjs-seo-structured-data](.agents/skills/nextjs-seo-structured-data/SKILL.md) | JSON-LD, rich results, Product and Offer fields, removed features |
| [nextjs-seo-commerce](.agents/skills/nextjs-seo-commerce/SKILL.md) | Store URLs, facets, variants, stock states, currency markets, feeds |
| [nextjs-seo-content](.agents/skills/nextjs-seo-content/SKILL.md) | Blogs, articles, page copy, internal links, SaaS, docs, local, and other page types |
| [nextjs-seo-measurement](.agents/skills/nextjs-seo-measurement/SKILL.md) | Search Console, GA4, Bing, traffic-drop diagnosis |
| [nextjs-seo-ai-search](.agents/skills/nextjs-seo-ai-search/SKILL.md) | AI Overviews, ChatGPT, Claude, Perplexity, AI crawler policy, `llms.txt` |

Check hreflang reciprocity, canonicals, `lang`, JSON-LD, sitemap agreement, and language redirects on a running site:

```bash
bun run dev
bun run seo:verify -- --base http://localhost:3000
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
export default getRequestConfig(async ({ locale }) => {
  // Page renders read the locale from the [locale] route segment. Route
  // Handlers and Server Actions pass one explicitly.
  const requested = locale ?? (await rootParams.locale());
  if (!hasLocale(routing.locales, requested)) notFound();

  const { currency, timeZone } = localeConfig[requested];

  return {
    locale: requested,
    timeZone,
    now: new Date(),
    formats: createRegionalFormats(currency),
    messages: (await import(`../../dictionary/${requested}.json`)).default,
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
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

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
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
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
import OmitRTL from "@/components/OmitRtl";

function CodeBlock({ code }: { code: string }) {
  return (
    <OmitRTL omitRTL>
      <pre><code>{code}</code></pre>
    </OmitRTL>
  );
}
```

Import the default export from `@/components/OmitRtl`. The examples name it `OmitRTL`.

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

Every locale page gets a self-canonical URL, reciprocal `hreflang` alternates, translated title and description, Open Graph and Twitter tags, and a sitemap entry. All of it comes from one place, so the pieces cannot drift apart.

| File | Responsibility |
| --- | --- |
| `src/lib/site.ts` | Site identity, validated origin, `getLocaleUrl`, `getAlternateLanguages`, `createLocalizedMetadata` |
| `src/app/[locale]/layout.tsx` | `generateMetadata` for each locale |
| `src/app/[locale]/page.tsx` | `WebSite` JSON-LD (default locale only) |
| `src/app/sitemap.ts`, `robots.ts` | `/sitemap.xml` with alternates, `/robots.txt` |
| `dictionary/{locale}.json` | `Metadata.title` and `Metadata.description` per locale |

English lives at `/` and the other locales at `/{locale}`, because routing uses `localePrefix: "as-needed"`. Automatic locale detection is off, so cookies and browser language never redirect a URL. Each language is directly crawlable.

### Add SEO to a new page

```tsx
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
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

Then add `metaTitle` and `metaDescription` to every dictionary, and one sitemap entry per locale with `getAlternateLanguages("/about")`.

### Before you launch a fork

- [ ] Set `NEXT_PUBLIC_SITE_URL` to your HTTPS origin. Production builds reject placeholders.
- [ ] Replace the site name, repository link, and author in `src/lib/site.ts`.
- [ ] Replace `public/og-image.png` (1200×630) and translate the `Metadata` namespace.
- [ ] Set `GOOGLE_SITE_VERIFICATION` if you verify by meta tag, and remove the demo's `public/google52d37058772b10e6.html`.
- [ ] Submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- [ ] Run `bun run seo:verify -- --base http://localhost:3000` against a running build.

The [SEO guide](SEO.md) has the full reference: metadata fields, hreflang table, JSON-LD, sitemap and robots output, Open Graph, AI crawler policy, the complete launch checklist, and how to check each output. Nothing here guarantees indexing, rankings, or AI citations. Only Search Console and Bing report those.

---

## Environment variables


| Variable               | Required | Default                                    | Description                                  |
| ---------------------- | -------- | ------------------------------------------ | -------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Production required | Project origin in `.env.example`; localhost fallback when unset in development; the deployment's own URL on Vercel preview deployments | HTTPS origin for canonical URLs, sitemap, and social metadata |
| `GOOGLE_SITE_VERIFICATION` | No | Unset | Optional Search Console meta-tag verification token |


```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://next-app-i18n-starter.vercel.app
# Optional
GOOGLE_SITE_VERIFICATION=your-search-console-token
```

See `.env.example` for the template.

On Vercel, preview deployments (every pull request) build without `NEXT_PUBLIC_SITE_URL` when it is set for Production only, so `src/lib/site.ts` uses the preview's own `VERCEL_URL`. Production builds and other hosts still fail without the variable, which is deliberate: a missing value there would publish canonical URLs on the wrong domain. If you deploy previews somewhere else, set the variable for that environment too.

---

## Deployment

Works on [Vercel](https://vercel.com) out of the box.

1. Push to GitHub
2. Import project in Vercel
3. Set `NEXT_PUBLIC_SITE_URL` to `https://next-app-i18n-starter.vercel.app` for this project; forks must use their own production origin
4. Deploy

The proxy (`src/proxy.ts`) runs on the Node.js runtime, which is the Next.js 16 default. No extra configuration is needed for i18n routing.

For other hosts, configure:

- Node.js 24+
- Run `bun run build`, then start the server with `bun run start` or the host's equivalent command.
- All locale paths (`/`, `/ar`, `/zh`, etc.) route to the Next.js server

---

## Scripts

```bash
bun run dev    # Start the development server (Turbopack)
bun run build  # Build for production
bun run start  # Start the production server
bun run lint   # Run ESLint
bun run typecheck  # Run the TypeScript compiler without emitting
bun run check  # ESLint, types, locale registry and message parity, and skills structure
```

GitHub Actions runs lint, the typecheck, `bun run i18n:check`, `bun run skills:check`, the build, and `node .agents/skills/nextjs-seo-technical/scripts/verify-seo.mjs` against the production build on every push and pull request. A second workflow opens a monthly issue listing skill references whose sources are older than 90 days and any drift from the latest `next` and `next-intl`. In a fork, set `NEXT_PUBLIC_SITE_URL` in `.github/workflows/ci.yml` to your own HTTPS origin.

---

## Troubleshooting

### Translations not updating after adding keys

Add the key to `en.json` and every other dictionary. TypeScript checks message keys used in code against `en.json`, but does not compare the other locale files automatically. Restart the dev server if an edited JSON file is not picked up.

### `Failed to load native binding` or an SWC cache error on Windows

`next-intl` loads `@swc/core` from `next.config.ts`. From 1.16, SWC extracts its native addon into `%LOCALAPPDATA%swc` and refuses a cache folder whose ancestors grant write rights to an AppContainer account, which some Windows setups do. The `overrides` entry in `package.json` pins `@swc/core` to 1.15.33, which loads its addon directly. Keep the override until you have checked that `bun run build` works on your machine without it.

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
