# Commerce and product SEO

Read this for stores, catalogs, product reviews, and shopping surfaces. First identify the actual business model: direct seller, marketplace, affiliate/reviewer, or lead generation. The choice changes which page and structured-data features are eligible.

## Choose the page job

| Page | Main job | Search checks |
| --- | --- | --- |
| Category or collection | Help shoppers narrow a real assortment | Distinct category purpose, crawlable product links, useful filters and pagination; no single-product `Product` markup |
| Product detail | Explain one product or product group and support a decision | Accurate description, images, identifiers, variant choices, price/availability where offered, delivery/return information |
| Editorial review or comparison | Help choose among products, perhaps sold elsewhere | First-hand evidence and tradeoffs; use product snippet rules when eligible, not merchant listing claims |
| Policy or support | Answer fulfillment and trust questions | Real shipping, returns, contact, and payment terms; link from relevant products |

Plan category → subcategory → product links with ordinary `<a href>` elements. Search engines generally do not submit site-search forms to discover products. Include important product URLs in the sitemap; a Merchant Center feed can supplement discovery, but it does not replace usable navigation.

## Decide the canonical catalog

1. Inventory product, variant, currency, pagination, sort, and filter URLs. Mark which combinations have distinct shopper value and should be indexable. Do not assume that every filter deserves a landing page.
2. Give each indexable URL a stable response, self-canonical, unique useful content, crawlable links, and a sitemap entry. Keep internal links and feeds on the intended canonical URL.
3. Handle alternate variants according to the actual URL model. One-page variants have one canonical product-group URL; multi-page variants need distinct URLs and the current Google `ProductGroup`/`Product` requirements. Localized equivalents also need the international SEO checks.
4. Keep infinite or low-value faceted URL spaces from consuming crawl resources. Choose controls based on whether a URL must be fetched for indexing, not from a universal rule that all parameters should be blocked. Check current crawler guidance before applying robots, canonical, or `noindex` broadly.
5. Make paginated content reachable through real URLs and sequential links. Verify product discovery beyond the first page and under JavaScript-disabled fetches.

## Choose shopping data

- A directly purchasable product page may qualify for **merchant listings**. A review or page that refers shoppers to another seller may qualify for **product snippets** instead. Check each feature's required properties and policies before adding markup.
- Populate `Product`/`Offer` from the same source as the visible price, currency, availability, shipping, and returns. Do not hardcode values that drift from live inventory. Google recommends product data in initial HTML for merchant experiences, especially when offers change quickly.
- Distinct currencies offered for sale need distinct URLs under Google's merchant-listing guidance. Treat locale, country, and currency as separate decisions; a translation alone does not imply a different offer.
- Add review/rating markup only for reviews genuinely shown and eligible under current review policies. Never synthesize ratings. For product variants, use `ProductGroup` only after confirming the site has real variant identifiers and a matching URL design.
- Consider Merchant Center when shopping surfaces matter. Product markup and feeds can complement one another; some surfaces require Merchant Center participation. Compare feed values with page content and inspect Merchant Center diagnostics.

## State changes

For out-of-stock, discontinued, replaced, and temporarily unavailable products, decide from the shopper's best destination and expected return of stock. Keep a useful product page when it still serves demand; show truthful availability and alternatives. Redirect only to a genuinely equivalent replacement. Return a true 404/410 when the item and useful page are gone. Update feeds, markup, sitemaps, and internal links together. Verify the HTTP status and rendered offer after the change.

## Done when

Sample a category, paginated category, product, variant, and unavailable item in each affected market. Confirm reachable product links, stable canonical URLs, rendered offer consistency, correct locale/currency, current sitemap/feed values, and applicable rich-result validation. Record which shopping surfaces and Merchant Center settings still require owner verification. Passing structured-data validation establishes eligibility, not display.

## Primary sources

- [Google ecommerce navigation](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure)
- [Google ecommerce URL structure](https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites)
- [Google faceted navigation crawling](https://developers.google.com/crawling/docs/faceted-navigation)
- [Google pagination and incremental loading](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)
- [Google Product structured data](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Google merchant listings](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)
- [Google product variants](https://developers.google.com/search/docs/appearance/structured-data/product-variants)
- [Google product data and Merchant Center](https://developers.google.com/search/docs/specialty/ecommerce/share-your-product-data-with-google)
