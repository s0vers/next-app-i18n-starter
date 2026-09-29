# Editorial, blog, and publisher SEO

Read this for blog architecture, article templates, publication workflows, and news. A blog is not automatically a news publication; choose the audience and page job before a search feature.

## Design the editorial inventory

1. Identify the reader's question, existing pages that already answer it, and the source of expertise or first-hand evidence. Decide whether to improve an existing page, publish a distinct article, or create a navigable topic/category hub. A new URL needs a distinct purpose.
2. Map article → category/topic → related article and relevant product/service links. Use descriptive crawlable anchors. Archives and pagination need stable URLs and links to older posts; a search box or infinite scroll alone is insufficient for discovery.
3. Define each article's canonical URL, locale equivalents, author, publication date, meaningful modification date, and images from the content source. Missing translations should not generate empty locale routes or fictitious `hreflang` pairs.
4. Match the article format to the task: tutorial, reference, opinion, research, comparison, or news. Show the method, evidence, examples, and limits that make claims credible. For sensitive topics, use appropriate expert review and source attribution.

## Publish an article

- Give the page a descriptive, unique title and visible heading, an accurate summary, readable body, useful references, and contextually relevant images. The meta description is a snippet suggestion; Google may use other page text.
- Render the main content, canonical, title, and publication information in crawlable HTML. Keep essential article text available without requiring a tab click, account, or client-only fetch unless that is an intentional access policy.
- Use `Article`, `BlogPosting`, or `NewsArticle` JSON-LD only when the page is that kind of article. Populate headline, images, dates, and author from truthful visible/source data. Google says Article markup helps it understand article details; markup is not a prerequisite for Top stories.
- Show publication and updated dates only when they are accurate. Change `dateModified` and sitemap `lastModified` for substantive updates, not routine build times or cosmetic changes.
- Apply the international playbook to actual translated articles. Localize editorial examples and query terminology when the market calls for it; keep author and source claims accurate across versions.

## News is a separate branch

If the site publishes timely original news, check current Google News content, article, and news-sitemap rules. A news sitemap is for eligible recent articles; it is not a general blog sitemap or a shortcut to Google News inclusion. Do not add news infrastructure to a marketing blog merely because it has posts.

## Maintain the library

Review by URL set and reader task. Refresh content when facts or offerings change, consolidate substantially overlapping posts, and preserve or redirect old URLs according to the closest useful replacement. Track impressions/clicks by page and query alongside engaged visits or conversions; a change in ranking alone does not prove editorial value. For AI-assisted drafts, verify every factual claim and add actual expertise or evidence before publication. Check current spam policies before scaling generated pages.

## Done when

Inspect at least one article, topic/archives page, older paginated page, and affected locale equivalent. Confirm article discovery, rendered content, dates, canonicals, alternates, schema claims, and the destination of changed URLs. Report what is verified in code versus live indexing or search performance.

## Primary sources

- [Google helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google date guidance](https://developers.google.com/search/docs/appearance/publication-dates)
- [Google pagination and incremental loading](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)
- [Google News sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap)
- [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies)
