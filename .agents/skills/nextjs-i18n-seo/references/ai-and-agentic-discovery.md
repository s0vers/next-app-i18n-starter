# AI and agentic discovery

Use this playbook when a request mentions AI Overviews, AI Mode, answer engines, model crawlers, `llms.txt`, or agents that use a browser. These are related but separate cases. Identify the product and desired outcome before changing the site.

## Separate the systems

1. **Search features that use generative AI:** follow that search engine's indexing, content, and technical requirements. For Google Search AI features, start with its current AI guide and Search Essentials.
2. **Other answer engines:** check the current platform's documentation for discovery, citation, and crawler behavior. Do not assume that Google guidance predicts another provider's behavior.
3. **Crawler policy:** identify the exact user agent and owner decision. Search discovery crawlers and model-training crawlers may have separate names and policies. Never change either policy or add a training opt-out unless requested.
4. **On-site browser agents:** optimize for the task a person is asking the agent to perform. Inspect rendered UI, DOM, and accessibility tree when available. This is an interaction and accessibility problem, not proof of search ranking gains.

## Apply established search fundamentals first

- Make intended pages public, reachable, indexable, and useful. Confirm both app-level robots rules and host/CDN/authentication controls.
- Put original, accurate content in crawlable HTML. Use descriptive headings, ordinary links, and a clear page structure.
- Provide useful titles, metadata, and structured data only where relevant. Keep markup consistent with visible content and supported features.
- Make pages usable across devices and address real performance or accessibility barriers.
- Measure search visibility using the search provider's current webmaster tools. Record the report, date range, market, page set, and limitations.

## Reject unsupported AI-specific fixes

For Google Search, do not claim a ranking or citation benefit from `llms.txt`, special AI schema, artificial content chunking, or rewriting solely for AI. Google's current guidance says these tactics are not required. A public `llms.txt` can still serve tools that choose to use it, but it does not replace crawlable pages or ordinary links.

Do not add provider-specific directives from memory. Verify each provider's current crawler documentation, distinguish search access from model training, inspect hosting rules as well as `robots.txt`, and document the policy choice made by the site owner.

## Make browser tasks legible

When a site should support browser agents, check the actual task flow. Prefer semantic links and buttons, associated form labels, specific control names, visible state, keyboard access, and stable layouts. Confirm that important content and actions are available in the DOM and accessibility tree. Add protocols or agent-specific integrations only when the user has a concrete product need and the relevant standard is mature enough for the requested use.

## References

- [Google guide to generative AI features in Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots)
- [Anthropic crawler documentation](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Perplexity crawler documentation](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
- [web.dev guidance for agent-friendly websites](https://web.dev/articles/ai-agent-site-ux)
