---
name: nextjs-seo-measurement
description: Measure and diagnose search performance for a Next.js site. Covers Search Console, GA4, Bing Webmaster, Core Web Vitals reports, traffic drops, one locale's drop, and locales that get no traffic. Use when the question starts from data, such as clicks, impressions, sessions, or a drop. Not for fixing the cause once found (nextjs-seo-technical, nextjs-seo-international) or AI citation tracking (nextjs-seo-ai-search).
---

# Measuring SEO on Next.js

Each platform reports its own observation. Search Console shows how Google served the site, GA4 shows what visitors did. Neither confirms the other, and neither proves a change worked until a stated window passes.

## Read

| Task | Reference |
| --- | --- |
| Which tool answers which question, setup for a multilingual site, metric traps, diagnosing a traffic drop, one locale's drop, a silent locale | [Measurement](references/measurement.md) |

Diagnose the drop here, then hand the failing layer to the skill that owns the fix.

## Rules

1. Ask what "traffic" means (clicks, sessions, users, revenue) before reading any number. The metrics differ by design. [doc]
2. Never add Search Console clicks to GA4 sessions. They count different events. [doc]
3. Compare like with like: same date range, same country and device filters, same page set, and the same days of the week. [practice]
4. A locale with no impressions is an indexing or targeting problem first. Check the gate for one of its URLs before touching content. [practice]
5. Check whether an anomaly matches a known Google update or an outage on the platform's status page before blaming the site. [practice]
6. Every result is a hypothesis until it appears in the owning platform's report.

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

Related skills: `nextjs-seo-technical` for indexing faults and audits, `nextjs-seo-international` for locale problems, `nextjs-seo-content` for page-level fixes, `nextjs-seo-ai-search` for AI referral traffic.
