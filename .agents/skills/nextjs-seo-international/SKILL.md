---
name: nextjs-seo-international
description: Multilingual SEO for a Next.js site. Covers hreflang, language tags, locale URL structure, partial translation, the locale switcher, translated metadata, translation quality, other search engines, and market launches. Use when a locale route or its alternate links change, or when a translation's search visibility is in question. Not for next-intl API code (next-intl-i18n) or general indexing faults (nextjs-seo-technical).
---

# International SEO for Next.js

A language switcher is a product feature. International SEO also needs the right audience, URL, content, and search intent per market. Before any content work, confirm each locale URL returns 200 without cookies, is not blocked or `noindex`, canonicalizes to itself, and is linked and in the sitemap.

## Read

| Task | Reference |
| --- | --- |
| Tags, URL structure, alternate sets, partial translation, the switcher, translation quality, Bing, Yandex, Baidu, per-locale notes | [International SEO](references/international-seo.md) |
| Helpers, routing flags, and defaults in this starter (`getAlternateLanguages`, `alternateLinks`, `localeCookie`) | [Template notes](references/template-notes.md) |

## Rules

1. Every translated, indexable page has its own URL, a self-canonical, and a sitemap entry, because search engines follow neither cookies nor `Accept-Language`. Never canonicalize translations to English. [doc]
2. `hreflang` links only real, reviewed translations, reciprocal, self-referencing, absolute, and generated from one function. Identical copies in HTML and the sitemap are fine. A third copy with other tags (the proxy `Link` header) is the failure. An alternate to a page that does not exist is harmful. [doc]
3. Never redirect by language, cookie, or IP. Googlebot sends no `Accept-Language` and crawls mostly from the US, so the redirect hides pages from it. [doc]
4. Never emit alternates for every configured locale on a partly translated page. Emit the reviewed set, and return 404 for the rest. [doc]
5. Unreviewed bulk machine translation is scaled content abuse. A locale page that renders the default language is a duplicate. [doc]
6. Use language-only tags (`es`, `zh-Hans`) unless the content differs by country. Google accepts only ISO 639-1 languages, optional ISO 15924 scripts, and ISO 3166-1 regions. [doc]

<!-- shared:start -->
## Working method

1. Orient. Read the root `AGENTS.md`, the route and its rendered output, and `src/lib/site.ts`. Never read `.env`. Done when you can name the helper that builds the page's metadata.
2. Frame. Write the URL set, page type, locale or market, and target outcome, one line each. Ask only when an answer changes the work, and state the default you will use if nobody answers.
3. Change and verify. Make the smallest change with project helpers. Run `node .agents/skills/nextjs-seo-technical/scripts/verify-seo.mjs` against a running server and `bun run check`. Skip what cannot run (no server, advice only) and list it under Not verified.
4. Report, in the shape below.

## Evidence and report

Tag a claim when a decision depends on it: `[doc]` platform documentation or a standard, `[study]` a measurement with a stated method, `[practice]` practitioner evidence, `[local]` read or run in this repository, `[unverified]` anything else. State how far it got: read, run locally, reproduced on a live URL, or confirmed by the platform's own report. Indexing, rankings, traffic, and citations are confirmed only by that report, so a build, a validator pass, or a submitted sitemap proves eligibility at most. Read the platform's current page before advising on a rule more than 90 days old or tagged `[unverified]`. Each check ends VERIFIED, FAILED, INCONCLUSIVE, or NOT VERIFIED.

End with Questions, Findings (most severe first: claim, evidence, cause, action, how to verify), Not verified, Owner actions, and a Verdict (ship, ship with follow-ups, or block). With no production access, hand the owner the checks and the URL to run each on. In an unattended run take the conservative default (no crawler policy change, no claim about the live site, language-only tags) and record the assumption.
<!-- shared:end -->

Related skills: `next-intl-i18n` for routing, messages, and adding a locale, `nextjs-seo-technical` for indexing faults and the verify script, `nextjs-seo-structured-data` for localized JSON-LD, `nextjs-seo-commerce` for currency markets.
