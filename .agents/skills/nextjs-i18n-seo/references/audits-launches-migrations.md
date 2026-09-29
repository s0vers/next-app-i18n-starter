# Audits, launches, and migrations

Use for a site-wide review, a production launch gate, a URL or domain change, adding or removing a locale, or a traffic decline. Every finding needs evidence and a next action.

Evidence tags: `[doc]` platform documentation, `[practice]` practitioner evidence. See [evidence and reporting](evidence-and-reporting.md).

## Scope first

Write one line each before auditing.

| Item | Answer |
| --- | --- |
| Origin and environment | Production, staging, or local |
| Request type | Baseline audit, launch gate, migration, or diagnosis of a measured decline |
| Surface | Templates, locales, markets, and engines in scope |
| Access | Rendered pages, logs, analytics, Search Console, other webmaster tools |
| Window | Time period, device, country, and search type behind any reported change |

Without production access, audit the repository and local output, then list the live checks the owner must run. Never call a local audit a production audit.

## Layered audit

1. Inventory. List indexable routes by template and locale. Compare routes, sitemap entries, canonical targets, and key internal links.
2. Technical sample. For representative URLs record status, redirects, crawl access, rendered HTML, `noindex`, canonical, title, language, and structured data. Widen the sample when templates or locales differ. `scripts/verify-seo.mjs` covers this.
3. Content sample. Each page has a distinct purpose, accurate metadata, useful main content, and sensible links. See [content and on-page](content-and-onpage.md).
4. International sample. Body language, `<html lang>` and `dir`, canonicals, reciprocal alternates, switcher behavior, and sitemap output for every locale. See [international SEO](international-seo.md).
5. Platform data. Search Console and Bing for indexing state, selected canonical, queries, pages, countries. Compare equal periods and segments. Rule out an analytics change before blaming search. See [measurement](measurement.md).
6. Experience. Field data and device behavior. A Lighthouse score alone is not a ranking report.
7. Prioritize. Group symptoms by root cause and affected template. Rate impact, URLs affected, confidence, and cost. Separate blockers from enhancements and owner-only tasks.

Priority is impact times confidence, divided by cost. A blocker on a template that serves 40 URLs outranks a polish item on one page.

Each finding records: evidence and URLs, observed problem, likely cause and confidence, action, priority and why, how to verify, and any owner dependency. Call a finding inconclusive when the evidence cannot separate plausible causes.

## Launch gate

Every line is a check with an observable result. Tick nothing without running it.

- The real HTTPS origin is set. Metadata base, canonicals, Open Graph URLs, sitemap, and the `robots.txt` sitemap line use it.
- Staging authentication, `noindex`, and crawl blocks are gone from production and stay on staging.
- Representative routes in every locale return 200 with the intended locale URL and no accidental redirect.
- Canonicals, reciprocal alternates, sitemap, robots, structured data, and social previews validate.
- The property is verified in Search Console and Bing, the sitemap is submitted, and warnings and exclusions are recorded.
- Internal links, the 404 page, mobile layout, analytics collection, and the real conversion path work. Commerce: sample variants, offers, and feeds. Publishing: sample dates and pagination.
- A baseline of indexed pages, impressions, clicks, conversions, and performance is saved when the old site has data.
- The crawler policy for training, search, and user-fetch is written down. See [AI crawler reference](ai-crawler-reference.md).

## Migration

```text
Old URL → closest equivalent new URL
├── Exists → 301 or 308
├── No equivalent but a close category → 301 to that category
└── Nothing relevant → 404 or 410. Never redirect to the homepage.
```

1. Export old URLs from analytics, search reports, sitemaps, logs, and backlinks, for every locale and important media.
2. Map each to its closest new page.
3. Test the new site before launch. Prepare redirects and confirm staging restrictions will lift.
4. Use server-side permanent redirects. No chains, no loops.
5. Update internal links, canonicals, alternates, structured-data URLs, and sitemap entries to the new URLs.
6. Launch. Test a sample of mappings and new canonical pages. Submit the new sitemap. Use the change-of-address tool when it applies. [doc]
7. Monitor crawl errors, redirects, indexing, traffic, and conversions by old and new URL sets. Keep redirects for at least a year. [doc]

Do not promise a recovery date. Recrawling runs on the search engine's schedule, and performance moves during a migration.

### Adding or removing a locale

Adding: treat it as a launch for that locale. Run the launch gate on that locale's URLs only, and confirm existing locales' alternates gained the new one.

Removing: 301 every URL to the closest equivalent in the default locale, remove the locale from alternates and the sitemap of every remaining page, then delete routes. A removed locale that still returns 200 competes with the pages that replaced it.

Sources, checked 2026-09-30: [Search Console](https://search.google.com/search-console/about), [URL Inspection](https://support.google.com/webmasters/answer/9012289), [site moves with URL changes](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), [redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Core Web Vitals](https://web.dev/articles/vitals).
