# Technical SEO

Use when a search engine cannot discover, fetch, render, understand, or choose the intended URL, or when changing metadata, robots, sitemap, redirects, canonicals, or rendering. Diagnose the failing layer before touching metadata or markup.

Evidence tags: see [evidence and reporting](evidence-and-reporting.md).

## Gate: is there production evidence

For "my page is missing from Google", ask for the URL Inspection result first: indexing verdict, last crawl, crawl and fetch status, indexing permission, user-declared canonical, and Google-selected canonical. Without it, inspect the repository and local output, list plausible causes, and stop before attributing a live cause or patching code. A local build cannot show Google's crawl or canonical choice. Say "hypothesis" until live evidence exists.

## Diagnose in order

Walk the layers top to bottom and stop at the first failure. An early failure makes later work irrelevant.

1. Reachability. Request the URL with no browser session: DNS, TLS, status, redirects, and any authentication or CDN challenge. A robots allow rule cannot make an unreachable page crawlable.
2. Crawl permission. Read `robots.ts`, static robots files, host and CDN rules, and headers. Robots.txt controls fetching. It does not reliably remove a known URL from results. `noindex` only works if the crawler can fetch the page. Private content needs authentication.
3. Rendered content. Compare the initial HTML with the rendered page. Title, canonical, primary content, links, and structured data must be present in the initial response or reliably rendered. Google does not render some non-200 pages, and a `noindex` in the original HTML can stop indexing even if script later removes it. [doc]
4. Index directives. Check `noindex`, `X-Robots-Tag`, canonical, redirects, and duplicate URL variants. One preferred URL must agree across redirects, canonical, internal links, and sitemap. A canonical is a hint. Google can choose another URL. [doc]
5. Discovery. Ordinary `<a href>` from relevant pages, plus an accurate sitemap. A sitemap is a hint and not an indexing request. Google ignores `priority` and `changefreq`, and uses `lastmod` only when it is consistently accurate. [doc]
6. Presentation. Unique title and description, visible headings, `<html lang>`, social metadata, and eligible structured data. Pick the feature from the page type.
7. Experience. Mobile layout and field performance. Lab tools diagnose, and field data judges.

Report the first failing layer, the affected URL set, the evidence, the likely cause, and the smallest fix. A green build, valid markup, or a submitted sitemap does not prove indexing.

## Status codes and soft 404s

| Situation | Return |
| --- | --- |
| Page exists | 200 |
| Moved permanently | 301 or 308 to the closest equivalent. 302 and 307 are weak signals. |
| Gone | 404 or 410. Google treats them the same. |
| Private | 401 or 403, or authentication. Not `noindex`. |
| Server error or maintenance | 503 |

A 200 with a "not found" body is a soft 404, and a redirect to an unrelated page reads as one too. In Next.js, `notFound()` returns a true 404 only before streaming begins. After a Suspense boundary or `loading.tsx` starts streaming, the status is already 200. Decide existence before streaming: call the existence check, and `notFound()`, at the top of the page component and at the top of `generateMetadata`, before any Suspense boundary or `loading.tsx`. Or return the status from `proxy`. Confirm with `curl -sI` that a missing item returns 404.

## Next.js checks

- Use `metadata` for static routes and `generateMetadata` for data-dependent ones. Inspect the rendered `<head>` and never infer it from source.
- `generateMetadata` may stream after the initial UI for bots that run JavaScript. Keep title and canonical in the initial response for crawlers that read HTML only.
- Set the origin once through `metadataBase` and the validated site config. Canonical, Open Graph URL, sitemap URLs, and redirects agree.
- Generate `sitemap.ts` and `robots.ts` from the same source as routes and locale URLs. Absolute URLs. Only indexable URLs. `lastModified` from a real content date, never `new Date()`.
- A dynamic route sets its own metadata and body. A child route never inherits the homepage title, canonical, or structured data.
- JSON-LD follows structured data (`nextjs-seo-structured-data`).
- Use `next/image` with explicit dimensions and keep image URLs absolute in metadata.
- Preview and draft routes send `noindex` and stay out of the sitemap and `generateStaticParams`.

## Symptom guide

| Symptom | Inspect first |
| --- | --- |
| URL missing from results | URL Inspection verdict, last crawl, fetch status, selected canonical. Then HTTP response, robots and `noindex`, internal links, sitemap. |
| "Crawled, currently not indexed" | Quality, duplication, and thin content. Not a crawl fault. |
| "Discovered, currently not indexed" | Crawl budget, internal links, server speed |
| Wrong URL appears | Redirect chain, canonical, sitemap, internal links, parameter variants |
| Search title differs from `<title>` | Rendered title, main heading, anchor text pointing at the page, and whether the title summarizes the page |
| Rich result missing | Feature eligibility, visible matching content, validation, policy issues. Check the search gallery: the feature may be removed. |
| Crawler sees different content | Initial versus rendered HTML, blocked JS or CSS, locale redirects, user-agent-specific responses |
| Core Web Vitals poor | Field report and URL group first. Then a lab trace for the source of LCP, INP, or CLS. |
| Locale collapsed into English | Canonical of the locale, hreflang reciprocity, translated body. See international SEO (`nextjs-seo-international`). |

## Verify

Request representative URLs with `curl -sI` and `curl -s`, and read: status, redirects, `Link`, `X-Robots-Tag`, `<title>`, canonical, `<html lang>`, robots meta, JSON-LD. `node .agents/skills/nextjs-seo-technical/scripts/verify-seo.mjs` does this across a sitemap. Then run `bun run lint` after TypeScript edits and `bun run build` after substantive changes.

Sources, checked 2026-09-30: [Search Essentials](https://developers.google.com/search/docs/essentials), [crawling and indexing](https://developers.google.com/search/docs/crawling-indexing), [canonicalization](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [block indexing](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [HTTP status codes](https://developers.google.com/search/docs/crawling-indexing/http-network-errors), [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [Next.js sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap), [Next.js robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots), [Next.js JSON-LD](https://nextjs.org/docs/app/guides/json-ld).
