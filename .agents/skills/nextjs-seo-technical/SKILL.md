---
name: nextjs-seo-technical
description: Diagnose why a Next.js page is missing from Google or fails to be fetched, rendered, or indexed, such as 'Crawled - currently not indexed', a wrong canonical, a stray noindex, a soft 404, a bad redirect, or robots and sitemap faults. Also Core Web Vitals, site audits, launch checks, and URL migrations. For hreflang use nextjs-seo-international, for JSON-LD nextjs-seo-structured-data, for traffic data nextjs-seo-measurement.
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

Skip the gate ("gate not applicable") when nothing creates a URL or alters an indexing signal. Before launch, run it on the route's local output and hand the five answers to the owner as the launch checklist, each with its expected result and the URL to run it on. Every result is a hypothesis until checked live.

## Read

| Task | Reference |
| --- | --- |
| Missing from results, wrong URL shown, rendering, robots, sitemap, redirects, status codes, canonicals, Core Web Vitals, Next.js metadata | [Technical SEO](references/technical-seo.md) |
| Site audit, launch gate, URL or domain migration, locale added or removed | [Audits, launches, migrations](references/audits-launches-migrations.md) |
| A long audit or diagnosis report, finding dispositions | [Evidence and reporting](references/evidence-and-reporting.md) |

## Rules

1. A sitemap lists only indexable 200 canonical URLs, with `lastModified` from a real content change. A build time changes on every deploy and tells crawlers nothing. [doc]
2. Never block a URL in robots.txt to `noindex` it. A blocked page never shows its `noindex`. Allow the fetch and send `noindex`. [doc]
3. Never redirect a removed page to the homepage. Use 404, 410, or the true successor. It reads as a soft 404. [doc]
4. A `notFound()` page returns 404 only if nothing has started streaming, because the status line goes out with the first byte. Check the status with `curl -sI`. [doc]
5. Run this skill's `scripts/verify-seo.mjs --base http://localhost:3000` against a running site (in this starter: `bun run seo:verify -- --base http://localhost:3000`). It checks canonicals, alternates, `lang`, JSON-LD, sitemap agreement, and language redirects. It proves local implementation only.

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

Related skills: `nextjs-seo-international` for hreflang and locale URLs, `nextjs-seo-structured-data` for JSON-LD, `nextjs-seo-measurement` for Search Console data, `next-intl-i18n` for routing code.
