# Evidence and reporting

Use when making or reviewing any SEO claim, and when writing the final report. Search advice is full of confident claims with no source. This page keeps them apart, with as little ceremony as possible.

## Evidence tags

Tag a claim when a decision depends on it. An untagged claim reads as `[unverified]`.

| Tag | Meaning | Example |
| --- | --- | --- |
| `[doc]` | The platform that owns the behavior, or a standard, documents it | Google's localized versions page, ISO language codes, schema.org |
| `[study]` | A published measurement with a stated method | Ahrefs' `llms.txt` request study |
| `[practice]` | Practitioner consensus or a single test | A conference talk |
| `[local]` | Read in this repository or observed by a command here, with the date | `curl -I /` output, 2026-09-30 |
| `[unverified]` | Not confirmed on a primary source, including third-party reports of a platform fact | A news article on a Google change, a claim from memory |

Expert commentary is a hypothesis, not a platform rule. Do not present `[practice]` as `[doc]`, and do not turn a study's correlation into a cause.

## How far a claim got

Say the highest rung the work reached.

1. Read in code or a document.
2. Ran locally and observed the output. `[local]` claims live here.
3. Reproduced against a live URL.
4. Confirmed by the platform's own report (URL Inspection, Search Console, Merchant Center, Bing).

Indexing, rankings, traffic, and AI citations are rung 4 facts. A local build, a valid schema check, or a submitted sitemap stops at rung 2 and proves eligibility at best. For a claim about the live site, write "observed locally", never "verified". Git dates are not deploy dates.

Each check ends in one verdict: VERIFIED (ran and passed, at the stated rung), FAILED (ran and the result is wrong), INCONCLUSIVE (ran and cannot separate plausible causes), or NOT VERIFIED (did not run, with the reason). A guess written as a result is the worst outcome.

Platform rules change. When a task depends on a rule more than 90 days old or tagged `[unverified]`, read the platform's current page first, and say so if you cannot.

## SEO report shape

End every audit, diagnosis, and implementation report like this. Omit a line only when it has nothing to say, and write "none" instead of leaving it blank.

```text
Questions: <only questions whose answer changes the work, each with the default you will use if unanswered>
Scope: <origin, environment, locales, templates, engines, dates>
Findings, most severe first:
| # | Claim | Evidence (tag, rung, URL or report) | Cause | Action | Verify by |
Cleared: <checks that ran and passed>
Not verified: <check and why>
Owner actions: <what only the site owner can do>
Verdict: <ship, ship with named follow-ups, or block, with the reason>
```

- Cap findings at 10. Group duplicates by root cause and affected template.
- Give each finding a disposition in Action: fix now, defer with a reason, or owner action.
- Give the source report, date range, segment, baseline, and observed change for every metric claim.
- Separate technical validity, indexing, visibility, visits, and business outcomes. Never sum Search Console clicks, GA4 sessions, and AI citations.
- When access is missing, name the exact report and fields the owner must export. Never estimate to fill the gap. Hand the indexable gate over as a checklist, each item with its expected result and the URL to run it on.
- Ask what "traffic" means before diagnosing it. Search Console clicks and GA4 sessions are different counts.

For an implementation, use the same shape with these lines first: `Changed: <files and behavior>` and `Verified: <check, URL or locale, rung, verdict>`. Say "eligible" or "implemented", never "improved".

## Unattended runs

When no human can answer, pick the conservative default, write the assumption under Questions, and continue. Conservative means: no crawler policy change, no claim about the live site, language-only tags, omit a missing translation, and no markup for a feature you could not confirm in the gallery.
