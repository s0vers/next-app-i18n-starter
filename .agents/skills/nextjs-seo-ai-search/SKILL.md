---
name: nextjs-seo-ai-search
description: AI search and crawler policy for a Next.js site. Covers Google AI Overviews, ChatGPT, Claude, Perplexity, and Copilot visibility, robots rules for AI bots, llms.txt, and browser agents. Use when the question is about AI citations, blocking or allowing an AI crawler, or agent-readable pages. Not for ordinary indexing (nextjs-seo-technical) or JSON-LD (nextjs-seo-structured-data).
---

# AI search and crawlers on Next.js

AI answers draw on the same pages that rank in ordinary search. The fundamentals (a fetchable, indexable, useful page) come first. Then the owner decides crawler policy, one decision per bot job.

## Read

| Task | Reference |
| --- | --- |
| AI Overviews, ChatGPT, Claude, Perplexity, Copilot, `llms.txt`, GEO claims, browser agents, multilingual AI search, measuring citations | [AI and agentic discovery](references/ai-and-agentic-discovery.md) |
| `robots.ts`, crawler tokens, block or allow a bot, log analysis | [AI crawler reference](references/ai-crawler-reference.md) |

## Rules

1. Never add an AI-specific tactic (`llms.txt`, "AI schema", chunking, rewriting for AI, `Content-Signal`) as a ranking action. Google says none are needed, and the evidence for the rest is correlational. [doc]
2. Change crawler policy only when asked. Training, search, and user-initiated fetch are three separate owner decisions, and each vendor splits them across different tokens. [doc]
3. Blocking a training crawler does not remove a page from AI search, and blocking a search crawler removes it from that vendor's answers. Name which job a rule affects. [doc]
4. A robots.txt rule is a request. Verify enforcement in server logs, not in the file. [doc]
5. Never claim a citation you did not observe in the vendor's own product. [practice]

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

Related skills: `nextjs-seo-technical` for indexing and `robots.ts` mechanics, `nextjs-seo-measurement` for referral traffic, `nextjs-seo-structured-data` for markup, `nextjs-seo-commerce` for shopping surfaces.
