# Audits, launches, and migrations

Use this playbook for a site-wide review, production SEO checklist, deployment verification, URL change, domain move, or drop in search traffic. Keep an audit evidence-based and give each finding a next action.

## Scope the work

Before auditing, identify:

- Site origin and environment being reviewed.
- Whether the request is a baseline audit, a launch gate, a migration, or a diagnosis of a measured decline.
- The affected pages, locales, templates, markets, and search engines.
- Access to rendered pages, logs, analytics, Search Console, or other webmaster tools.
- The time period, device, country, and search type behind a reported change.

If production access is unavailable, audit the repository and local output, then list the live checks an owner must complete. Never describe local output as a production audit.

## Run a layered audit

1. **Inventory:** list indexable routes by template and locale. Compare app routes, sitemap entries, canonical targets, and important internal links.
2. **Technical sample:** select representative URLs and inspect status, redirects, crawl access, rendered HTML, `noindex`, canonical, title, language, and structured data. Expand the sample when templates or locales differ.
3. **Content sample:** inspect whether each page has a distinct purpose, accurate metadata, useful main content, and sensible internal links. Use the content playbook for editorial work.
4. **International sample:** verify body language, `<html lang>`, `dir`, canonicals, reciprocal alternates, locale switching, and sitemap output for every locale.
5. **Platform data:** use Search Console or the relevant webmaster tool for indexing state, selected canonical, queries, pages, countries, and search appearance. Use [Measurement](measurement.md) for report definitions and attribution. Compare equivalent time periods and segments; identify analytics instrumentation changes before attributing a decline to search.
6. **Performance and experience:** inspect field data and device behavior. Use local lab traces to diagnose problems; do not present a Lighthouse score alone as a ranking report.
7. **Prioritize:** group duplicate symptoms by root cause and affected templates. Rate impact, number of URLs/users affected, confidence in evidence, and implementation cost. Separate blocking issues from enhancements and owner-only tasks.

For every finding, record: evidence and affected URLs, observed problem, likely cause with confidence, recommended action, priority with rationale, verification method, and any dependency on the deployment owner. Call a finding inconclusive when the evidence cannot distinguish plausible causes.

## Production launch checklist

- Set the real public HTTPS origin and site identity. Confirm metadata base, canonical URLs, Open Graph URLs, sitemap, and robots sitemap URL use it.
- Remove staging-only authentication, `noindex`, or crawl blocks from production. Keep staging protected from indexing.
- Check representative route responses and rendered HTML in every locale. Confirm no accidental redirect changes the intended locale URL.
- Validate canonicals, reciprocal `hreflang`, sitemap entries, robots behavior, structured data, and social previews.
- Verify the site in the relevant webmaster tools, submit the sitemap, and record any warnings or exclusions.
- Test internal links, 404 behavior, mobile layout, analytics collection, and the actual conversion or key-event path. For commerce, sample product variants, offers, and feeds; for publishing, sample article dates and archive pagination.
- Save a baseline for indexed pages, impressions, clicks, conversions, and performance before launch when the existing site has data.

## URL or domain migration

1. Export old URLs from analytics, search reports, sitemaps, logs, and high-value backlinks. Include every locale and important media URL.
2. Map each old URL to its closest equivalent new page. Do not redirect unrelated pages to the homepage.
3. Test the new site before launch. Prepare redirects, and make sure staging restrictions will be removed at launch.
4. Use server-side permanent redirects when URLs have permanently changed. Avoid redirect chains and loops.
5. Update internal links, canonical URLs, `hreflang`, structured data URLs, and sitemap entries to the destination URLs.
6. Launch and test a sample of old-to-new mappings and new canonical pages. Submit the new sitemap and use the appropriate change-of-address process when applicable.
7. Monitor crawl errors, redirects, indexing, traffic, and conversions by old and new URL sets. Keep redirects in place long enough for users and crawlers to transition; follow current platform migration guidance for the specific move.

Do not promise a recovery date. Search systems recrawl and process URLs on their own schedules, and performance can fluctuate during a move.

## References

- [Google Search Console](https://search.google.com/search-console/about)
- [Google URL Inspection](https://support.google.com/webmasters/answer/9012289)
- [Google Search performance report](https://support.google.com/webmasters/answer/7576553)
- [Google site moves with URL changes](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Google redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [web.dev Core Web Vitals](https://web.dev/articles/vitals)
