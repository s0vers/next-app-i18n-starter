# International SEO

Use when a task adds, changes, or audits locale routes, `hreflang`, language or country targeting, translated metadata, a locale switcher, or a market launch. A language switcher is a product feature. International SEO also needs the right audience, URL, content, and search intent per market.

Evidence tags: `[doc]` platform documentation, `[spec]` standard, `[practice]` practitioner evidence, `[unverified]`. See [evidence and reporting](evidence-and-reporting.md).

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

Why language-only by default: a region tag claims a country audience the content may not serve. `hreflang` swaps the right sibling URL into a result. It does not promote a page in more countries. [practice] W3C advises the shortest tag that distinguishes anything. [spec]

This template's tags come from `localeConfig[locale].languageTag`: `en-US`, `ar-SA`, `zh-Hans-CN`, `es-ES`, `ja-JP`. Each claims a country. Unless the content is written for that country, `en`, `ar`, `zh-Hans`, `es`, `ja` fit better. Changing tags changes every alternate and `<html lang>`, so treat it as a product decision, do it once, and update the sitemap and metadata together.

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
2. The main content is in the locale's language. Translating only the template is a bad experience and a duplicate. [doc]
3. Each equivalent has a self-referencing canonical. Never canonicalize translations to English. [doc]
4. `hreflang` links are reciprocal and self-referencing, use absolute URLs, and appear once. [doc] Build the set per page from the locales that have a reviewed translation.
5. Generate every copy of the set from one function. Google says one method (HTML `<link>`, HTTP header, or sitemap) is enough and more bring no benefit. [doc] The failure is disagreement, not duplication. This template writes the same set to HTML and to the sitemap from `getAlternateLanguages`, which is fine. The proxy `Link` header is a third source with different tags, so turn it off. Yandex needs HTML link elements. [doc]
6. `x-default` marks a language selector or deliberate fallback. One per set. This template points it at English `/`. When a page has no English version, point it at the language selector page if one exists, and otherwise omit it. [doc]
7. Alternates are not indexed in the proper sense, so "Not indexed" on an alternate in Search Console is not automatically a bug. Translated pages with their own canonical should still index. [practice, Gary Illyes 2026-08-10]

## Partial translation and the switcher

```text
Does a reviewed translation of THIS page exist in locale L?
├── Yes → include L in this page's alternates, sitemap entry, and switcher
└── No
    ├── May it arrive soon? → 404 now. Use a `noindex` placeholder only when users must reach the URL before the translation is ready (a link in a campaign or email). Keep a placeholder out of the sitemap and alternates.
    └── Never → omit L for this page
```

Never create a locale URL that renders the default language. It is a duplicate that competes with the original.

A locale's index or hub page (`/ja/blog`) is indexable when it lists real translated items and has its own intro. With no translated items, `noindex` it and keep it out of the sitemap.

The switcher uses real `<a href>` links. Search engines follow only anchors with an `href`. Link to the equivalent page when it exists and to the locale's home or hub otherwise. Label each language in its own language. [doc]

## Never redirect by guess

No redirect from a URL based on `Accept-Language`, cookie, or IP. Googlebot sends no `Accept-Language` and crawls mostly from US addresses, so a guess-based redirect hides pages from it. [doc] If a suggestion helps users, show a dismissible banner that links to the other version and never blocks content. Keep `localeDetection: false`.

## Translation quality

- Machine translation is allowed when a fluent reviewer checks it and it serves users. Unreviewed bulk machine translation is scaled content abuse under Google's spam policy (page updated 2026-08-28). [doc]
- Google deleted its advice to block auto-translated pages in robots.txt in June 2025. The tool for a weak translation is page-level `noindex`, or not publishing it. [doc]
- Localize keywords. Do not translate them. Volume and terms differ per market. [practice]
- Translate the title, description, Open Graph text, structured-data strings, image alt text, and anchor text. Translate image filenames and URL-encode non-Latin ones. [doc]
- One language per page. No side-by-side translations. [doc]
- Language-swap-only pages risk being merged as near duplicates by search and AI systems. Give each locale distinct value or do not ship it. [practice, Bing 2025-12-19]

## Engines beyond Google

| Engine | `hreflang` | Language signal | Tool | Requirement |
| --- | --- | --- | --- | --- |
| Google | HTML, header, or sitemap [doc] | Visible content. `lang` and `hreflang` do not detect language. | Search Console, URL Inspection. No international report since 2022. | ISO codes only |
| Bing | Supported, weak [practice] | `Content-Language` and `<html lang>` | Bing Webmaster Tools | This template emits no `Content-Language`. Add it if Bing matters. |
| Yandex | HTML link elements only [doc] | `hreflang` | Yandex Webmaster | Region set in Webmaster, not by tags |
| Baidu | Ignored [unverified] | Simplified Chinese content, mainland hosting | Baidu Search Resource Platform | Mainland hosting needs an ICP filing [doc]. Treat mainland China as its own project. |
| Naver, Seznam | [unverified] | | | Not target markets here. IndexNow reaches both. |
| Yahoo! Japan | Same as Google [practice] | Google's | Google tools | Results run on Google technology |

