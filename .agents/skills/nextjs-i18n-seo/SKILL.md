---
name: nextjs-i18n-seo
description: Plan, build, audit, or diagnose search discovery for a multilingual Next.js site. Use when work touches hreflang or locale URLs, canonicals, sitemap, robots, metadata, JSON-LD, product or store pages, blog and article pages, SaaS, docs, local, job, or other site types, Search Console, GA4, or Bing measurement, or AI search and crawler policy (AI Overviews, ChatGPT, Claude, Perplexity, Copilot). Also for any question about ranking, traffic, indexing, or AI citations. Not for next-intl API work; use next-intl-i18n, and load both when a route or locale is added.
---

# Next.js multilingual SEO

Search engines do four things with a page: find it, fetch it, understand it, and choose it over its alternatives. Every SEO problem is one of these failing. Name the failing step before proposing a change. A fix aimed at the wrong step looks like progress and changes nothing.

Checked 2026-09-30. Platform rules move, and AI-search rules move fastest. Every playbook dates its sources and tags its claims. Read [evidence and reporting](references/evidence-and-reporting.md) once per task. It defines the tags used below: `[doc]`, `[spec]`, `[study]`, `[practice]`, `[local]`, `[secondary]`, `[unverified]`.

## Gate: can this URL be indexed at all

Answer before any content or markup work. Stop at the first no.

1. Does it return 200 without a session, to a request with no cookies and no `Accept-Language`?
2. Is it allowed by `robots.ts`, the host, the CDN, and authentication?
3. Is there no `noindex` in the initial HTML or `X-Robots-Tag`?
4. Does its canonical point at itself, or at the URL you intend?
5. Is it linked from an indexed page and listed in the sitemap?

Two variants. Before launch there is no live URL, so run the gate against the route's local output and write the five answers as the launch checklist for the owner. With no production access, hand the same five checks to the owner, each with its expected result and the URL to run it on. In both cases every result is a hypothesis until it is checked live, and the report says so.

## Pick the playbooks

Load every row that matches. Mixed requests need several.

| Request | Read |
| --- | --- |
| Not indexed, wrong URL shown, rendering, robots, sitemap, redirects, status codes, canonicals, Core Web Vitals | [Technical SEO](references/technical-seo.md) |
| Locale routes, `hreflang`, language or country targeting, translated metadata, switcher, market launch | [International SEO](references/international-seo.md) |
| Any JSON-LD, rich result, or "add schema" | [Structured data](references/structured-data.md) |
| Store, catalog, category, product, variants, price, stock, feeds, currency markets, AI shopping | [Commerce and products](references/commerce-and-products.md) |
| Blog, article, news, archive, author page, syndication, content refresh | [Editorial and publishing](references/editorial-and-publishing.md) |
| Page copy, titles, headings, internal links, keyword or intent work, programmatic pages | [Content and on-page](references/content-and-onpage.md) |
| SaaS, docs, marketplace, local, jobs, recipes, events, video, app, course, forum, portfolio, real estate, travel | [Site types](references/site-types-and-search-features.md) |
| Search Console, GA4, Bing Webmaster, Core Web Vitals reporting, traffic drop, one locale's drop, silent locale | [Measurement](references/measurement.md) |
| AI Overviews, ChatGPT, Claude, Perplexity, Copilot, `llms.txt`, GEO, browser agents | [AI and agentic discovery](references/ai-and-agentic-discovery.md) |
| `robots.ts`, crawler tokens, block or allow a bot, log analysis | [AI crawler reference](references/ai-crawler-reference.md) |
| Full audit, launch gate, migration, locale added or removed, monitoring | [Audits, launches, migrations](references/audits-launches-migrations.md) |
| Any report or any claim about rankings, indexing, traffic, or citations | [Evidence and reporting](references/evidence-and-reporting.md) |

Common combinations: a translated product launch is commerce, international, structured data, and technical. A traffic drop is measurement, then audits, then the layer it points to. A new blog is editorial, international, and structured data.

## Hard rules

Each rule carries its reason and its evidence tag.

