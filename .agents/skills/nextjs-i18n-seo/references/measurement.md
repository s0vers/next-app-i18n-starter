# Search measurement

Use when installing analytics, evaluating an SEO change, diagnosing a traffic drop or a silent locale, or reporting visibility. State the question first, then pick the report. Search Console, GA4, Bing, and AI citation reports count different events. Never add their numbers together.

Evidence tags: see [evidence and reporting](evidence-and-reporting.md).

This starter uses Vercel Analytics and Speed Insights. It has no GA4. The setup below applies to a fork that adds it.

## Pick the evidence

| Question | Evidence | Limit |
| --- | --- | --- |
| Can Google fetch and index this URL? | URL Inspection, plus a live request | "On Google" is not a ranking. The indexed view is the last crawl, not live. |
| Which queries, pages, or markets changed? | Search Console Performance, segmented by page, query, country, device, search type | Anonymized queries drop out of tables. Data belongs to canonical URLs. Days are Pacific time and the newest are preliminary. |
| Did organic visitors engage or convert? | GA4 traffic acquisition and key events | Sessions are not clicks. Consent, blockers, and stripped referrers lose visits. |
| What happened on Bing? | Bing Webmaster Tools performance and URL tools | Bing surfaces only |
| Were pages cited in AI answers? | Google's Generative AI performance report, Bing AI Performance | Impressions or citations only. No clicks, no rank. |
| Is the experience acceptable? | Field Core Web Vitals (CrUX, Search Console), not a lab score | Lab tools diagnose. Field data judges. |

## Setup for a multilingual Next.js site

1. Settle the legal basis first. With EEA or UK visitors and Google tags, use Consent Mode v2 with a consent tool, or choose a cookieless analytics tool. Send no personal data in parameters or URLs.
2. Create the GA4 property and web stream. Turn on Enhanced Measurement including history changes, set data retention to 14 months, and add an internal-traffic rule and filter (Testing first, Active after 24 to 36 hours).
3. Register custom dimensions before you need them. `site_locale` and `page_type` (event scope). They are not retroactive, and scope and name cannot be edited after saving.
4. Mark real business actions as key events. Do not mark scroll.
5. Send ecommerce events with `item_id`, `currency`, and `value`. Send the display currency, and key items by `item_id`, never by translated name, so locales aggregate.
6. Add `NEXT_PUBLIC_GA_ID` to `.env.example` with a blank or placeholder value, and render nothing when it is unset.
7. Search Console: create a Domain property (DNS verification), submit the sitemap, and link GA4. The link joins one stream to one property, keeps 16 months, and offers only landing page, device, and country dimensions.
8. Bing: import from Search Console or verify the site. Add the sitemap and optionally an IndexNow key file. IndexNow reaches Bing, Yandex, Naver, and Seznam. Google does not support it. [unverified]
9. Add a custom GA4 channel group for AI referrers not in the default "AI Assistant" channel (see below). Custom channel groups are retroactive, limited to 2 per property, and the first match wins.

### Sketches, not tested

`@next/third-parties` `GoogleAnalytics` takes only `gaId`, `dataLayerName`, `debugMode`, and `nonce`. It has no consent props and cannot set config parameters. Set the consent default before it loads.

```tsx
// SKETCH: consent default and locale, in the root layout.
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";

{process.env.NEXT_PUBLIC_GA_ID && (
  <>
    <Script id="ga-consent-default" strategy="beforeInteractive">{`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments)}
      gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',
        ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
      gtag('set',{site_locale:${JSON.stringify(locale)}});
    `}</Script>
    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
  </>
)}
```

A `beforeInteractive` script runs once per document load. A client-side language switch does not run it again, so `site_locale` goes stale, and the history-change `page_view` can fire before it updates. Check both in GA4 DebugView. For exact per-page values, set `send_page_view: false`, disable history-change measurement (or every view is duplicated), and send your own `page_view` event with `site_locale` from `useLocale()` in an effect keyed on the pathname and locale.


Update consent from the banner with `gtag('consent','update',{ analytics_storage: 'granted' })`. Basic and advanced consent mode differ in when tags load, and the choice is a legal decision. [unverified]

For Core Web Vitals, rely on CrUX and Search Console for ranking-relevant field data. `useReportWebVitals` in a small client component can send LCP, INP, and CLS to your own endpoint. Ignore the legacy FID snippet in older docs. INP replaced FID in 2024. Thresholds at the 75th percentile: LCP 2.5 s, INP 200 ms, CLS 0.1. [doc]

## Metrics and their traps