A Vercel-hosted `/zh` mostly serves Simplified readers outside mainland China on Google and Bing. Tag it `zh-Hans` and do not promise mainland reach. AI answer engines often cite English URLs for non-English queries, and no vendor documents `hreflang` for AI. Localized on-page text is the signal that can help. [practice, one test]

## Locale notes

| Locale | Rule |
| --- | --- |
| `ar` | Use `dir="rtl"` on `<html>`. Modern Standard Arabic is the safe default. Egypt and the Gulf query in dialect and in Latin-script Arabic. Split `ar-SA`, `ar-AE`, `ar-EG` only for different currency, law, or shipping. [practice] |
| `zh` | See Chinese above. Treat Taiwan and Hong Kong as separate market decisions. |
| `es` | Use `es`. Add `es-MX` or `es-ES` only for real country differences. Latin America needs its own keyword research and currency per country. |
| `ja` | No region needed. Queries mix kanji, hiragana, katakana, and romaji, and each spelling has its own intent. Research each. [practice] |

## This template

- `src/i18n/locales.ts` owns tags and Open Graph tags. `src/lib/site.ts` owns `getLocaleUrl`, `getAlternateLanguages`, and `createLocalizedMetadata`. The helpers emit every configured locale, which fits the fully translated homepage. Before adding a partially translated route, give them a per-page locale set. Sketch:

```ts
// src/lib/site.ts (sketch). The caller passes the locales that have a reviewed
// translation and, for content with per-locale slugs, each locale's own path.
export function getAlternateLanguages(
  hrefFor: (locale: AppLocale) => "/" | `/${string}`,
  locales: readonly AppLocale[] = routing.locales,
) {
  const languages = Object.fromEntries(
    locales.map((l) => [localeConfig[l].languageTag, getLocaleUrl(l, hrefFor(l))]),
  );
  const fallback = locales.includes(routing.defaultLocale)
    ? { "x-default": getLocaleUrl(routing.defaultLocale, hrefFor(routing.defaultLocale)) }
    : {};
  return { ...languages, ...fallback };
}
```

  `createLocalizedMetadata` then needs the same `locales` and `hrefFor` inputs, plus `type` (`article` for posts) and `image` inputs. It hardcodes `type: "website"` and `/og-image.png` today. The sitemap calls the same function per entry.
- `localeConfig` ties one currency to each route locale (`es` is EUR, `en` is USD). That suits one market per locale and cannot show two currencies to one language. See [commerce](commerce-and-products.md#markets-currency-and-languages).
- Known gap, observed locally 2026-09-30 `[local]`: `routing.ts` leaves next-intl's `alternateLinks` on. `curl -I /` returns a `Link` header with `hreflang` `en`, `ar`, `zh`, `es`, `ja`, while the HTML says `en-US`, `ar-SA`, `zh-Hans-CN`, `es-ES`, `ja-JP`. Two vocabularies for one URL set, and the header advertises alternates even for routes that lack them. Set `alternateLinks: false`, then confirm the header has no `hreflang`.
- `localeDetection: false` does not stop `NEXT_LOCALE` from being written. It stops the redirect.

## Failure checks

| Failure | Check |
| --- | --- |
| Missing return link or self reference | Crawl. Every target lists the source and itself. |
| Invalid code | Validate against the ISO lists. |
| Alternate is redirected, `noindex`, blocked, or 404 | Request each alternate. Expect 200, self-canonical, indexable. |
| Translation canonicalized to English | `/es` canonical equals `/es`. |
| Sources disagree | Extract HTML, sitemap, and `Link` header, and diff them. |
| Relative alternate URL | Every value starts with `https://`. |
| Redirect by language or cookie | `curl -sI -H "Accept-Language: ja" /` returns 200 with no `Location`. Repeat with `Cookie: NEXT_LOCALE=ja`. |
| Mixed-language body | Body language equals `<html lang>`. |
| Locale page that is English fallback | Compare to the default page. Alternates exist only where translation exists. |
| Uncrawlable switcher | Rendered HTML without JavaScript contains `<a href>` to each locale. |
| Untranslated metadata, JSON-LD, alt text | Read `<head>`, JSON-LD, and `alt` in the page language. |

`node .agents/skills/nextjs-i18n-seo/scripts/verify-seo.mjs` automates the first eight. For partial translation, pass `--urls` with one fully translated page, one partly translated page, and one untranslated page. The script checks each page's alternates for valid codes, absolute URLs, a self-reference, agreement with the sitemap, and a 200 plus a return link from every alternate it lists. A page that lists a locale it lacks fails on the 200 check.

## Done when

For each affected locale, rendered body, `<html lang dir>`, title, description, canonical, alternates, sitemap entry, and switcher behavior agree, and a fluent reviewer checked meaning and market assumptions. Report which are verified in code, which on a live host, and which need Search Console.

Hand off to `next-intl-i18n` for routing and messages, and to [structured data](structured-data.md) for localized JSON-LD.

Sources, checked 2026-09-30: [localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions), [multi-regional sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites), [locale-adaptive pages](https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies), [crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [Yandex locale pages](https://yandex.com/support/webmaster/en/yandex-indexing/locale-pages), [W3C language tags](https://www.w3.org/International/questions/qa-choosing-language-tags), [next-intl alternate links](https://next-intl.dev/docs/routing/configuration#alternate-links), [IndexNow FAQ](https://www.indexnow.org/faq).
