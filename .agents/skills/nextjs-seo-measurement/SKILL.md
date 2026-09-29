---
name: nextjs-seo-measurement
description: Measure and diagnose search performance for a Next.js site. Use when the question starts from numbers, such as a traffic drop, a locale with no impressions, Search Console, GA4, or Bing Webmaster setup, or Core Web Vitals reports. Diagnose here, then hand the cause to nextjs-seo-technical or nextjs-seo-international. For AI citations use nextjs-seo-ai-search.
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
3. Compare like with like: same date range, same country and device filters, same page set, and the same days of the week. Otherwise a change in the filter reads as a change in traffic. [practice]
4. A locale with no impressions is an indexing or targeting problem first. Check the gate for one of its URLs before touching content. [practice]
5. Check whether an anomaly matches a known Google update or an outage on the platform's status page before blaming the site. An update or outage moves many sites at once. [practice]

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

Related skills: `nextjs-seo-technical` for indexing faults and audits, `nextjs-seo-international` for locale problems, `nextjs-seo-content` for page-level fixes, `nextjs-seo-ai-search` for AI referral traffic.
