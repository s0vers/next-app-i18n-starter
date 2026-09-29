# Technical SEO

Use this playbook when search systems cannot discover, fetch, render, understand, or select the intended URL. Diagnose the failing layer before changing metadata or adding markup.

## Diagnose in order

For a report that a page is missing from Google, first capture its URL Inspection result: indexing verdict, last crawl, crawl and fetch status, indexing permission, user-declared canonical, and Google-selected canonical. If the owner cannot provide production data, inspect the repository and local output, list the plausible causes, and stop short of attributing the live cause or patching code. A local build cannot reveal Google's crawl or canonical selection.

Then check these layers in sequence. A failure early in the path makes later refinements irrelevant.

1. **Reachability:** request the URL without a browser session. Record DNS/TLS, status code, redirects, and whether authentication or a CDN challenge intervenes. A robots allow rule cannot make an unreachable page crawlable.
2. **Crawl permission:** inspect app `robots.ts`, static robots files, hosting rules, CDN rules, and headers that affect the relevant crawler. `robots.txt` controls fetching; it does not reliably remove an already known URL from search. If `noindex` is the intended exclusion control, the crawler must be able to fetch the page to see it. Use authentication or another access control for private content.
3. **Rendered content:** inspect the initial HTML and the rendered page. Confirm the primary content, links, title, description, canonical, and structured data are present in the response or reliably rendered. If client JavaScript supplies essential content, inspect the rendered output and fix blocked assets or hydration failures.
4. **Index directives:** inspect `noindex`, `X-Robots-Tag`, canonical, redirects, and duplicate URL variants. Align redirects, canonical tags, internal links, and sitemap entries on one preferred URL. A canonical is a hint; crawlers can select another URL.
5. **Discovery:** check for ordinary crawlable links from relevant pages and an accurate sitemap entry. A sitemap is a discovery hint, not an indexing request or guarantee.
6. **Presentation:** verify unique page titles and descriptions, visible headings, language, social metadata, and any eligible structured data. Select the feature by real page type (for example, article versus directly purchasable product), then check its current requirements before adding markup.
7. **Experience:** test mobile layout and field performance. Separate field data from local lab tests; use lab tools to diagnose, and field data to understand real-user outcomes.

Report the first failing layer, affected URL set, evidence, likely cause, and the smallest fix. For a complaint about a live URL, do not attribute the cause from repository code alone. A successful build, valid markup, or sitemap submission does not prove indexing.

## Next.js checks

- Use `metadata` for static route metadata and `generateMetadata` when metadata depends on route or request data. Inspect the rendered `<head>` rather than inferring output from source alone.
- Set a canonical absolute origin through `metadataBase` and the project's validated site configuration. Keep canonical, Open Graph URL, sitemap URL, and redirects consistent.
- Generate `sitemap.ts` and `robots.ts` from the same source of truth as routes and locale URLs. Include only URLs intended for indexing. Use absolute URLs; set `lastModified` only from real content timestamps.
- Check each dynamic route's metadata and rendered body independently. Do not let a child route inherit the homepage title, canonical, or structured data.
- Keep JSON-LD in a Server Component. Escape `<` in serialized JSON. Confirm every claim in the markup is visible on that page and that the specific search feature accepts that schema type.
- Run `bun run lint` after TypeScript or TSX edits and `bun run build` after substantive app changes. Inspect HTML and route responses for crawl-related changes.

## Symptom guide

| Symptom | Inspect first |
| --- | --- |
| URL is missing from results | URL Inspection verdict, last crawl, fetch status, and selected canonical; then check HTTP response, robots and `noindex`, internal links, and sitemap discovery |
| Wrong URL appears | Redirect chain, canonical, sitemap, internal links, parameter variants |
| Search title differs from `<title>` | Rendered title, prominent headings, anchors to the page, and whether the title accurately summarizes the page |
| Rich result is missing | Feature eligibility, visible matching content, structured data validation, policy issues, and Search Console reports |
| Content differs in crawler output | Initial and rendered HTML, blocked JavaScript/CSS, locale redirects, and user-agent-specific responses |
| Core Web Vitals are poor | Field report and URL group first; use a lab trace to locate the source of LCP, INP, or CLS |

## References

- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [Google crawling and indexing](https://developers.google.com/search/docs/crawling-indexing)
- [Google canonicalization](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects)
- [Google sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js sitemap convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Next.js robots convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Next.js JSON-LD guidance](https://nextjs.org/docs/app/guides/json-ld)
