# AI crawler reference

Use when editing `robots.ts`, choosing a crawler policy, reading server logs for AI traffic, or answering "should we block X". Never change crawler policy unless asked. Search discovery and model training are separate owner decisions.

Tokens change. Recheck the vendor page before editing rules. Tags: `[doc]` the vendor's own page, `[secondary]` reported elsewhere, `[unverified]`. Checked 2026-09-30.

## Every vendor splits three jobs

| Job | What it does | Robots.txt |
| --- | --- | --- |
| Training | Collects data for model training | Honored |
| Search index | Builds the index an answer engine cites | Honored |
| User-initiated fetch | Fetches a page because a person asked | Often ignored |

Only Anthropic states that its user-fetch bot obeys robots.txt. OpenAI, Google, Perplexity, Meta, and Amazon say theirs may or do ignore it. To restrict user-initiated traffic, use WAF rules, signature verification, or IP lists. Robots.txt cannot do it.

## Tokens

| Vendor | Token | Job | Honors robots.txt | Tag |
| --- | --- | --- | --- | --- |
| Google | `Googlebot` | Search index. AI Overviews and AI Mode retrieve from it. | Yes | doc |
| Google | `Google-Extended` | Robots-only token for Gemini Apps and Vertex training and grounding. No effect on Search. | Yes | doc |
| Google | `GoogleOther`, `Google-CloudVertexBot` | Research, and Vertex agents requested by a site owner | Yes | doc |
| Google | `Google-Agent` | User-requested agent actions | Generally ignores | doc |
| OpenAI | `OAI-SearchBot` | ChatGPT search index. Applies in about 24 hours. | Yes | doc |
| OpenAI | `GPTBot` | Training | Yes | doc |
| OpenAI | `ChatGPT-User` | User-initiated fetch | "May not apply" | doc |
| OpenAI | `OAI-AdsBot` | Ad landing-page safety, no training | Not stated | doc |
| OpenAI | ChatGPT agent | Signed requests (Web Bot Auth) | Unknown | secondary |
| Anthropic | `ClaudeBot` | Training. Supports `Crawl-delay`. | Yes | doc |
| Anthropic | `Claude-SearchBot` | Search result quality | Yes | doc |
| Anthropic | `Claude-User` | User-initiated retrieval | Yes, stated | doc |
| Perplexity | `PerplexityBot` | Search index, not model training | Yes | doc |
| Perplexity | `Perplexity-User` | User-initiated fetch | Generally ignores | doc |
| Microsoft | `bingbot` | Bing index. Copilot grounds on it. No separate AI token. | Yes | secondary |
| Apple | `Applebot` | Siri, Spotlight, Safari search. May feed Apple models unless `Applebot-Extended` is disallowed. | Yes | doc |
| Apple | `Applebot-Extended` | Robots-only opt-out of model training. Pages stay searchable. | Yes | doc |
| Meta | `Meta-ExternalAgent` | Training and indexing | Yes | doc |
| Meta | `Meta-WebIndexer` | Meta AI search quality | Yes | doc |
| Meta | `Meta-ExternalFetcher` | User-requested fetch | "May bypass" | doc |
| Amazon | `Amazonbot` | Product improvement. May train models. | Yes | doc |
| Amazon | `Amzn-SearchBot`, `Amzn-User` | Alexa and Amazon search, and user fetch. No training. | Yes, and may not | doc |
| Mistral | `MistralAI-Training`, `MistralAI-Index`, `MistralAI-User` | Training, search index, user fetch | Yes, yes, controls access | doc |
| Common Crawl | `CCBot` | Open corpus widely used for training | Yes | doc |
| DuckDuckGo | `DuckDuckBot`, `DuckAssistBot` | Search, and AI answers with citations. No training. | Yes | doc |
| You.com, Kagi | `YouBot`, `Kagibot` | Search | Yes | doc |
| Brave | none | Search. Robots.txt does not prevent indexing. Use `noindex`. | Partial | doc |
| Cohere | none active | Says no crawler is used for training. `Coherebot` is reserved. | n/a | doc |
| ByteDance | `Bytespider` | No reachable official doc. Third parties report violations. | Unverified | unverified |

Vendor IP lists exist for most of these. Use them, or reverse DNS, to verify a request. A user-agent alone is spoofable. Vendor pages: [Google](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers), [OpenAI](https://developers.openai.com/api/docs/bots), [Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), [Apple](https://support.apple.com/en-us/119829), [Meta](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers), [Amazon](https://developer.amazon.com/amazonbot), [Mistral](https://docs.mistral.ai/robots), [Common Crawl](https://commoncrawl.org/ccbot), [DuckDuckGo](https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot), [Kagi](https://kagi.com/bot).

## Policy options

| Policy | Effect | Cost |
| --- | --- | --- |
| A. Allow search, block training | Keeps ChatGPT search, Claude, Perplexity, Meta AI, Alexa, Copilot, and Google AI features. Recommended default for a public content site. | User-fetch bots still arrive. Bing and Google have no training-only token except `Google-Extended`. Amazon and Apple tokens may double as search. |
| B. Allow all | Maximum reach and the simplest file | Every vendor may train on the content, including through Common Crawl derivatives |
| C. Block AI | Disallow every AI token | You lose citations and referrals. User-fetch and agent bots still arrive. You cannot remove Google or Bing AI features through robots.txt without leaving their search index. |

Under C, use the Search Console "Search generative AI" control for Google, and `nosnippet`, `noarchive`, or `nocache` for both engines. Bing has no verified dedicated opt-out. [unverified]

This template's `robots.ts` currently allows every crawler and lists the sitemap, which is policy B by default. Changing it is an owner decision.

## `robots.ts` sketch for policy A

A sketch, cross-checked against vendor pages. Do not ship without owner sign-off.

```ts
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// Training and bulk-corpus crawlers only. Search and user-fetch bots are not
// listed, so they fall under the "*" group and stay allowed.
const TRAINING = [
  "GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended",
  "Meta-ExternalAgent", "CCBot", "MistralAI-Training",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: TRAINING, disallow: "/" },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
```

Decisions this sketch leaves to the owner:

- `Amazonbot` may train models and also feeds Alexa and Amazon search. It is omitted so the site keeps that reach. Add it to `TRAINING` only when blocking training outranks Amazon reach.
- `Content-Signal` is optional. It is a preference no vendor documents honoring. Next.js 16.3 added an `other` field on a rule that can emit it, so check `next` in `package.json` first. Add `other: { "Content-Signal": "search=yes, ai-input=yes, ai-train=no" }` to the `*` rule only when the owner wants the declaration.
- The `sitemap` line is a global directive and applies to every group.

Two traps. A crawler that matches a specific group ignores the `*` group, so any rule you want it to obey must be inside its group. And blocking `Applebot-Extended` (or `Amazonbot`) changes reach if a vendor later reuses the token for search. Propagation takes about 24 hours for OpenAI and Amazon, 72 hours for DuckAssistBot, and 30 minutes for YouBot.

Hidden layer: check the CDN. Cloudflare reportedly changed defaults on 2026-09-15 to block training and agent crawlers on new sites and free plans while allowing search crawlers. [unverified, single source] Read the host's own changelog before advising.

## Read logs

1. Match the tokens above, then verify with IP lists or reverse DNS.
2. Bucket training, search, and user-fetch separately.
3. Count `robots.txt` fetches. A bot that never fetches it is a signal.
4. Do not treat crawl counts as visibility. Crawl-to-referral ratios run from 118 to 1 up to 50,000 to 1. [secondary]
