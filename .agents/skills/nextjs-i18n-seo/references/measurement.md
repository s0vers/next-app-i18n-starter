# Search measurement

Read this when installing measurement, evaluating an SEO change, diagnosing a decline, or reporting visibility. Define the question before choosing a metric. Search Console, GA4, and provider citation reports measure different events and cannot be added together.

## Choose evidence

| Question | Primary evidence | Limit |
| --- | --- | --- |
| Can Google fetch and index this URL? | Search Console URL Inspection plus live HTTP/rendered page | An indexed verdict does not promise a ranking |
| Which Google queries/pages/markets changed? | Search Console Performance, segmented by page, query, country, device, search type, and comparable dates | Data has aggregation, anonymization, and processing limits; average position is not a fixed rank |
| Did organic visitors engage or convert? | GA4 traffic/landing-page acquisition and defined key events or ecommerce events | GA4 sessions and GSC clicks have different definitions and attribution |
| What happened on Bing? | Bing Webmaster Tools search performance, URL tools, and indexing reports | Covers Bing's reported surfaces, not all search engines |
| Were pages visibly cited in supported AI experiences? | Provider-specific citation report, where available | Citation counts are neither clicks nor ranking; coverage may be sampled |

## Establish a comparable baseline

1. Record the site property, origin, URL pattern, locale/market, search type, device, dates, and metric definitions. Separate brand and non-brand, page templates, and launched versus unchanged URLs when these distinctions matter.
2. Compare equivalent periods and note seasonality, campaigns, migrations, site outages, tracking changes, and platform data anomalies. Use Search Console's URL Inspection to investigate specific indexing claims; use Performance for aggregate trends.
3. In GA4, confirm the web data stream and consent/collection behavior before interpreting a decline. Verify that the chosen key event or ecommerce event fires on the actual user action and that no personal data is sent. Prefer a privacy-conscious implementation authorized by the owner; avoid adding analytics merely because an SEO checklist mentions it.
4. If linking Search Console to GA4, confirm the properties cover the same pages and the owner has the required permissions. The integrated reports combine selected GSC and GA4 views but do not make clicks equal sessions.
5. State a falsifiable hypothesis: affected URLs, expected mechanism, metric, comparison window, and alternative explanations. After a change, verify deployment first, then observe enough provider data to evaluate it. Call the result inconclusive when sample size, data delay, or confounding changes prevent attribution.

## Read the metrics precisely

- **Search Console:** clicks, impressions, CTR, and average position describe Google Search appearances. Page data is generally assigned to canonical URLs; changing filters or grouping can change totals. The current Google documentation includes AI Overviews and AI Mode links in Search performance under its counting rules. Do not invent a separate AI citation total from standard GSC data.
- **GA4:** organic search sessions, engaged sessions, and key events describe on-site behavior under GA4's attribution and collection. Query strings, consent, blockers, and referral handling can affect observed traffic. Verify source/medium classifications before labeling ChatGPT, Perplexity, or another agent referral.
- **Bing AI Performance:** where the report is available, it shows aggregated citation activity across supported Microsoft experiences. Grounding queries are grouped phrases, not verbatim prompts. A citation is not a click or a rank, and the report is not a complete log.

## Report format

For each claim, give the source/report, date range, segment, metric and baseline, observed change, likely explanation with confidence, and verification or next action. Separate technical validity, indexing, visibility, visits, and business outcomes. When access is unavailable, provide the exact report/fields the owner should export; do not fill gaps with a synthetic estimate.

## Primary sources

- [Google Search Console Performance](https://support.google.com/webmasters/answer/7576553)
- [Google Search Console dimensions and grouping](https://support.google.com/webmasters/answer/17011259)
- [Google clicks, impressions, and AI result counting](https://support.google.com/webmasters/answer/7042828)
- [Google URL Inspection](https://support.google.com/webmasters/answer/9012289)
- [Link Search Console and GA4](https://support.google.com/analytics/answer/10737381)
- [GA4 traffic acquisition](https://support.google.com/analytics/answer/12923437)
- [Bing Webmaster Tools search performance](https://www.bing.com/webmasters/help/search-performance-c680da36)
- [Bing Webmaster Tools AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c)
