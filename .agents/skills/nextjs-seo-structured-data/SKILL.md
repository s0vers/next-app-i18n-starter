---
name: nextjs-seo-structured-data
description: JSON-LD and rich results for a Next.js site. Covers which schema type fits a page, which Google features exist or were removed (FAQ, HowTo), Product and Offer fields, and the Server Component pattern. Use when adding, changing, or auditing structured data or when someone asks for schema or rich results. Not for page metadata or canonicals (nextjs-seo-technical) or store strategy (nextjs-seo-commerce).
---

# Structured data for Next.js

Markup describes what the page shows. It does not rank a page and does not guarantee a rich result. Google says AI Overviews and AI Mode need no special markup.

## Read

| Task | Reference |
| --- | --- |
| Which type for a page, supported versus removed features, Product and Offer fields, the JSON-LD pattern, verification | [Structured data](references/structured-data.md) |

## Rules

1. Every value is visible on the page, or comes from the same data as the visible value. Hidden or mismatched markup breaks Google's policy. [doc]
2. Google's gallery changes without notice. Open the current search gallery before claiming a feature. [doc]
3. Render JSON-LD in a Server Component with a native `<script type="application/ld+json">`, serialized with `JSON.stringify(data).replace(/</g, "\\u003c")`. [doc]
4. Localize every string in the markup with the page's content. [doc]
5. Never add FAQ markup for a rich result. Google removed FAQ rich results in May 2026. [doc]
6. Never put `Product` markup on a category page. Use `BreadcrumbList`. [doc]
7. A validator pass proves eligibility, not display.

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

Related skills: `nextjs-seo-commerce` for product strategy, `nextjs-seo-content` for article markup, `nextjs-seo-international` for localized alternates, `nextjs-seo-technical` for metadata.
