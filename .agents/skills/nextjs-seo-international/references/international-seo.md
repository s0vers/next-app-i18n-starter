# International SEO

Use when a task adds, changes, or audits locale routes, `hreflang`, language or country targeting, translated metadata, a locale switcher, or a market launch. A language switcher is a product feature. International SEO also needs the right audience, URL, content, and search intent per market.

Evidence tags: see evidence and reporting (`nextjs-seo-technical`).

## Gate: market or translation demo

Record these for every locale before touching code. Unknown answers mean the locale is a translated demo, not a market launch. Say so, and do not invent demand or keywords.

| Question | Answer needed |
| --- | --- |
| Audience | Language only, or a country too? |
| Evidence | Local query research or product data showing readers exist |
| Owner | Who translates and who reviews copy, metadata, navigation, and checkout text? |
| Localization | Currency, units, legal text, terminology, and examples that change |
| Pages | Which URLs will really exist in this locale? |

Launch markets by profit potential, not by language count. [practice]

## Choose the tag

```text
Do pages differ by country in currency, price, availability, shipping, legal text, phone, or vocabulary?
├── No → language-only tag: en, es, ar, ja, zh-Hans
└── Yes → one URL per country variant (es-MX, es-ES) AND a language-only catch-all (es)
```

Google accepts only an ISO 639-1 language, an optional ISO 15924 script, an optional ISO 3166-1 alpha-2 region, and `x-default`. `es-419`, `en-UK`, `EU`, and region-only values are invalid. [doc]

Why language-only by default: a region tag claims a country audience the content may not serve, and `hreflang` swaps the right sibling URL into a result without promoting a page in more countries. [practice] W3C advises the shortest tag that distinguishes anything. [doc]

This template's tags (`localeConfig[locale].languageTag`) are `en-US`, `ar-SA`, `zh-Hans-CN`, `es-ES`, `ja-JP`. Each claims a country. Changing them changes every alternate and `<html lang>`, so treat it as one owner decision, and update the sitemap and metadata together.

Chinese: script matters more than country. `zh-Hans` and `zh-Hant` are both supported. Never auto-convert Simplified to Traditional, because vocabulary differs and characters map one to many. [practice]

## URL structure

| Structure | Signal | Cost |
| --- | --- | --- |
| Subdirectory (`/ja`) | Consolidates authority, one server, low upkeep | Weakest country signal. This template. |
| Subdomain | Easy, can split servers | Weaker recognition, separate authority |
| ccTLD | Strongest country signal | Costly, one country each. `.tv`, `.me`, `.co` count as generic. |
| Parameter (`?lang=ja`) | None | Do not use |

Do not migrate language folders to region folders for SEO. It gains nothing. [practice] Choose a ccTLD only for a legal, hosting, or mainland China requirement. [doc]

## Build the alternate set

1. Every version has a stable, directly reachable URL. Cookies, `Accept-Language`, and IP must not change the language of a URL. [doc]
2. The main content is in the locale's language. Translating only the template is a duplicate. [doc]
3. Each equivalent has a self-referencing canonical. Never canonicalize translations to English. [doc]
4. `hreflang` links are reciprocal, self-referencing, absolute, and listed once. Build the set per page from the locales that have a reviewed translation. [doc]
5. Generate every copy of the set from one function. Google says one method (HTML `<link>`, HTTP header, or sitemap) is enough and more bring no benefit. [doc] The failure is disagreement, not duplication. HTML and the sitemap from `getAlternateLanguages` is fine. The proxy `Link` header is a third source with different tags, so keep it off. Yandex needs HTML link elements. [doc]
6. `x-default` marks a language selector or deliberate fallback. One per set. When a page has no English version, point it at the selector page if one exists, and otherwise omit it. [doc]
7. Alternates are not indexed in the proper sense, so "Not indexed" on an alternate in Search Console is not automatically a bug. A translated page with its own canonical should still index. [practice, Gary Illyes 2026-08-10]

## Partial translation and the switcher

```text
Does a reviewed translation of THIS page exist in locale L?
├── Yes → include L in this page's alternates, sitemap entry, and switcher
└── No
    ├── May it arrive soon? → 404 now. Use a `noindex` placeholder only when users must reach the URL before the translation is ready (a link in a campaign or email). Keep a placeholder out of the sitemap and alternates.
    └── Never → omit L for this page
```

Never create a locale URL that renders the default language. It is a duplicate that competes with the original.

A locale's index or hub page (`/ja/blog`) is indexable when it lists real translated items and has its own intro. With none, `noindex` it and keep it out of the sitemap.

The switcher uses real `<a href>` links, since search engines follow only anchors with an `href`. Link to the equivalent page when it exists and to the locale's home or hub otherwise. Label each language in its own language. [doc]

For a partially translated page in this template, pass the locales that have a translation:

