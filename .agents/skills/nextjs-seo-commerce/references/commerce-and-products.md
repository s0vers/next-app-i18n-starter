# Commerce and product SEO

Use when a task involves a store, catalog, category, product page, variants, prices, stock, reviews, a product feed, comparison content, or AI shopping surfaces. Field-level markup rules live in structured data (`nextjs-seo-structured-data`). This page decides which pages to build, index, and mark up.

## Gate: what does the business do

The answer picks the eligible features. Ask before proposing anything.

| Model | Search feature | Notes |
| --- | --- | --- |
| Direct seller, checkout on the site | Merchant listings and product snippets | Needs price, currency, and availability in initial HTML |
| Reviewer, affiliate, or comparison site | Product snippets only | Never mark up as a seller. First-hand evidence is the value. |
| Marketplace seller | Marketplace search (Amazon, Etsy) plus own site | Keep GTIN, brand, and MPN identical on both |
| Lead generation, no price | Neither | Use ordinary page SEO |

Industry names for the work: category SEO (head terms, highest value), product page SEO (long-tail model and SKU terms), facet or programmatic SEO (indexed attribute pages generated from data), merchant or shopping SEO (feed plus markup plus Merchant Center), marketplace SEO, and AI shopping feeds. Intent runs transactional, commercial investigation ("best X", "X vs Y"), informational, and navigational. Give one intent to one page, or pages cannibalize each other. [practice]

## Page jobs

| Page | Job | Markup |
| --- | --- | --- |
| Category or collection | Help a shopper narrow a real assortment | `BreadcrumbList`. No `Product`. |
| Product detail | Explain one product and support a purchase | `Product` and `Offer`, or `ProductGroup` |
| Brand | Group a brand's products, state reseller status | Visible brand only |
| Comparison or buying guide | Help choose among products | `Product` with review (snippets) |
| Policy (shipping, returns, contact) | Answer trust questions per market | `Organization` policies |

Link category to subcategory to product with `<a href>`. Search engines do not submit site-search forms, so a product reachable only by search is invisible. Put product URLs in the sitemap. A Merchant Center feed supplements discovery and does not replace navigation. [doc]

## Decide which URLs to index

An indexable URL has distinct shopper value, a stable 200, a self-canonical, unique content, a crawlable link, and a sitemap entry. Walk each URL class.

```text
Product with variants
├── Variants are selectors on one page (?color=red) → index the parent; canonical is the unparameterized URL
└── Each variant has its own URL → index each with demand; self-canonical; repeat the ProductGroup on each page
Category
├── Page 1 → index
├── Page N → index, self-canonical (never canonical to page 1), sequential <a href>, no rel=next/prev
└── Empty → 404
Facet or filter
├── One value with real demand, stable non-empty results, unique title and copy → static path (/shoes/nike/), self-canonical, sitemap
├── Three or more combined facets, sort, view mode, session, tracking, location → robots disallow, or noindex. Never in the sitemap.
└── Nonsense combination → 404
Internal search results → noindex or disallow. A curated head query becomes a real collection.
```

Pick one mechanism per URL class. A disallowed URL is never fetched, so its `noindex` is never seen, and a linked disallowed URL can still be indexed by address alone. Google documents canonicals as weaker than robots for facet control. [doc] "Index a facet above about 50 searches a month" is a heuristic, not Google guidance. [practice]

Use evergreen URLs for seasonal collections (`/deals/black-friday`), not year-stamped ones. Keep them at 200 off season with truthful copy. [practice]

## Stock changes

```text
Stock state
├── Out for now, return expected → keep 200 and URL; availability OutOfStock (or BackOrder, PreOrder); alternatives; keep in sitemap
├── Discontinued but useful (parts, support, resale) → keep 200; availability Discontinued; show alternatives
├── Discontinued with links and a real successor → 301 to the successor
├── Gone, no equivalent → 404 or 410 (same handling); drop from sitemap, feeds, internal links
└── Never redirect to home or an unrelated page. It reads as a soft 404.
```

Google publishes no out-of-stock guide, so present "keep the page" as a shopper-first choice, not as a Google rule. `Discontinued` exists in markup, and the Merchant Center feed accepts only in stock, out of stock, preorder, and backorder. [doc] Update feed, markup, sitemap, and links together. Verify the real HTTP status, because a streamed Next.js page can return 200 with a not-found body.

## Markets, currency, and languages

Google needs a distinct URL per currency. Merchant Center bans landing pages that switch language or currency by location, and shipping currency must match offer currency. [doc]

| Situation | URL design |
| --- | --- |
| Same price, currency, shipping across a language | `/es/...`, tag `es` |
| Same language, different country or currency | `/en-gb/...` and `/en-us/...`, own `priceCurrency`, shipping, returns, tags with region |
| One country, several languages, one currency | `/es/`, `/ca/`, same currency |
| Currency toggle by cookie | Not separate offers. One canonical currency per URL. Converted price is plain text, not markup. |

This template's locales are language-only, and `localeConfig` ties one currency to each route locale (`en` is USD, `es` is EUR). That fits one market per locale. A second currency for the same language needs its own route locale. Example for UK pounds:

1. Add `"en-gb"` to `localeConfig` in `src/i18n/locales.ts` with `languageTag: "en-GB"`, `currency: "GBP"`, `timeZone: "Europe/London"`, and add `dictionary/en-gb.json` (a copy of `en.json` with local spelling and terms).
2. `routing.ts` reads `locales`, so `/en-gb` exists with no other change. `getLocaleUrl` builds its URLs.
3. Each product gets `/en-gb/...` with its own `Offer` in GBP, shipping, and returns, and alternates `en-US` and `en-GB`, plus a language-only `en` if you want a catch-all.
4. Confirm `<html lang>`, the price format, and the sitemap entry.

Never hide the market behind a cookie or IP. See international SEO (`nextjs-seo-international`).

## Markup and feeds

Pick the type with structured data (`nextjs-seo-structured-data`). Rules that matter here:

- Build `Product`, `Offer`, the visible price, the feed export, and any Merchant API push from one `getProduct()`. Two sources drift, and a mismatch between page and feed triggers disapproval.
- Render offers in initial HTML. Google warns that script-generated markup makes Shopping crawls less frequent and less reliable for fast-changing price and stock. [doc]
- Put shipping and return policy on `Organization` unless products differ. Search Console and Merchant Center settings override site markup. [doc]
- Review markup only for visible, genuine reviews. Fake or undisclosed incentivized reviews break policy. A store rating on its own `Organization` is ineligible. [doc]
- A feed and markup together maximize eligibility. Merchant Center is required for the Shopping tab and not for organic Search. The Content API for Shopping ended 2026-08-18, so use the Merchant API. Merchant Center will enforce images of at least 500 by 500 pixels from 2027-01-31. [doc]

### AI shopping surfaces

Google says AI Overviews and AI Mode need no special markup, only current Merchant Center and Business Profile data. [doc] ChatGPT (a feed to OpenAI's spec, with `OAI-SearchBot` allowed), Google's agentic checkout (a Merchant Center `native_commerce` attribute and a UCP manifest), Copilot Checkout, and Perplexity's Merchant Program each take a feed or a program enrollment, and each is early access or US first. These change monthly, so read the program's own page before advising, record which ones the owner enrolled, and mark the rest not verified. [unverified] The same clean GTIN, brand, price, availability, shipping, and return data serves every surface. Set crawler policy per bot in AI crawler reference (`nextjs-seo-ai-search`).

## Page checklists

Product page: one indexable URL and a descriptive slug. A unique title, heading, and description, because manufacturer copy is duplicate content. Several sharp images (at least 50,000 pixels in markup). Price, currency, availability, shipping cost and time, and a returns summary visible without a click. Roughly 60 percent of shoppers look for the return policy on the product page. [study, Baymard] Visible genuine reviews. Links to parent category, brand, and related items with descriptive anchors. `BreadcrumbList`. A stock module with alternatives.

Category page: a keyword-based name, a short intro above the grid, buying help below. Products in `<a href>`. Real pagination URLs. Filters and sorts users need (price, rating, size, color, brand). No `Product` markup. One primary page per commercial query, with informational content on guides.

Comparison or guide: first-hand evidence, measurements, strengths and weaknesses, alternatives, and a substantiated ranking. Product snippet markup, never merchant listing.

Policy pages: real terms per market, linked from the footer and product pages, mirrored in `Organization` policies.

## Next.js notes

- `generateMetadata` in `[locale]/products/[slug]/page.tsx`. Share the fetch with `React.cache`. Emit alternates only for locales where the product exists.
- With Cache Components, keep the Offer price in the same cache unit as the visible price. Use a short `cacheLife` or invalidate by tag from an inventory webhook. A price in a cached shell is stale until revalidation.
- Decide existence before streaming (see technical SEO (`nextjs-seo-technical`)). Next.js has no built-in 410, so return `new Response(null, { status: 410 })` from `proxy`.
- Sitemaps for large catalogs: `generateSitemaps()` splits at 50,000 URLs, and in Next 16 `id` is a promise, so coerce with `Number(await id)`. List the resulting files in a sitemap index or `robots.ts`. Each entry can carry `alternates.languages`.
- Disallow facet, sort, and search parameters in `robots.ts`. Keep `_next/static` crawlable. Set `robots: { index: false }` in `generateMetadata` for non-indexable filter routes.

## Done when

Sample a product, out-of-stock product, category page 1 and 2, an indexable facet, a non-indexable facet, a sorted URL, an empty category, a removed product, and a redirected product in each market. For each, record status, canonical, robots, and alternates. View source without JavaScript shows title, heading, product links, and JSON-LD with price, currency, and availability equal to the visible UI. One product's price change reaches page, JSON-LD, and feed. The sitemap holds only 200 canonical URLs. Report which shopping programs the owner still has to verify. Rich Results Test proves eligibility, not display.

Sources, checked 2026-09-30: [ecommerce site structure](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure), [URL structure](https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites), [faceted navigation](https://developers.google.com/crawling/docs/faceted-navigation), [pagination](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading), [merchant listings](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing), [Merchant Center currency and location rules](https://support.google.com/merchants/answer/15404838), [Merchant API migration](https://developers.google.com/merchant/api/guides/compatibility/overview), [OpenAI product feed spec](https://developers.openai.com/commerce/product-feeds/spec), [Baymard product page UX](https://baymard.com/blog/current-state-ecommerce-product-page-ux), [Next.js generateSitemaps](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps).
