# Evidence and reporting

Use when making or reviewing any SEO claim, and when writing the final report. Search advice is full of confident claims with no source. This page keeps them apart.

## Evidence tags

Tag every claim that a decision depends on. Untagged claims read as `[unverified]`.

| Tag | Meaning | Example |
| --- | --- | --- |
| `[doc]` | The platform that owns the behavior documents it | Google's localized versions page on `hreflang` |
| `[local]` | Read in this repository, or observed by running a command here, with the date | `curl -I /` shows a `Link` header, 2026-09-30 |
| `[spec]` | A standard | ISO language codes, schema.org, IETF drafts |
| `[study]` | A published measurement with a stated method | Ahrefs' `llms.txt` request study |
| `[practice]` | Practitioner consensus or a single test | A conference talk |
| `[secondary]` | A third party reporting a platform fact | A news article on a Google change |
| `[unverified]` | Not confirmed this session | A claim from memory |

Expert commentary is a hypothesis, not a platform rule. Do not present `[practice]` as `[doc]`. Do not turn a study's correlation into a cause.

## Certainty ladder

State the highest rung the work actually reached.

1. Read in code or a document.
2. Ran locally and observed the output.
3. Reproduced against a live URL.
4. Confirmed by the platform's own report (URL Inspection, Search Console, Merchant Center, Bing).

Repository facts, including git history, are `[local]` at rung 1 or 2. Say "observed locally", never "verified", for a claim about how the live site behaves. Git dates are not deploy dates.

Indexing, rankings, traffic, and AI citations are rung 4 facts. A local build, a valid schema check, or a submitted sitemap tops out at rung 2 and proves eligibility at best.

## Verdicts

Use one word per check.

| Verdict | Use when |
| --- | --- |
| VERIFIED | The check ran and passed on the stated rung |
| NOT VERIFIED | The check did not run, and the reason is stated |
| INCONCLUSIVE | The check ran and cannot separate plausible causes |
| FAILED | The check ran and the result is wrong |

"Not verified" is a valid entry. A guess written as a result is the worst outcome.

## Freshness

Platform behavior changes. Every reference in this skill carries the date it was checked. When a task depends on a platform rule that is more than 90 days old or is marked `[secondary]` or `[unverified]`, read the platform's current page before relying on it. If you cannot, say so in the report.

## SEO report shape

Every audit, diagnosis, and implementation report ends in this shape.

```text
Questions: <only questions whose answer changes the work; put them first, and omit the line when there are none>
Scope: <origin, environment, locales, templates, engines, dates>
Findings (most severe first):
| # | Claim | Evidence (tag, rung, URL or report) | Cause and confidence | Action | Priority | Verify by |
Cleared: <checks that ran and passed>
Not verified: <check and why>
Next owner action: <what only the site owner can do>
Verdict: <ship, ship with named follow-ups, or block, with the reason>
```

Rules for the table:

- Cap findings at 10. Group duplicates by root cause and affected template.
- Confidence is one of Direct, Supported, Inferred, Speculative, Unknown. Direct means observed on the live URL. Inferred means reasoned from a rule. Speculative means a plausible cause with no test.
- Separate technical validity, indexing, visibility, visits, and business outcomes. Never sum Search Console clicks, GA4 sessions, and AI citations.
- Give the source report, date range, segment, baseline, and observed change for every metric claim.
- When access is missing, name the exact report and fields the owner must export. Never estimate to fill the gap.
- Ask what "traffic" means before diagnosing it. Search Console clicks and GA4 sessions are different counts, and the answer picks the report.
- With no production access, hand the gate over as a checklist for the owner. Do not stop at "unknown". Each item names the check, the expected result, and the URL to run it on.

## Implementation report shape

```text
Questions: <as above, first, only when an answer changes the work>
Changed: <files and behavior>
Verified: <check, URL or locale, rung, verdict>
Not verified: <check and why>
Tradeoffs: <what was chosen and what was given up>
Next owner action: <human tasks: Search Console, CDN, translation review, program enrollment>
```

Eligibility, validation tools, and implementation alone do not prove indexing, rankings, traffic, or AI citations. Say the words "eligible" or "implemented", not "improved".
