# AI and agentic discovery

Use this playbook when a request mentions AI Overviews, AI Mode, answer engines, model crawlers, `llms.txt`, or agents that use a browser. These are related but separate cases. Identify the product and desired outcome before changing the site.

## Choose the system and evidence

| Goal | Check first | Evidence of outcome |
| --- | --- | --- |
| Google AI Overviews or AI Mode | Search indexing eligibility and [Google's AI guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) | Search Console's current Search performance rules and on-site visits; no promise of citation |
| Gemini Apps or Vertex AI grounding | [Google-Extended's documented product controls](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) and the owner's content-use policy | Provider-visible outcomes where available; allowing this use does not establish inclusion |
| ChatGPT search | `OAI-SearchBot` access and [OpenAI crawler guidance](https://developers.openai.com/api/docs/bots) | Live bot access where observable, attributable referrals, and sampled citations; these measure different things |
| Microsoft Copilot or Bing AI | Bing indexability and [Webmaster Guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a) | [Bing AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c) where available; citations are not clicks or rank |
| Claude or Perplexity search | Their current crawler/user-fetch policies and live access | Provider data if offered, referrals, and reproducible sampled responses; do not infer global visibility from spot checks |
| Browser agent completes a site task | Rendered UI, DOM, accessibility tree, and actual task flow | Task completion under the agent/browser being supported |

For crawler policy, identify the exact user agent or product token and owner decision. Google says `Google-Extended` controls specified Gemini training and grounding uses of Google-crawled content, but does not affect Google Search inclusion or ranking; it is not a distinct request user agent. OpenAI distinguishes `OAI-SearchBot` (search), `GPTBot` (training), and `ChatGPT-User` (user-initiated fetch); its documentation says robots rules may not apply to the last case. Anthropic and Perplexity also document separate crawler purposes. Verify their current names and behavior before editing `robots.ts`, and inspect host-level access. Do not silently change a search or training policy.

## Apply established search fundamentals first

- Make intended pages public, reachable, indexable, and useful. Confirm both app-level robots rules and host/CDN/authentication controls.
- Put original, accurate content in crawlable HTML. Use descriptive headings, ordinary links, and a clear page structure.
- Provide useful titles, metadata, and structured data only where relevant. Keep markup consistent with visible content and supported features.
- Make pages usable across devices and address real performance or accessibility barriers.
- Measure search visibility using the search provider's current webmaster tools. Use [Measurement](measurement.md) to keep citations, clicks, sessions, and conversions distinct.

## Reject unsupported AI-specific fixes

For Google Search, do not claim a ranking or citation benefit from `llms.txt`, special AI schema, artificial content chunking, or rewriting solely for AI. Google's current guidance says these tactics are not required and that Google Search does not use special AI text files. A public `llms.txt` can still serve tools that choose to use it, but it does not replace crawlable pages or ordinary links. Treat advice from an AI provider as applying to that provider only.

Do not add provider-specific directives from memory. Verify each provider's current crawler documentation, distinguish search access from model training, inspect hosting rules as well as `robots.txt`, and document the policy choice made by the site owner. Once access and content fundamentals are checked, an absent citation alone is not enough evidence for a code change.

## Make browser tasks legible

When a site should support browser agents, check the actual task flow. Prefer semantic links and buttons, associated form labels, specific control names, visible state, keyboard access, and stable layouts. Confirm that important content and actions are available in the DOM and accessibility tree. Add protocols or agent-specific integrations only when the user has a concrete product need and the relevant standard is mature enough for the requested use.

## References

- [Google guide to generative AI features in Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [Google common crawlers and Google-Extended](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
- [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots)
- [Anthropic crawler documentation](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Perplexity crawler documentation](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
- [web.dev guidance for agent-friendly websites](https://web.dev/articles/ai-agent-site-ux)