1. Every translated, indexable page has its own URL, a self-canonical, and a sitemap entry. Search engines do not follow cookies or `Accept-Language`, so one URL cannot serve many languages. [doc]
2. `hreflang` links only real, reviewed translations, is reciprocal, self-referencing, and absolute, and is generated from one function. Copies in HTML and the sitemap are fine when identical. A third copy with different tags, such as the proxy `Link` header, is the failure. Non-reciprocal annotations are ignored. [doc]
3. Never redirect by language, cookie, or IP. Googlebot sends no `Accept-Language` and crawls mostly from the US, so a redirect hides pages from it. [doc]
4. Structured data describes what the page shows and nothing else. It is not a ranking factor, and mismatched markup breaks policy. [doc]
5. A sitemap lists only indexable 200 canonical URLs. `lastModified` comes from a real content change, never a build time. [doc]
6. Never claim an SEO result you did not observe on the owning platform's report. Eligibility, valid markup, and a submitted sitemap are not indexing, rankings, traffic, or citations.
7. Never add an AI-specific tactic (`llms.txt`, "AI schema", chunking, rewriting for AI, `Content-Signal`) as a ranking action. Google says none are needed, and the evidence for the rest is correlational. [doc]
8. Change crawler policy only when asked. Training, search, and user-initiated fetch are three separate owner decisions.
9. Do not scale pages. A page that would not be worth visiting as the only page should not exist. Unreviewed bulk machine translation is scaled content abuse. [doc]
10. Read the owning platform's current documentation before advising on a rule that is more than 90 days old or tagged `[secondary]`. If you cannot, say so.

## Workflow

1. Read the root `AGENTS.md` and the nearest scoped guide. Read the route, its rendered output, and the helpers in `src/lib/site.ts`. Never read `.env`.
2. Name the URL set, page type, locale or market, search surface, and target outcome. Take deployment facts from tracked files and the user. This repository's demo URL and author are not defaults for a fork. Ask when an answer changes the work: the business model for commerce, the market for a locale, what "traffic" measures.
3. Run the gate. Then gather evidence at the failing layer: source and local output prove implementation, live responses prove deployment, and Search Console and Bing prove their own observations.
4. Make the smallest coherent change. When a route or locale is added, reconcile its body, canonical, alternates, sitemap, internal links, and structured data as one URL set. Reuse project helpers.
5. Verify at the layer changed. Run `node .agents/skills/nextjs-i18n-seo/scripts/verify-seo.mjs` against a running server, `bun run lint` after TypeScript edits, and `bun run build` after substantive changes. When no server may run, or the request is advice only, skip what cannot run and list it under Not verified. Report local and production checks separately.
6. Report in the shape from [evidence and reporting](references/evidence-and-reporting.md#implementation-report-shape). "Not verified" is a valid entry.

## Never, instead

| Never | Instead | Why |
| --- | --- | --- |
| Canonicalize translations to English | Self-canonical each locale | The locales fall out of results |
| Emit alternates for every configured locale on a partially translated page | Emit the reviewed set | Alternates to missing pages are ignored or harmful |
| Block a URL in robots.txt to `noindex` it | Allow the fetch and send `noindex` | A blocked page never shows its `noindex` |
| Redirect a removed product to the homepage | 404, 410, or the true successor | It reads as a soft 404 |
| Add FAQ markup for a rich result | Write the FAQ content only if readers ask | Google removed FAQ rich results in May 2026 |
| Change `dateModified` to look fresh | Change it after a substantive edit | Timestamp-only edits earn nothing |
| Put `Product` markup on a category page | `BreadcrumbList` | Category pages are not merchant listings |

## This template

- English is `/`. Other locales use a prefix. `localeDetection` is `false`.
- Build canonical and alternate URLs with `getLocaleUrl`, `getAlternateLanguages`, and `createLocalizedMetadata` from `src/lib/site.ts`. They emit every configured locale, which is correct only for fully translated pages. [International SEO](references/international-seo.md#this-template) has a signature that takes a per-page locale set. `createLocalizedMetadata` also hardcodes `type: "website"` and one image, so articles need those as inputs.
- `localeConfig[locale].languageTag` supplies `lang`, `hreflang`, and Open Graph tags. Route keys are not tags. `localeConfig` also ties one currency to each locale, so a second currency for one language needs its own route locale.
- Keep JSON-LD in a Server Component and escape `<`. The `WebSite` node belongs on the default-locale homepage only.
- Two gaps, observed locally 2026-09-30 `[local]`, are in [international SEO](references/international-seo.md#this-template): the proxy's `Link` header duplicates alternates with different tags, and `NEXT_LOCALE` is still written on `/`. `robots.ts` allows every crawler, which is policy B in the [crawler reference](references/ai-crawler-reference.md#policy-options).
- Add message keys to every `dictionary/*.json`. The demo is fully translated, and a fork's market decisions are its own.

## Read next

- [README](../../../README.md) for the human implementation guide.
