# Site types and search features

Use when the site is not a plain store or blog: SaaS, documentation, marketplace, local business, jobs, recipes, events, video, podcasts, apps, courses, forums, portfolio, real estate, travel, or nonprofit. For stores use commerce (`nextjs-seo-commerce`). For articles and news use [editorial](editorial-and-publishing.md). Types and eligibility change, so open the [search gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) before promising a feature.

Evidence tags: see evidence and reporting (`nextjs-seo-technical`).

## Pick the row

Find the closest row. If none fits, name the reader's task, use [content and on-page](content-and-onpage.md), and do not improvise eligibility rules.

| Site | Page jobs | Schema | Top pitfalls | Extra structure |
| --- | --- | --- | --- | --- |
| SaaS or B2B [unverified] | Category, feature, use case, integration, pricing, comparison, case study, docs, changelog | Organization, `SoftwareApplication` only with real rating and price | Template "vs" pages without testing. Ranking yourself first in "best tools". Logo-swap integration pages. | Content types for feature, integration, and comparison with evidence and a last-verified date |
| Docs and knowledge base [unverified] | Task guides, reference, troubleshooting, migration | Breadcrumb. Article or `TechArticle` optional. | Every version indexed with no pointer to the current one. Client-only rendering. Titles like "Introduction". | Version docs and canonical to the latest |
| Changelog [unverified] | One permalink per release, linked to docs | Article, low value | One endless page. No dates. | Optional |
| Marketplace or classifieds | Category, listing, seller, search | `Product` by whether purchase happens on the page, `ProfilePage` for sellers | Facet and search URL explosion. Expired listings left indexed. User content without `rel="ugc"`. | Listing lifecycle: 410 on removal, facet rules |
| Local or multi-location | One page per real location with address, hours, services, third-party reviews | `LocalBusiness` subtype, Breadcrumb | City doorway pages. Self-serving review stars. Inconsistent name, address, phone. | Location model with a real-presence flag |
| Job board | Job detail, category and city lists, employer pages | `JobPosting` on detail pages only | Expired jobs. Login walls before apply. Scraping without employer permission. | Lifecycle and the Indexing API. Remove expired jobs with `validThrough` or 404 or 410. |
| Recipes | Recipe detail, collection | `Recipe`, `ItemList` carousel | Images outside 16:9, 4:3, 1:1 or under 50,000 pixels. Markup that differs from the visible recipe. | None |
| Events | Event detail, city and date lists | `Event` | Marking up promotions or hours. No time zone offset. Past events still "upcoming". | Status lifecycle |
| Video | Watch page with transcript | `VideoObject`, video sitemap | Video secondary to text. Unstable thumbnail. Blocked embed. | None |
| Podcasts [thin] | Show page, episode page with transcript | None Google-supported | Audio with no text. Relying on Google Podcasts, closed in 2024. | None |
| Apps [thin] | Landing page per app, store listing | `SoftwareApplication` family with price and a rating | Schema without a real rating. Store-only strategy. | None |
| Courses | Course detail, provider list | Course list carousel, English, at least 3 courses | Relying on the removed Course info. | None |
| Portfolio or personal brand | About, case studies, writing | `Person`, `ProfilePage`, Article | Image-only portfolios with no text. Claims without evidence. | None |
| Nonprofit [thin] | Mission, programs, impact, stories, donate | Organization, Event, Article | No impact evidence. Donation forms as the only content. | None |
| Real estate [thin] | Listing detail, area guide, agent profile | No rich result. `LocalBusiness` or `Person` for agents. | Sold listings indexed. Duplicate MLS feeds. Thin area pages. | Listing lifecycle |
| Travel [thin] | Destination guide, itinerary, hotel or rental | Article, Event. Vacation rental is partner only. | Same text across destinations. Thin affiliate content. Unlabeled sponsored links. | None |
| Forums and user content | Thread, topic, profile | `DiscussionForumPosting`, `QAPage`, `ProfilePage` | Spam with no `rel="ugc"`. Parameter duplicates. Blog comments treated as a forum. | Moderation and `rel="ugc"` |

Mark paid links `rel="sponsored"` and user-submitted links `rel="ugc"`. [doc]

## Local businesses

- Local pages and Business Profile are separate jobs. Confirm the business is eligible and that the owner controls the profile.
- Keep name, address or service area, phone, hours, categories, and services accurate and identical everywhere. Never invent locations, reviews, staff, or presence.
- Give each location page real content: services, hours, directions, contact. A page that differs only by city name is a doorway page. [doc]
- Local pack visibility depends on relevance, distance, and prominence. Page copy cannot control the searcher's distance. Use Google Business Profile documentation for eligibility and reporting.

## Images and video

- Important images have stable, crawlable URLs on relevant pages, descriptive filenames, and alt text that explains purpose in context. Test the landing page and the fetched asset separately.
- A video needs an indexable watch page with the video in rendered HTML, a stable accessible thumbnail, and visible metadata that matches. The video must be the main reason to visit for a video result.
- Add media sitemaps or markup only when they help discovery or meet a feature's requirements. Validate the rendered page and the fetched asset.
- Translate alt text and filenames per locale. URL-encode non-Latin filenames.

## Specialized platforms

For app stores, travel booking, healthcare, finance, and other regulated verticals, read the platform's own current documentation. Do not carry Google web rules into a store's search.

## Does this template need more structure

The starter has a homepage only. A fork that adds one of these types needs a content model and a lifecycle for the type, and the extra-structure column says which. Add the model before adding routes.

Sources, checked 2026-09-30: [search gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery), [job posting](https://developers.google.com/search/docs/appearance/structured-data/job-posting), [recipe](https://developers.google.com/search/docs/appearance/structured-data/recipe), [event](https://developers.google.com/search/docs/appearance/structured-data/event), [video](https://developers.google.com/search/docs/appearance/video), [local business](https://developers.google.com/search/docs/appearance/structured-data/local-business), [discussion forum](https://developers.google.com/search/docs/appearance/structured-data/discussion-forum), [qualify outbound links](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies), [Google Business Profile ranking](https://support.google.com/business/answer/7091).