```ts
createLocalizedMetadata({
  locale, title, description,
  pathname: "/blog/my-post",
  locales: ["en", "ja"],      // only these get alternates; x-default only if the default locale is here
  hrefFor: (l) => slugs[l],   // optional: per-locale internal pathname when slugs differ
  type: "article", publishedTime, image,
});
```

`getAlternateLanguages(href, { locales, hrefFor })` does the same for the sitemap. `createLocalizedMetadata` throws if `locales` omits the page's own locale, because an alternate set without the page breaks reciprocity. Call `notFound()` for a locale outside the set, before any Suspense boundary, so the missing translation returns 404. Tested 2026-09-30 `[local]`: a temporary page in `en` and `ja` emitted only `en-US`, `ja-JP`, and `x-default`, and `/ar` and `/es` returned 404. Other template facts are in [template notes](template-notes.md).

## Never redirect by guess

No redirect from a URL based on `Accept-Language`, cookie, or IP. Googlebot sends no `Accept-Language` and crawls mostly from US addresses, so a guess-based redirect hides pages from it. [doc] If a suggestion helps users, show a dismissible banner that links to the other version and never blocks content. Keep `localeDetection: false`.

## Translation quality

- Machine translation is allowed when a fluent reviewer checks it and it serves users. Unreviewed bulk machine translation is scaled content abuse under Google's spam policy (page updated 2026-08-28). The tool for a weak translation is page-level `noindex` or not publishing it. Google deleted its advice to block auto-translated pages in robots.txt in June 2025. [doc]
- Localize keywords. Do not translate them. Volume and terms differ per market. [practice]
- Translate the title, description, Open Graph text, structured-data strings, image alt text, and anchor text. Translate image filenames and URL-encode non-Latin ones. [doc]
- Language-swap-only pages risk being merged as near duplicates by search and AI systems. Give each locale distinct value or do not ship it. [practice, Bing 2025-12-19]

## Engines beyond Google

| Engine | `hreflang` | Language signal | Requirement |
| --- | --- | --- | --- |
| Google | HTML, header, or sitemap [doc] | Visible content. `lang` and `hreflang` do not detect language. | ISO codes only. No international report in Search Console since 2022. |
| Bing | Supported, weak [practice] | `Content-Language` and `<html lang>` | This template emits no `Content-Language`. Add it if Bing matters. |
| Yandex | HTML link elements only [doc] | `hreflang` | Region set in Yandex Webmaster, not by tags |
| Baidu | Ignored [unverified] | Simplified Chinese content, mainland hosting | Mainland hosting needs an ICP filing [doc]. Treat mainland China as its own project. |

A Vercel-hosted `/zh` mostly serves Simplified readers outside mainland China on Google and Bing. Tag it `zh-Hans` and do not promise mainland reach. AI answer engines often cite English URLs for non-English queries, and no vendor documents `hreflang` for AI. Localized on-page text is the signal that can help. [practice, one test]

## Locale notes

| Locale | Rule |
| --- | --- |
| `ar` | Modern Standard Arabic is the safe default. Egypt and the Gulf query in dialect and in Latin-script Arabic. Split `ar-SA`, `ar-AE`, `ar-EG` only for different currency, law, or shipping. [practice] |
| `zh` | Treat Taiwan and Hong Kong as separate market decisions. |
| `es` | Use `es`. Add `es-MX` or `es-ES` only for real country differences. Latin America needs its own keyword research and currency per country. |
| `ja` | No region needed. Queries mix kanji, hiragana, katakana, and romaji, and each spelling has its own intent. Research each. [practice] |

## Failure checks

`node .agents/skills/nextjs-seo-technical/scripts/verify-seo.mjs` covers invalid codes, missing self or return links, non-200 alternates, relative URLs, disagreeing sources, non-self canonicals, and redirects by language. For partial translation pass `--urls` with a full, a partial, and an untranslated page. It cannot judge these, so check them by hand:

| Failure | Check |
| --- | --- |
| Mixed-language body | Body language equals `<html lang>` |
| Locale page that is an English fallback | Compare to the default page. Alternates exist only where a translation exists. |
| Uncrawlable switcher | Rendered HTML without JavaScript contains `<a href>` to each locale |
| Untranslated metadata, JSON-LD, alt text | Read `<head>`, JSON-LD, and `alt` in the page language |

## Done when

For each affected locale, the rendered body, `<html lang dir>`, title, description, canonical, alternates, sitemap entry, and switcher behavior agree, and a fluent reviewer checked meaning and market assumptions. Report which are verified in code, which on a live host, and which need Search Console. Hand off to `next-intl-i18n` for routing and messages, and to structured data (`nextjs-seo-structured-data`) for localized JSON-LD.

Sources, checked 2026-09-30: [localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions), [multi-regional sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites), [locale-adaptive pages](https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies), [crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [Yandex locale pages](https://yandex.com/support/webmaster/en/yandex-indexing/locale-pages), [W3C language tags](https://www.w3.org/International/questions/qa-choosing-language-tags), [next-intl alternate links](https://next-intl.dev/docs/routing/configuration#alternate-links).
