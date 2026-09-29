# Structured data

Use when adding, changing, or auditing JSON-LD, or when someone asks for "schema", rich results, or a search feature. Markup describes visible content. It does not rank a page and does not guarantee a rich result. Google says AI Overviews and AI Mode need no special markup. [doc]

Evidence tags: `[doc]` platform documentation, `[practice]` practitioner evidence. See [evidence and reporting](evidence-and-reporting.md).

## Rules

1. Every value in the markup is visible on the page or derives from the same data as the visible value. Hidden or mismatched markup breaks Google's structured data policy. [doc]
2. Google's gallery changes without notice. Open the [search gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) before claiming a feature. A summarizer or an older article may list a removed one.
3. Render JSON-LD in a Server Component with a native `<script type="application/ld+json">`, and serialize with `JSON.stringify(data).replace(/</g, "\\u003c")`. The escape stops a `</script>` in data from closing the tag.
4. Localize every string in the markup with the page's content. `inLanguage` is optional and must match the page.
5. Validate with the Rich Results Test and the Schema Markup Validator. A pass proves eligibility. It does not prove display.
6. Do not add a type only because it exists in schema.org. Add it when a supported search feature fits the page, or when a non-Google consumer needs it and the content is visible.

## Choose the type

```text
What is the page?
├── Home → Organization and WebSite (once, homepage or about only). WebSite goes on the default-locale domain homepage.
├── Article or post → BlogPosting or Article; NewsArticle for a news desk; add isAccessibleForFree false for paywalled
├── Author or profile → ProfilePage with a Person mainEntity
├── Product page → Product and Offer; ProductGroup for variants (see commerce)
├── Editorial product review → Product with review (snippets), never merchant listing
├── Category or listing of many products → BreadcrumbList only
├── Video watch page → VideoObject
├── Recipe, event, job, course → their own types
├── Forum thread → DiscussionForumPosting; one question with user answers → QAPage
├── Store location → LocalBusiness subtype
├── Tutorial, comparison, glossary, changelog → Article or none
└── Anything else → check the gallery; if absent, skip
```

## Status as of 2026-09-30

| Type | Status | Add when |
| --- | --- | --- |
| Article, BlogPosting, NewsArticle | Supported, no required properties | Real dated, bylined articles. `author.name` holds only the name. |
| BreadcrumbList | Supported, desktop results | Hierarchy that matches the real path |
| Organization, WebSite | Supported | Once, on the homepage or about page |
| Product, Offer, ProductGroup | Supported | Real products. Fields below. |
| Review, AggregateRating | Supported for listed types | Independent, visible reviews. Never a self-review on Organization or LocalBusiness. |
| LocalBusiness | Supported. Name and address required. | Real locations, one page each |
| VideoObject | Supported. `name`, `thumbnailUrl`, `uploadDate`. | Watch pages where the video is the reason to visit |
| Recipe, Event, JobPosting, SoftwareApplication | Supported with their own required fields | The page really is one. Remove expired jobs and past events. |
| ProfilePage, DiscussionForumPosting | Supported | Author pages, forums |
| QAPage | Narrow. One question, user-submitted answers. | Support communities. Not a site's own FAQ. |
| Course list | English only, carousel of at least 3 courses | Instructor-led courses |
| Dataset | Dataset Search only | Downloadable datasets with a license |
| Speakable | Beta, US English publishers | Skip elsewhere |
| Vacation rental | Partner only | Skip |
| FAQPage | Rich result removed 7 May 2026. Markup is valid and earns nothing in Google. | Skip for Google |
| HowTo, Sitelinks searchbox | Removed in 2023 and 2024 | Skip |
| Course info, Claim review, Estimated salary, Learning video, Special announcement, Vehicle listing, Book actions, Practice problem | Deprecated 2025 and 2026 | Skip |

## Product and Offer fields

R is required for the feature, Rec is recommended. Source: Google product docs, checked 2026-09-30.

| Field | Snippet (no purchase) | Merchant listing (purchase) |
| --- | --- | --- |
| `name` | R | R |
| `image` (at least 50,000 pixels, several ratios) | Rec | R |
| `offers` | one of `review`, `aggregateRating`, `offers` | R |
| `offers.price` (above 0 for merchant) | R inside Offer | R |
| `offers.priceCurrency` (ISO 4217) | Rec | R |
| `offers.availability` | Rec | Rec |
| `offers.itemCondition`, `offers.url`, `priceValidUntil` | Rec | Rec (a past `priceValidUntil` can suppress the listing) |
| `sku`, `gtin`, `mpn`, `brand.name` | Rec | Rec (most specific GTIN) |
| `aggregateRating` (`ratingValue` and a count), `review` | Rec | Rec |
| `shippingDetails`, `hasMerchantReturnPolicy` | | Rec, prefer `Organization` level |
| `priceSpecification.priceType` StrikethroughPrice, `validForMemberTier` | | Rec for sale and member pricing |
| `category` (Text or CategoryCode) | | Rec |
| `AggregateOffer`: `lowPrice`, `priceCurrency` R; `highPrice`, `offerCount` Rec | multi-seller pages | |

`ProductGroup` needs `name` and a `productGroupID` (each variant repeats it as `inProductGroupWithID`). Add `variesBy` with full schema.org URLs and `hasVariant`. Each variant needs a unique ID. `ProductGroup` is not itself for sale, so its properties do not inherit.

Organization policies: `MerchantReturnPolicy` needs `applicableCountry` and `returnPolicyCategory` (plus `merchantReturnDays` for a finite window), or `merchantReturnLink`. `ShippingService` under `hasShippingService` needs `shippingConditions` with destination, rate, and transit time. Merchant Center or Search Console settings override site markup. Loyalty `MemberProgram` needs `name`, `description`, and `hasTiers`.

## Next.js pattern

```tsx
// Server Component. Build data from the same source as the visible text.
function serializeJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
/>
```

This is the pattern `src/app/[locale]/page.tsx` uses. It is a sketch for other types. Build `jsonLd` from the same object that renders the visible price, date, and author, so the two cannot drift. Use absolute URLs for `image` and `url`. The optional `schema-dts` package types the objects.

## Verify

- View source without JavaScript contains the JSON-LD, and it parses.
- Each value equals its visible counterpart in the same locale.
- Rich Results Test passes for the intended feature.
- After a content change, the markup changed with it.
