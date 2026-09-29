# AI and agentic discovery

Use when a request mentions AI Overviews, AI Mode, ChatGPT search, Claude, Perplexity, Copilot, answer engines, model crawlers, `llms.txt`, "GEO" or "AEO", or agents that browse and buy. These are separate systems. Name the product and the outcome before changing anything.

Evidence tags: see evidence and reporting (`nextjs-seo-technical`).

Crawler tokens, policies, and `robots.ts` sketches are in [AI crawler reference](ai-crawler-reference.md).

## Fundamentals first

Google states that GEO and AEO are still SEO, and that AI Overviews and AI Mode need no additional technical requirements. [doc, 2026-05-15] Microsoft says Bing and Copilot share Bing's crawl, index, and ranking foundation. [unverified] Do these in order. Stop when a step reveals the fault.

1. The page is public, crawlable, indexable, and snippet-eligible. Check the app's `robots.ts` and the host, CDN, firewall, and authentication layer. A permissive `robots.ts` proves nothing about the CDN.
2. The search bots of each product you want are not blocked: `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, Bingbot, Googlebot. Confirm the CDN allows their published IPs.
3. The owner chose a policy for training, search, and user-initiated fetches, and recorded it. See the crawler reference.
4. The content is original, factual, and in server-rendered HTML with clear headings and ordinary links.

## Choose the system and the evidence

| Goal | Check first | Outcome evidence |
| --- | --- | --- |
| Google AI Overviews or AI Mode | Indexing and snippet eligibility. Snippet controls (`nosnippet`, `max-snippet`, `data-nosnippet`) limit what AI features may use. | Search Console's Generative AI performance report (impressions only, all sites since 2026-08-31) and the Web report |
| Opt out of Google AI features | Search Console, Settings, Search generative AI: Include, Exclude, or Inherit per property | The setting itself. It does not affect training. `Google-Extended` is the training control. |
| Gemini Apps and Vertex grounding | `Google-Extended` in robots.txt, plus the owner's content-use policy | None available. Allowing it does not establish inclusion. |
| ChatGPT search | `OAI-SearchBot` allowed | Referrals, server logs, sampled citations |
| Copilot and Bing AI | Bing indexability, IndexNow | Bing AI Performance (public preview, sampled, citations only) |
| Claude or Perplexity search | `Claude-SearchBot`, `PerplexityBot` allowed | Referrals and reproducible sampled answers |
| A browser agent completes a task | The real task flow, DOM, and accessibility tree | Task completion in the agent being supported |

## What has evidence and what does not

Ranked by how much backing each has. Do the top first. Label anything below the line as correlation.

1. Be crawlable, indexed, and current. Vendor-stated. [doc]
2. Write one topic per URL. State facts directly, keep entity names consistent, put key information near the top, and use clear headings and tables. This is Bing's grounding advice. Google separately says artificial chunking is unnecessary. The two agree: focused pages, not fragmented ones. [doc]
3. Use IndexNow for Bing freshness, and keep `lastModified` true. [doc]
4. Keep pages maintained. AI bot hits skew to content from the last year, and cited content is fresher than ordinary results. Correlation from vendor-run log studies. [study]
5. Add quotations, statistics, and cited sources. The Princeton GEO paper reports position-adjusted gains of about 41 percent for quotations, 33 percent for statistics, and 28 percent for citing sources, and a 9 percent loss for keyword stuffing. It ran on a synthetic engine with 2023 models. The one finding that holds up is that keyword stuffing does not help. [study, weak]
6. Brand mentions correlate with AI visibility across 75,000 brands (rho 0.664 with AI Overview presence). Correlation only, and manufactured mentions do not work. [study]

Below the line, and unsupported:

| Claim | Evidence |
| --- | --- |
| `llms.txt`, special AI schema, chunking, or AI-only rewriting improves Google citations | Google says no. Ahrefs found 28 percent of 137,210 domains had a valid `llms.txt` and 97 percent of those got zero traffic. Requests came mostly from audit tools. [doc, study] |
| GEO gives a fixed gain such as 40 percent | A lab result on a proxy engine |
| Ranking in the top 10 predicts citation | Overlap fell from 76 to 38 percent in one study and is about 17 percent in another. Studies disagree. |
| Reddit and Wikipedia weights are stable | One vendor saw ChatGPT's Reddit share swing from about 60 to 10 percent within weeks |
| Blocking `GPTBot` or `ClaudeBot` removes you from AI answers | False by vendor docs. Search tokens are separate. |
| `Content-Signal`, `ai.txt`, or `aipref` bind crawlers | No vendor documents honoring them |
| `robots.txt` stops all agent traffic | User-initiated fetchers may ignore it |

Treat advice from an AI vendor as applying to that vendor only.

## `llms.txt`

Keep `public/llms.txt` as an optional docs aid for tools that read it. It is not a ranking action and never replaces crawlable pages. The format has an H1 title, an optional blockquote summary, optional prose, then H2 sections of markdown link lists. Comment lines that start with `#` parse as extra H1s. Verify the file matches before claiming it follows the spec.

