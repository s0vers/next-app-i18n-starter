# Editorial, blog, and publisher SEO

Use when a task involves a blog, article template, publication workflow, archive, author page, feed, syndication, news, or a content refresh. A blog is not automatically a news site. Choose the reader task first and the search feature second.

## Gate: should this article exist

```text
Does an existing URL already satisfy this task and this search intent?
├── Yes
│   ├── It is weak or stale → refresh in place (below)
│   ├── Two or more overlap on one intent and both underperform → consolidate into the stronger URL, 301 the rest, fix internal links
│   └── They serve different intents ("what is" versus "pricing") → keep both and cross-link
└── No
    ├── Can you add first-hand evidence, data, or a distinct angle? → publish; link from a hub and 2 to 5 related pages
    └── No → do not publish
```

Google's advice is to write non-commodity content made for people, and content made primarily for search engines is a red flag. [doc] Cannibalization matters only when pages share an intent and hurt each other. Delete, `noindex`, and canonical are not default fixes. [practice] Topic clusters (a pillar page plus linked spokes) are an organizing method. Google has never endorsed them as a ranking mechanism. [practice]

## Architecture

- Map article to topic to related article to relevant product or service, with descriptive anchors. A search box or infinite scroll alone does not make articles discoverable.
- Archives paginate on real URLs (`/blog/page/2` or `?page=2`) with a self-canonical and sequential links. Google ignores `rel=next` and `rel=prev`. [doc]
- Author pages (`/authors/[id]` per locale) carry a real bio and the author's posts, use `ProfilePage`, and link from every byline.

### Index or noindex

| Page | Decision |
| --- | --- |
| Topic or category hub with a real intro and demand | Index, self-canonical, sitemap |
| Tag with 1 to 3 posts, or a copy of a category | Do not create, or `noindex` and keep out of the sitemap. Google has no official tag rule, so this is judgment. [unverified] |
| Archive page 2 and later | Index, self-canonical |
| Filter, sort, internal search | `noindex` or robots disallow |
| Preview or draft | Require auth or a secret. Add `noindex` in metadata and never list drafts in the sitemap, feeds, or `generateStaticParams`. Robots disallow alone hides the `noindex` from crawlers. [doc] |
| Author page with no bio and 0 to 1 posts | `noindex` or omit |
| Untranslated fallback of a post | No route, or `noindex` and out of alternates |

## Publish an article

- A unique title and visible heading, an accurate summary, readable body, real references, and images that add information.
- Main text, title, canonical, and publication data in server-rendered HTML. Essential text is not behind a tab click, account, or client fetch.
- Byline linked to an author page. Disclose automation or AI use and the review process where readers would expect it. Google frames this as Who, How, and Why. [doc]
- `Article` or `BlogPosting` JSON-LD from the same data as the visible byline and dates.
- Dates: visible date plus `datePublished` and `dateModified` in ISO 8601 with a time zone. Change `dateModified` and sitemap `lastmod` only after a substantive change. Timestamp-only edits earn nothing. [doc, practice]
- Sensitive topics (health, money, safety) get named expert review. Google's rater guidelines treat unreviewed AI content on these as lowest quality. [practice]
- Google Discover wants a large image (1200 px wide or more, `max-image-preview:large`), no clickbait, and topic-level expertise. The February 2026 Discover update favored local publishers. [doc, medium confidence]

## News is a separate branch

Add news infrastructure only for timely original reporting. A news sitemap lists articles from the last 2 days, at most 1,000, with a publication name that matches Google News. Publisher Center is optional, and structured data is not needed for Top stories. [doc] Never add a news sitemap to a marketing blog.

## Syndication

Google does not recommend a cross-domain canonical for syndication. The effective fix is that the partner sets `noindex` on the copy. Self-canonical your own version. [doc]

## Translating editorial content

Use the tree in localized content (`next-intl-i18n`). Emit alternates only among items whose `status` is `published`. Research each market's keywords, and never translate the source keyword. Scaled unreviewed translation is a spam risk. [doc]

## Content model and Next.js

Use the field names from localized content (`next-intl-i18n`) so both skills describe one model, and add the editorial fields below.

| Field | Purpose |
| --- | --- |
| `groupId`, `locale`, per-locale `slug` | Group translations and build alternates |
| `status`: `draft`, `reviewed`, `published` | Only `published` is routable, listed, and in the sitemap |
| `translationOf` (source `groupId` and revision) | A translation is stale when the source revision moves past it. Compute it. Do not store a `stale` status. |
| `title`, `description`, `datePublished`, `dateModified` | One source for page, markup, and sitemap |
| `authorIds`, `topics` | Byline, archives, related links |
| `canonicalUrl`, `noindex` | Syndication and preview control |

- Resolve `[slug]` per locale from the content map. Call `notFound()` for a slug with no published item in that locale, at the top of the page component and at the top of `generateMetadata`, before any Suspense boundary or `loading.tsx`. The 404 status holds only if nothing has started streaming.
- `sitemap.ts` reads content, emits `lastModified` from `dateModified` (never `new Date()`), and `alternates.languages` only for existing translations. Google ignores `priority` and `changefreq`.
- One RSS or Atom feed per locale from a Route Handler, advertised with `alternates.types` in metadata. Feeds are optional for Google.
- `opengraph-image.tsx` with `next/og`: flexbox only, a 500 KB cap including fonts, and a font that covers the locale's script, or text renders as boxes.
- Draft Mode: validate a secret before `draft.enable()`, redirect to a slug from the CMS, and set `noindex` when draft mode is on.
- `generateMetadata` may stream after the initial HTML for some bots. Keep title and canonical in the initial response.

## Refresh procedure

1. Detect: organic traffic down for 3 months or more on a page that once mattered, outside seasonality and core update windows.
2. Triage with the gate above: refresh, consolidate, or prune. After a core update wait at least a week. Google calls deleting content a last resort. [doc]
3. Re-read the current results. Update facts, examples, and sources, and add new evidence.
4. Change title and description only if the search task changed. Keep the URL.
5. Bump `dateModified` and `lastmod` only for substantive change, and say what changed.
6. Refresh each locale's equivalent, or leave it stale (its `translationOf` revision is now behind the source). Do not update dates on untranslated copies.
7. Review clicks, impressions, and conversions at 4 and 12 weeks.

## Done when

Inspect one article, one archive page, one older paginated page, one author page, and each affected locale equivalent. Confirm rendered content, byline, dates, canonical, alternates, sitemap `lastmod`, JSON-LD against visible text, an inbound internal link, and no `noindex` left from preview. Report code-verified separately from live-indexed.

Sources, checked 2026-09-30: [helpful, reliable content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [Article](https://developers.google.com/search/docs/appearance/structured-data/article), [publication dates](https://developers.google.com/search/docs/appearance/publication-dates), [Discover](https://developers.google.com/search/docs/appearance/google-discover), [news sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap), [canonicalization troubleshooting](https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting), [core updates](https://developers.google.com/search/docs/appearance/core-updates), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies), [Next.js draft mode](https://nextjs.org/docs/app/guides/draft-mode), [Ahrefs content refresh](https://ahrefs.com/blog/content-refresh/).