| Source | Metric | Trap |
| --- | --- | --- |
| Search Console | Impressions | Counted when a link appears on the page. AI Overviews and AI Mode links count under Google's rules, and logging errors exist. |
| | Clicks | Outbound clicks from Google. Not sessions. Wrong canonicals move clicks between URLs. |
| | CTR | Falls when AI results add impressions. Compare by query and page, never site total. |
| | Average position | Impression-weighted and easy to distort. An AI Overview takes one position for all its links. |
| | Generative AI report | Impressions only for AI Overviews and AI Mode, live for all sites since 2026-08-31. No clicks or queries. Not additive to web totals. |
| | Page indexing | "Crawled, currently not indexed" and "Discovered, currently not indexed" are states, not errors. Validation takes about two weeks. |
| | Core Web Vitals | CrUX field data in URL groups. Missing data is not "good". |
| GA4 | Sessions | Session source and first-user source differ (Traffic versus User acquisition). |
| | Organic Search channel | Includes Google AI Overviews and AI Mode links. Bing and DuckDuckGo are organic too. |
| | Language | The browser language, not your site locale. Use `site_locale`. |
| | Country | Where the visitor is, not the target market. |
| | Direct or Unassigned | Inflated when the referrer is stripped (in-app browsers, some AI apps). |
| Bing | AI Performance | Public preview, sampled, no clicks. Grounding queries are grouped phrases, not prompts. |

GA4's default channel group has an "AI Assistant" channel (medium `ai-assistant`, covering ChatGPT, Gemini, DeepSeek, Copilot, Grok). It excludes Google's AI Overviews and AI Mode. [doc] Check it before building a custom group for Claude and Perplexity. A `utm_source=chatgpt.com` tag appears in secondary reports only, so treat it as observed behavior and not a contract. [unverified]

Before diagnosing any drop, read Search Console's [data anomalies page](https://support.google.com/webmasters/answer/6211453). It lists logging errors (impressions May 2025 to April 2026, a February to March 2026 export gap) and the FAQ rich result removal on 7 May 2026. Search Console has had no International Targeting report since 2022, so there is no site-wide hreflang report. Use a crawler and URL Inspection.

## Diagnose a drop

```text
Organic traffic dropped
├── Only GA4 dropped → tracking: consent banner change, removed tag, filters, referrer or UTM change, channel group edit. Stop when found.
└── Both dropped
    ├── Read the anomalies page and algorithm update dates for the exact days; compare the same period last year
    ├── Segment in Search Console: search type, brand versus non-brand, country, device, page group, appearance
    │   ├── Impressions down → visibility or indexing problem
    │   ├── Impressions flat, CTR down → the results page changed (AI results, snippet, title)
    │   └── Position down on a subset → relevance or ranking
    ├── Sudden site-wide on a date → deploy log (robots, noindex, canonical, redirects, hreflang, sitemap, 5xx); Crawl Stats; URL Inspection live versus indexed on 3 URLs
    ├── Page indexing trend → "Crawled, not indexed" spike means quality or duplication; "Alternate" or "Duplicate" means canonical or locale collapse; 404 or soft 404 means a routing bug
    ├── Field Core Web Vitals regression on that date
    └── Manual actions and security issues
State the cause class (technical, content or competition, measurement, seasonal) and the confidence.
```

## Diagnose one locale's drop

Start from "Diagnose a drop" and apply every segment step to that locale only. Filter Search Console pages with the locale's regex (`^https://example\.com/ar(/|$)`) and compare it against the other locales over the same days. If only that locale fell, the cause is local to it: an alternate or canonical change that collapsed it into English, a translation change, a route or redirect change, or one market's seasonality. A site-wide cause moves every locale.

## Diagnose a silent locale

```text
/ar gets no traffic
├── Indexed? Search Console page filter by regex; URL Inspection on samples; sitemap has them; 200; no noindex; self-canonical
├── "Google chose a different canonical" → content not distinct or canonical points to English; check reciprocity
├── Indexed but no impressions → are the queries native? Translated titles? Is there a market?
├── Impressions but few clicks → title or snippet, brand, position
├── Clicks in Search Console but nothing in GA4 → missing locale dimension, denied consent in that region, or a path regex that misses the unprefixed default
└── Off-site: local links and mentions
```

The default locale has no prefix. "English" is every path that does not match `^/(ar|zh|es|ja)(/|$)`. Search Console custom filters use RE2, are partial match, and are case-insensitive by default. Example page filter: `^https://example\.com/(ar|zh|es|ja)(/|$)`. GA4 page path: `^/(ar|zh|es|ja)(/|$)`.

Report every finding in the shape in [evidence and reporting](evidence-and-reporting.md#seo-report-shape). When access is missing, list the exact report and fields the owner should export. Never fill a gap with an estimate.

Sources, checked 2026-09-30: [Search Console Performance](https://support.google.com/webmasters/answer/7576553), [dimensions and grouping](https://support.google.com/webmasters/answer/17011259), [metrics](https://support.google.com/webmasters/answer/7042828), [Generative AI report](https://support.google.com/webmasters/answer/16984139), [data anomalies](https://support.google.com/webmasters/answer/6211453), [GA4 default channel group](https://support.google.com/analytics/answer/9756891), [GA4 and Search Console link](https://support.google.com/analytics/answer/10737381), [custom dimensions](https://support.google.com/analytics/answer/14239696), [Consent Mode](https://developers.google.com/tag-platform/security/guides/consent), [Next.js third-party libraries](https://nextjs.org/docs/app/guides/third-party-libraries), [Bing AI Performance](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview), [web.dev vitals](https://web.dev/articles/vitals), [IndexNow](https://www.indexnow.org/documentation).
