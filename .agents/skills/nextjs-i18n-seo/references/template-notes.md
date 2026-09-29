# This template

Repository facts, not SEO rules. Read this when the task edits this starter or a fork of it. A fork may differ, so check the file before relying on a fact. Observed 2026-09-30 `[local]`.

## URLs and helpers

- English is `/`. Other locales use a prefix. `routing.ts` sets `localeDetection: false`, `localeCookie: false`, and `alternateLinks: false`. The proxy therefore adds no locale redirect, no `NEXT_LOCALE` cookie, and no `hreflang` `Link` header. Keep all three when editing routing, and confirm with `curl -I`.
- Build canonical and alternate URLs with `getLocaleUrl`, `getAlternateLanguages`, and `createLocalizedMetadata` from `src/lib/site.ts`. They emit every configured locale, which is correct only for fully translated pages. [International SEO](international-seo.md#this-template) has a signature that takes a per-page locale set. `createLocalizedMetadata` also hardcodes `type: "website"` and one image, so article pages need those as inputs.
- `localeConfig[locale].languageTag` supplies `lang`, `hreflang`, and Open Graph tags. Route keys are not tags. The tags today are `en-US`, `ar-SA`, `zh-Hans-CN`, `es-ES`, `ja-JP`. They claim a country. Whether to keep them is an owner decision, discussed in [International SEO](international-seo.md#choose-the-tag).
- `localeConfig` ties one currency to each locale (`en` is USD, `es` is EUR). A second currency for one language needs its own route locale. See [commerce](commerce-and-products.md#markets-currency-and-languages).

## Markup, robots, and messages

- JSON-LD stays in a Server Component with `<` escaped. The `WebSite` node belongs on the default-locale homepage only.
- `robots.ts` allows every crawler, which is policy B in the [crawler reference](ai-crawler-reference.md#policy-options). Changing it is an owner decision.
- `sitemap.ts` lists the five homepages with alternates and no `lastModified`.
- Add message keys to every `dictionary/*.json`. The demo is fully translated. A fork's market decisions are its own.
- The starter has only a homepage. It has no product or blog routes and no GA4. Analytics are Vercel Analytics and Speed Insights.

## Checks

```bash
bun run dev
node .agents/skills/nextjs-i18n-seo/scripts/verify-seo.mjs --base http://localhost:3000
```

Expect 0 failures. The script proves local implementation only.
