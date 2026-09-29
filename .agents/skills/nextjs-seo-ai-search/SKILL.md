---
name: nextjs-seo-ai-search
description: AI search and crawler policy for a Next.js site. Use when asked whether ChatGPT, Perplexity, Claude, Copilot, or Google AI Overviews cite the site, to block or allow GPTBot, ClaudeBot, or other AI crawlers in robots.txt, about llms.txt, or about pages that browser agents can use. For ordinary indexing use nextjs-seo-technical, for JSON-LD nextjs-seo-structured-data.
---

# AI search and crawlers on Next.js

AI answers draw on the same pages that rank in ordinary search. The fundamentals (a fetchable, indexable, useful page) come first. Then the owner decides crawler policy, one decision per bot job.

## Read

| Task | Reference |
| --- | --- |
| AI Overviews, ChatGPT, Claude, Perplexity, Copilot, `llms.txt`, GEO claims, browser agents, multilingual AI search, measuring citations | [AI and agentic discovery](references/ai-and-agentic-discovery.md) |
| `robots.ts`, crawler tokens, block or allow a bot, log analysis | [AI crawler reference](references/ai-crawler-reference.md) |

## Rules

1. Treat AI visibility as ordinary indexing plus a useful page. `llms.txt`, "AI schema", chunking, rewriting for AI, and `Content-Signal` are extras, not ranking actions: Google says none are needed, and the evidence for the rest is correlational. [doc]
2. Change crawler policy only when asked. Training, search, and user-initiated fetch are three separate owner decisions, and each vendor splits them across different tokens. [doc]
3. Blocking a training crawler does not remove a page from AI search, and blocking a search crawler removes it from that vendor's answers. Name which job a rule affects. [doc]
4. A robots.txt rule is a request. Verify enforcement in server logs, not in the file. [doc]

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

Related skills: `nextjs-seo-technical` for indexing and `robots.ts` mechanics, `nextjs-seo-measurement` for referral traffic, `nextjs-seo-structured-data` for markup, `nextjs-seo-commerce` for shopping surfaces.
