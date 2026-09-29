---
name: nextjs-seo-technical
description: Diagnose or fix why a Next.js page is not found, fetched, rendered, or indexed. Covers robots, sitemap, redirects, status codes, canonicals, page metadata, Core Web Vitals, site audits, launch checks, and migrations, and holds the verify-seo script. Use for indexing problems and pre-launch checks. Not for hreflang or translations (nextjs-seo-international), JSON-LD (nextjs-seo-structured-data), or analytics (nextjs-seo-measurement).
---

# Technical SEO for Next.js

Search engines find a page, fetch it, understand it, and choose it over alternatives. Every technical problem is one of these failing. Name the failing step before proposing a change. A fix aimed at the wrong step looks like progress and changes nothing.

## Gate: can this URL be indexed at all

Answer before any other work. Stop at the first no.

1. It returns 200 to a request with no cookies and no `Accept-Language`.
2. `robots.ts`, the host, the CDN, and authentication allow it.
3. No `noindex` in the initial HTML or `X-Robots-Tag`.
4. Its canonical points at itself, or at the URL you intend.
5. An indexed page links to it and the sitemap lists it.

Skip the gate ("gate not applicable") when nothing creates a URL or alters an indexing signal. Before launch, run it on the route's local output and hand the five answers to the owner as the launch checklist. With no production access, hand over the same five checks, each with its expected result and the URL to run it on. Every result is a hypothesis until checked live.

## Read

| Task | Reference |
| --- | --- |
| Missing from results, wrong URL shown, rendering, robots, sitemap, redirects, status codes, canonicals, Core Web Vitals, Next.js metadata | [Technical SEO](references/technical-seo.md) |
| Site audit, launch gate, URL or domain migration, locale added or removed | [Audits, launches, migrations](references/audits-launches-migrations.md) |
| A long audit or diagnosis report, finding dispositions | [Evidence and reporting](references/evidence-and-reporting.md) |

## Rules

1. A sitemap lists only indexable 200 canonical URLs, with `lastModified` from a real content change, never a build time. [doc]
2. Never block a URL in robots.txt to `noindex` it. A blocked page never shows its `noindex`. Allow the fetch and send `noindex`. [doc]
3. Never redirect a removed page to the homepage. Use 404, 410, or the true successor. It reads as a soft 404. [doc]
4. A `notFound()` page returns 404 only if nothing has started streaming. Check the status with `curl -sI`. [doc]
5. Never claim an SEO result you did not observe on the owning platform's report. A green build, valid markup, and a submitted sitemap are not indexing.
6. In this template, `node .agents/skills/nextjs-seo-technical/scripts/verify-seo.mjs --base http://localhost:3000` checks canonicals, alternates, `lang`, JSON-LD, sitemap agreement, and language redirects on a running site. It proves local implementation only.

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

Related skills: `nextjs-seo-international` for hreflang and locale URLs, `nextjs-seo-structured-data` for JSON-LD, `nextjs-seo-measurement` for Search Console data, `next-intl-i18n` for routing code.
