# Content and on-page SEO

Use when the work concerns what a page says, who it serves, how pages link to each other, or how a result describes the page. Markup cannot make up for a page that does not meet a real need.

## Build the page around one search task

1. Name the audience and the decision the page helps with. Ask what the visitor needs to know or do next.
2. Classify the intent. Informational, navigational, commercial investigation, or transactional. One page serves one intent. Two intents need two pages, and each must add its own value.
3. Look at the current results for the query before choosing a format. The results show which format wins (guide, list, tool, category, product) and which angle is missing. [practice]
4. Compare existing pages before proposing a URL. Improve or consolidate before adding. See the gate in [editorial and publishing](editorial-and-publishing.md#gate-should-this-article-exist).
5. Put the direct answer and the essential facts in crawlable HTML, near the top, under descriptive headings.
6. Add what only you can: first-hand detail, measurements, examples, data, product specifics. A page any competitor could have written adds nothing.
7. Read the rendered page as the visitor. Does it resolve the task, state its limits, and offer the next step? If the reader must search again, revise it.

Keyword numbers from tools are estimates. Label them as estimates, and never invent search volume for a locale.

## Page elements

| Element | Rule | Why |
| --- | --- | --- |
| Title | Unique, names the main subject, matches the visible heading | Google rewrites titles that are inaccurate, stale, or stuffed [doc] |
| Description | Summarizes this page for a person deciding to click | It is a snippet suggestion, and Google may use page text instead [doc] |
| Headings | One main heading. Section headings describe what follows. | Readers, screen readers, and crawlers scan them |
| Links | Ordinary `<a href>` with descriptive anchors. Never "click here". | Crawlers follow only anchors with an `href` [doc] |
| Images | Relevant, with alt text that states the image's purpose in context. Decorative images get `alt=""`. | Alt text serves both accessibility and image search |
| Dates and authors | Show them only when accurate | Fake freshness is a spam signal |
| Structured data | Only per structured data (`nextjs-seo-structured-data`) | Eligibility, not ranking |

Do not add a `keywords` meta tag. Search engines ignore it.

## Internal linking

- Every important page has at least one inbound link from an indexed page and appears in the sitemap.
- Link from a hub to its spokes and back, and from a spoke to its two to five closest relatives.
- Anchor text says what the destination is. Keep it varied and natural, because repeated exact-match anchors read as manipulation.
- Link within one language. Cross-language links belong to the language switcher.

## Localized content

Translate and review the whole page body for the audience, and the metadata with it. Research local terminology and intent before adapting titles. Read international SEO (`nextjs-seo-international`) for URLs, alternates, and tags.

## Do not scale thin pages

Avoid these patterns. Google's spam updates in August and September 2026 targeted scaled programmatic content, and each pattern below has been flagged by practitioners. [practice]

| Pattern | Why it fails |
| --- | --- |
| A page for every "X vs Y", "alternatives", "best X for Y" without real testing | No first-hand evidence |
| One-question glossary or FAQ farms | Thin pages on one intent |
| Location or language template pages that differ by a name | Doorway pages [doc] |
| A ranked list that puts the publisher first with no basis | Self-serving |
| Integration pages that only swap a logo | No distinct value |

Programmatic pages are acceptable only when each page carries substantive, proprietary, or useful data that a reader wants. Ask of any generated page: would this page be worth visiting if it were the only one? If not, do not publish it. A forced FAQ block, a word-count target, a keyword list, and a repeated summary all fail the same test.

An FAQ block earns no rich result (see structured data (`nextjs-seo-structured-data`)). Add one only when readers ask those questions.

## AI-assisted drafting

Draft with AI only when a person adds expertise, verifies every factual claim, and takes responsibility for the result. Disclose AI use where readers would expect it. Check the current spam policies before publishing at scale. [doc]

## Verify

- Title, heading, description, and canonical exist in the rendered HTML in the page's language.
- The direct answer appears above the fold without a click.
- Every claim that a reader may check has a source.
- The page has an inbound link and a sitemap entry.

Sources, checked 2026-09-30: [helpful, reliable content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [title links](https://developers.google.com/search/docs/appearance/title-link), [snippets](https://developers.google.com/search/docs/appearance/snippet), [crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [image SEO](https://developers.google.com/search/docs/appearance/google-images), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies), [Ahrefs search intent](https://ahrefs.com/blog/search-intent/).
