---
name: nextjs-i18n-seo
description: Plan, build, audit, or diagnose search discovery for a multilingual Next.js site. Use when work touches hreflang or locale URLs, canonicals, sitemap, robots, metadata, JSON-LD, product or store pages, blog and article pages, SaaS, docs, local, job, or other site types, Search Console, GA4, or Bing measurement, or AI search and crawler policy (AI Overviews, ChatGPT, Claude, Perplexity, Copilot). Also for any question about ranking, traffic, indexing, or AI citations. Not for next-intl API work; use next-intl-i18n, and load both when a route or locale is added.
---

# Next.js multilingual SEO

Search engines find a page, fetch it, understand it, and choose it over alternatives. Every SEO problem is one of these failing. Name the failing step before proposing a change, because a fix aimed at the wrong step looks like progress and changes nothing.

Platform rules move, AI-search rules fastest. Every playbook dates its sources and tags its claims (`[doc]`, `[study]`, `[practice]`, `[local]`, `[unverified]`). Read [evidence and reporting](references/evidence-and-reporting.md) once per task.

## Gate: can this URL be indexed at all

Answer before any content or markup work. Stop at the first no.

1. It returns 200 to a request with no cookies and no `Accept-Language`.
2. `robots.ts`, the host, the CDN, and authentication allow it.
3. No `noindex` in the initial HTML or `X-Robots-Tag`.
4. Its canonical points at itself, or at the URL you intend.
5. An indexed page links to it and the sitemap lists it.

Skip the gate ("gate not applicable") when the change creates no URL and alters no indexing signal: copy edits, measurement setup, documentation. Before launch, run it on the route's local output and hand the five answers to the owner as the launch checklist. With no production access, hand over the same five checks, each with its expected result and the URL to run it on. Every result is a hypothesis until checked live.

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
| Any report, or any claim about rankings, indexing, traffic, or citations | [Evidence and reporting](references/evidence-and-reporting.md) |
| Editing this starter or a fork: helpers, routing flags, defaults | [This template](references/template-notes.md) |

A translated product launch is commerce, international, structured data, and technical. A traffic drop is measurement, then audits, then the layer it points to. A new blog is editorial, international, and structured data.

## Hard rules

Each carries its reason and evidence tag.

1. Every translated, indexable page has its own URL, a self-canonical, and a sitemap entry, because search engines follow neither cookies nor `Accept-Language`. Never canonicalize translations to English. [doc]
2. `hreflang` links only real, reviewed translations, reciprocal, self-referencing, absolute, and generated from one function. Identical copies in HTML and the sitemap are fine. A third copy with other tags (the proxy `Link` header) is the failure. Non-reciprocal or missing-page alternates are ignored or harmful. [doc]
3. Never redirect by language, cookie, or IP. Googlebot sends no `Accept-Language` and crawls mostly from the US, so the redirect hides pages from it. [doc]
4. Structured data describes what the page shows and nothing else. It is not a ranking factor, and mismatched markup breaks policy. [doc]
5. A sitemap lists only indexable 200 canonical URLs, with `lastModified` from a real content change, never a build time. [doc]
6. Never claim an SEO result you did not observe on the owning platform's report. Eligibility, valid markup, and a submitted sitemap are not indexing, rankings, traffic, or citations.
7. Never add an AI-specific tactic (`llms.txt`, "AI schema", chunking, rewriting for AI, `Content-Signal`) as a ranking action. Google says none are needed, and the evidence for the rest is correlational. [doc]
8. Change crawler policy only when asked. Training, search, and user-initiated fetch are three separate owner decisions.
9. Do not scale pages. A page not worth visiting as the only page should not exist, and unreviewed bulk machine translation is scaled content abuse. [doc]
10. Read the owning platform's current documentation before advising on a rule more than 90 days old or tagged `[unverified]`. If you cannot, say so.

## Workflow

Each step ends when its criterion holds.

1. Orient. Read the root `AGENTS.md`, the nearest scoped guide, the route and its rendered output, and the helpers in `src/lib/site.ts`. Never read `.env`. Done when you can name the helper that builds the page's metadata.
2. Frame. Write the URL set, page type, locale or market, search surface, and target outcome, one line each. Take deployment facts from tracked files and the user, since this repository's demo URL and author are not defaults for a fork. Ask when an answer changes the work (business model, market, what "traffic" measures) and state the default you will use if nobody answers. Done when all five lines exist.
3. Gate and evidence. Run the gate, then gather evidence at the failing layer: source and local output prove implementation, live responses prove deployment, Search Console and Bing prove their own observations. Done when each gate answer carries a tag and a rung.
4. Change. Make the smallest coherent change with project helpers. When a route or locale is added, reconcile body, canonical, alternates, sitemap, internal links, and structured data as one URL set. Done when every URL in the set agrees on all six.
5. Verify. Run `node .agents/skills/nextjs-i18n-seo/scripts/verify-seo.mjs` against a running server, `bun run lint` after TypeScript edits, and `bun run build` after substantive changes. Done when the script exits 0, or each skipped check is under Not verified with its reason. With no server, or for advice only, skip what cannot run.
6. Report in the shape in [evidence and reporting](references/evidence-and-reporting.md#seo-report-shape). Done when no field is blank.

When nobody can answer a question (an unattended run), take the conservative default from [evidence and reporting](references/evidence-and-reporting.md#unattended-runs), record the assumption, and continue.

## Never, instead

| Never | Instead | Why |
| --- | --- | --- |
| Block a URL in robots.txt to `noindex` it | Allow the fetch and send `noindex` | A blocked page never shows its `noindex` |
| Redirect a removed product to the homepage | 404, 410, or the true successor | It reads as a soft 404 |
| Add FAQ markup for a rich result | Skip it | Google removed FAQ rich results in May 2026 |
| Change `dateModified` to look fresh | Change it after a substantive edit | Timestamp-only edits earn nothing |
| Put `Product` markup on a category page | `BreadcrumbList` | Category pages are not merchant listings |
