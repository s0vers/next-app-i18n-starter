---
name: nextjs-seo-commerce
description: SEO for online stores on Next.js. Use when launching or auditing products, deciding which category, facet, or variant URLs to index, handling out-of-stock and discontinued products, selling in several currencies or regions, or preparing merchant feeds and AI shopping. For the JSON-LD syntax use nextjs-seo-structured-data, for hreflang nextjs-seo-international.
---

# Commerce SEO for Next.js

A store multiplies URLs: categories, facets, variants, regions. Most commerce SEO is choosing which of them deserve an index entry, then keeping price and stock honest across every surface that shows them.

Before any product work, confirm the URL passes the five-question indexing gate in `nextjs-seo-technical`. In short: 200 without cookies, not blocked, no `noindex`, self-canonical, linked and in the sitemap.

## Read

| Task | Reference |
| --- | --- |
| Which URLs to index, facets, variants, out-of-stock and discontinued products, currency and regional markets, markup and feeds, page checklists | [Commerce and products](references/commerce-and-products.md) |

Read the gate section first. The business model (own inventory, marketplace, subscription, digital) changes the answers.

## Rules

1. Never redirect a removed or discontinued product to the homepage. Use 404, 410, or the true successor. It reads as a soft 404. [doc]
2. Never put `Product` markup on a category page. Use `BreadcrumbList`. Category pages are not merchant listings. [doc]
3. Price, currency, and availability in markup and feeds match the visible page. A mismatch gets the listing disapproved. [doc]
4. A currency is not a market. Share one URL per language unless the page content differs by country, and never redirect by IP or cookie. [doc]
5. A temporary stock-out keeps the page at 200 with the right availability. Remove or redirect only when the product is gone for good, because a page removed and re-added loses its history. [practice]
6. Faceted and filtered URLs are indexable only when they match a real search demand and have unique copy. Otherwise canonicalize to the base category or block them from internal links. [doc]

<!-- shared:start -->
## Working method

1. Orient. Read the root `AGENTS.md` if the project has one, the route and its rendered output, and the file that builds page metadata. Never read `.env`. Done when you can name that file.
2. Frame. Write the URL set, page type, locale or market, and target outcome, one line each. Ask only when an answer changes the work, and state the default you will use if nobody answers. Done when all four lines exist and every open question is asked or carries a stated default.
3. Change and verify. Make the smallest change with the project's own helpers. When a server is running and the `nextjs-seo-technical` skill is installed, run its `scripts/verify-seo.mjs` (in this starter: `bun run seo:verify`), then the project's lint and build. Done when every check ends in one of the four verdicts below.
4. Report, in the shape below.

## Evidence and report

Tag a claim when a decision depends on it: `[doc]` platform documentation or a standard, `[study]` a measurement with a stated method, `[practice]` practitioner evidence, `[local]` read or run in this repository, `[unverified]` anything else. State how far it got: read, run locally, reproduced on a live URL, or confirmed by the platform's own report. Indexing, rankings, traffic, and citations are confirmed only by that report, so a build, a validator pass, or a submitted sitemap proves eligibility at most. Read the platform's current page before advising on a rule more than 90 days old or tagged `[unverified]`.

Each check ends in one verdict. VERIFIED: it ran and passed. FAILED: it ran and the result was wrong. INCONCLUSIVE: it ran and the evidence cannot separate the causes. NOT VERIFIED: it did not run, with the reason.

End with Questions, Findings (most severe first: claim, evidence, cause, action, how to verify), Not verified, Owner actions, and a Verdict. Block when a check FAILED on an indexing or correctness signal or a launch-gate answer is no. Ship with follow-ups when only NOT VERIFIED or INCONCLUSIVE items remain. Ship when every check is VERIFIED. With no production access, hand the owner the checks and the URL to run each on. In an unattended run take the conservative default (no crawler policy change, no claim about the live site, language-only tags) and record the assumption.
<!-- shared:end -->

Related skills: `nextjs-seo-structured-data` for Product and Offer markup, `nextjs-seo-international` for locale alternates, `nextjs-seo-technical` for the gate and sitemaps, `nextjs-seo-ai-search` for AI shopping surfaces.
