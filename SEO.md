# SEO guide

The full reference for how this starter builds search metadata. The [README](README.md#seo) has the short version. The agent skills in `.agents/skills/nextjs-seo-*` cover deeper practice: indexing faults, hreflang, structured data, commerce, content, measurement, and AI search.

The SEO setup uses the Next.js Metadata API, next-intl URL helpers, JSON-LD structured data, and generated sitemap and robots routes. Canonical and alternate URLs follow `localePrefix: "as-needed"` routing.

## SEO architecture overview

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

## Files involved


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


## Central site config

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

## Metadata API (`generateMetadata`)

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

## Metadata fields in HTML


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


## Locale-aware URLs and hreflang

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

## Translation-driven metadata

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

## HTML semantics (`lang` and `dir`)

The root layout sets semantic HTML attributes on `<html>`:

```tsx
<html
  lang={localeConfig[locale].languageTag} // e.g. "ar-SA", "zh-Hans-CN"
  dir={localeConfig[locale].dir}   // "rtl" or "ltr", set per locale in locales.ts
  className={initialTheme}
>
```

`localeConfig` maps route keys to BCP 47 language tags and Open Graph locale tags. For example, the `/zh` route is marked `zh-Hans-CN` because its content and regional formats target Simplified Chinese in mainland China. `dir` comes from the same registry, so a new right-to-left locale needs one field, not a code change. Search engines primarily determine page language from visible content, so translate the page itself as well as its metadata.

`generateStaticParams` enumerates the supported locale routes. The layout reads a theme cookie, so the homepage is rendered per request:

```ts
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
```

## JSON-LD structured data

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

## Sitemap

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

## Robots.txt

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

## Open Graph and Twitter Cards

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


## Open Graph image

`public/og-image.png` is a 1200×630 PNG referenced in both Open Graph and Twitter metadata. Because `metadataBase` is set, Next.js resolves it to `https://your-domain.com/og-image.png`.

Replace this file with your own branded image before production launch. Recommended:

- 1200×630 px (1.91:1 ratio)
- Include site name and author/branding
- Keep important content in the center (cropped on some platforms)

## Google Search Console verification

The Google verification meta tag is optional and reads the server-only `GOOGLE_SITE_VERIFICATION` environment variable. Leave it unset when you do not need meta-tag verification:

```ts
verification: siteConfig.googleSiteVerification
  ? { google: siteConfig.googleSiteVerification }
  : undefined,
```

When configured, this renders `<meta name="google-site-verification" content="...">` in `<head>`. Obtain your token from [Google Search Console](https://search.google.com/search-console) and set it in deployment secrets; do not commit it to source control.

The legacy static verification file `public/google52d37058772b10e6.html` remains for the current demo property's alternate verification. Remove or replace it only after the demo property's Search Console ownership has been migrated.

## AI search and crawler access

AI search services need access to pages they can crawl and index. Put useful content in server-rendered HTML, use descriptive headings and internal links, and check crawler access in `robots.txt`, hosting rules, and any CDN configuration. These practices also support conventional search. Google does not require special AI schema and says `llms.txt` is not a Google Search ranking signal. This repository keeps `public/llms.txt` as an optional project reference for tools that read it.

The current `robots.ts` allows all user agents. Search discovery and model-training crawlers have different purposes, and site owners should choose those policies explicitly. For example, OpenAI distinguishes `OAI-SearchBot` from `GPTBot`; Anthropic distinguishes `Claude-SearchBot` from `ClaudeBot`; Perplexity distinguishes `PerplexityBot` from its user-request fetcher. Review each provider's current documentation before setting rules: [OpenAI](https://developers.openai.com/api/docs/bots), [Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), and [Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers). This starter does not impose a model-training policy for a fork. The [AI crawler reference](.agents/skills/nextjs-seo-ai-search/references/ai-crawler-reference.md) lists current crawler tokens and three policy options, and its [AI discovery playbook](.agents/skills/nextjs-seo-ai-search/references/ai-and-agentic-discovery.md) separates the documented controls from unsupported tactics.

Locale routing keeps the default-language URL stable: `localeDetection` is disabled, so `/` does not redirect based on a visitor's saved locale cookie or `Accept-Language`. Visitors can choose a language through the visible switcher, and each locale keeps a directly crawlable URL. This avoids cookie-dependent content and follows Google's guidance to expose language versions at distinct URLs. Enable automatic detection only if it is an intentional product choice and verify that every locale remains directly accessible and self-canonical.

For measurement, verify the domain and sitemap in [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters). Bing Webmaster Tools provides an AI Performance report. ChatGPT referrals may include `utm_source=chatgpt.com`; analytics can use that value when the selected provider captures query parameters. None of these steps guarantees indexing, rankings, or AI citations.

## SEO implementation plan

The production-origin guard, optional verification setting, removal of meta-keywords, root-only site-name schema, visible localized launch guide, and crawler/measurement guidance are implemented. Deployment owners still need to set their real HTTPS origin, configure verification if needed, and verify the live property and crawler access through their hosting provider and webmaster tools.

## Adding SEO to a new page

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

## Production SEO checklist

- [ ] Set `NEXT_PUBLIC_SITE_URL` to your production domain
- [ ] Replace the demo site name, repository link, and author details in `src/lib/site.ts`
- [ ] Replace `public/og-image.png` with your branded 1200×630 image
- [ ] Set `GOOGLE_SITE_VERIFICATION` if using meta-tag verification; migrate the current static demo verification only if you control that Search Console property
- [ ] Run the launch gate in the [`nextjs-seo-technical` skill](.agents/skills/nextjs-seo-technical/references/audits-launches-migrations.md#launch-gate) and confirm the origin, identity, and page copy for your fork
- [ ] Translate `Metadata` namespace in all dictionary files
- [ ] Submit `https://your-domain.com/sitemap.xml` in Google Search Console
- [ ] Verify hreflang with [hreflang Tags Testing Tool](https://technicalseo.com/tools/hreflang/)
- [ ] Validate JSON-LD with [Schema Markup Validator](https://validator.schema.org/); check site-name eligibility with Search Console URL Inspection
- [ ] Test social previews with [opengraph.xyz](https://www.opengraph.xyz/) or Twitter Card Validator
- [ ] Confirm `/robots.txt` and `/sitemap.xml` return 200 in production
- [ ] Add new pages to `sitemap.ts` with locale alternates
- [ ] Confirm the language and region targets in `src/i18n/locales.ts` match real audience and market research; translation alone does not establish local search intent

## Verifying SEO output

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
# Should show: <html lang="ar-SA" dir="rtl" ...>

curl -s http://localhost:3000/ja | grep '<title>'
# Should show Japanese title from dictionary/ja.json Metadata
```

### Check the sitemap and robots file

```bash
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/robots.txt
```

View the page source for `/` and search for `application/ld+json`. The default homepage emits one `WebSite` node with the site root as its URL. Localized homepages such as `/ar` do not emit this node.
