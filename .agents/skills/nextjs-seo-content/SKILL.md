---
name: nextjs-seo-content
description: Content SEO for Next.js sites. Covers blog and article publishing, archives, news, syndication, refreshes, page copy, titles, headings, internal links, search intent, programmatic pages, and page types such as SaaS, docs, local, jobs, recipes, and events. Use when writing or planning pages people search for. Not for store catalogs (nextjs-seo-commerce) or indexing faults (nextjs-seo-technical).
---

# Content SEO for Next.js

A page earns traffic by finishing one search task better than the alternatives. Decide the task, then build the page, its links, and its markup around it. Before writing, confirm the URL passes the indexing gate in `nextjs-seo-technical`.

## Read

| Task | Reference |
| --- | --- |
| Page copy, titles, headings, internal links, intent, programmatic pages, AI-assisted drafting | [Content and on-page](references/content-and-onpage.md) |
| Blog, article, news, archive, author page, syndication, refresh, translating editorial content | [Editorial and publishing](references/editorial-and-publishing.md) |
| SaaS, docs, marketplace, local, jobs, recipes, events, video, app, course, forum, portfolio, real estate, travel | [Site types](references/site-types-and-search-features.md) |

A new blog needs the editorial gate and the on-page reference.

## Rules

1. Do not scale pages. A page not worth visiting as the only page should not exist. Unreviewed bulk machine or AI generation is scaled content abuse. [doc]
2. One search task per page. Two pages for the same task compete. Merge them, or make the difference explicit. [practice]
3. Change `dateModified` only after a substantive edit. Timestamp-only edits earn nothing and erode trust. [doc]
4. Internal links use descriptive anchor text and reach every page from an indexed page. An orphan is not found by links. [doc]
5. Localize copy for the market's search terms. A literal translation of the English keywords misses how that language searches. [practice]

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

Related skills: `nextjs-seo-structured-data` for Article and other markup, `nextjs-seo-international` for translated pages and alternates, `nextjs-seo-measurement` for whether a page works, `nextjs-seo-technical` for indexing.