## Standards that do not change the plan

Markdown via `Accept: text/markdown` (Cloudflare converts at the edge), IETF `aipref`, Web Bot Auth, WebMCP, NLWeb, MCP server cards, and schema.org `potentialAction` for AI are drafts, developer trials, or vendor-specific. No AI vendor documents production use of any of them, and Google says Markdown is not needed for Search. Do not build for them, and do not emit `aipref` syntax. Verify Web Bot Auth signatures only if the owner wants agent traffic. [unverified]

## Make browser tasks legible

Agents read the DOM and the accessibility tree, or a screenshot. Apply in order.

1. Semantic `<button>` and `<a>`. Native HTML over ARIA added for agents.
2. A `<label for>` on every input, and specific control names.
3. No transparent overlay over an interactive element.
4. Stable layout across loads. Screenshot-driven agents fail on shifting pages.
5. Important content and actions exist in the DOM and accessibility tree.
6. Confirmation before a purchase or deletion.
7. No CAPTCHA on public read paths. Anthropic says ClaudeBot does not solve them.
8. Price and stock in server-rendered HTML, consistent with any feed.
9. Test the real flow with a browser agent and a keyboard-only pass. No vendor certifies compatibility.

Comet and Claude in Chrome look like ordinary Chrome sessions, so there is no identity to allowlist. [unverified]

## Multilingual AI search

One practitioner test found ChatGPT and Perplexity often linked English URLs for non-English queries, Copilot returned the right localized URL most often, and Gemini was inconsistent. No vendor documents `hreflang` for AI. [unverified] The low-regret work is the international SEO work: fully translated body content, one URL per language, self-canonicals, reciprocal alternates, and translated titles. Sample per language and per engine.

## Measure

1. Logs: match user-agent tokens, then verify with the vendor's IP list or reverse DNS, because tokens are spoofable. Bucket training, search, and user-fetch. A crawl count is not visibility.
2. Referrers: `chatgpt.com`, `perplexity.ai`, `claude.ai`, `copilot.microsoft.com`, `gemini.google.com`. Many AI clicks arrive with no referrer and land in Direct.
3. GA4 has a default "AI Assistant" channel. Add a custom channel group for the rest. See measurement (`nextjs-seo-measurement`).
4. Search Console's Generative AI report and Bing AI Performance.
5. Prompt sampling: a fixed prompt set per language, logged out, fresh sessions, repeated runs, and each cited URL and date recorded. Never read one miss as a code defect.

## Done when

The policy for training, search, and user fetch is written down. Search bots are reachable through the CDN. Pages render their content in HTML. Any claim of AI visibility cites a report or a dated sample with its limits. Report what the owner still has to verify: CDN rules, Search Console settings, Merchant Center, and any vendor program enrollment.

Sources, checked 2026-09-30: [Google AI features](https://developers.google.com/search/docs/appearance/ai-features), [Google guide to generative AI in Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [Search generative AI control](https://support.google.com/webmasters/answer/16908024), [Generative AI performance report](https://support.google.com/webmasters/answer/16984139), [web.dev agent-friendly sites](https://web.dev/articles/ai-agent-site-ux), [llms.txt spec](https://llmstxt.org/), [GEO paper](https://arxiv.org/abs/2311.09735), [Ahrefs llms.txt study](https://ahrefs.com/blog/llmstxt-study/), [Bing AI Performance](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview).
