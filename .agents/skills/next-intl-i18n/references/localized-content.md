# Localized content and adding a locale

Read this for blog posts, products, or any CMS or database content shown in more than one language, for partial translation, and for adding or removing a locale.

A configured locale does not prove a translated page exists. UI strings live in dictionaries. Content lives in data, and each item has its own translation state.

## Content model

Give every localized item these fields. Without them the switcher and the alternates cannot be built.

| Field | Purpose |
| --- | --- |
| `groupId` | Identifies the same logical item across languages. Alternates, the switcher, and the sitemap group on it. |
| `locale` | Route key (`ja`), not language tag. |
| `slug` | Per-locale, unique within the locale. Non-ASCII slugs are legal, and next-intl encodes them. |
| `status` | `draft`, `reviewed`, or `published`. Only `published` is routable, listed, and in the sitemap. |
| `updatedAt` | Real content change date. It feeds `lastModified` and `dateModified`. |
| `translationOf` | Optional. The source item and the source revision, so a stale translation is detectable. |

One function answers every locale question: `getAvailableLocales(groupId)` returns the locales with a published item. The switcher, `generateMetadata` alternates, and the sitemap all call it. Three separate implementations disagree within a month.

## Static params for content routes

`generateStaticParams` returns `(locale, slug)` pairs from published content only. Do not cross-multiply `routing.locales` with every slug. That prerenders pages that do not exist, and each one becomes a soft 404 or a duplicate.

## Missing translation policy

Choose one policy per content type and write it in the repository docs. Do not decide per page.

| Policy | Behavior | Use when |
| --- | --- | --- |
| Omit (default) | No route, no switcher link, no alternate, no sitemap entry. Direct request returns 404. | The translation may never exist. Simplest and cleanest for search. |
| Localized hub | The switcher links to that locale's section index or home. | The reader should stay in their language. |
| Fallback content | The localized URL shows the default language with a notice. | Only when the page is `noindex` and excluded from the sitemap and alternates. Otherwise it is duplicate content at a second URL. |

Never point a switcher at a 404, and never emit `hreflang` to a page that does not exist. A visible translated title around an untranslated body is not a translation.

## Translate, transcreate, or skip

```text
Is the item useful to this locale's readers as written?
├── No (local law, local products, English-only references) → skip; omit policy applies
└── Yes
    ├── Does the copy depend on idiom, humor, or market examples? → transcreate with a fluent editor
    └── Neutral instructions or reference → translate, then review
Draft machine output is `draft` status until a fluent reviewer signs off.
```

Publishing bulk unreviewed machine translation is a search-quality risk as well as a quality one. See [international SEO](../../nextjs-i18n-seo/references/international-seo.md).

## Keep caches honest

When a translation is published or unpublished, revalidate that locale's route, the group's other locale routes (their alternates change), the section index, and the sitemap. Choose the localized or the internal path for `revalidatePath` by the route's rendering mode. See [routing](routing-and-navigation.md#localized-pathnames-and-cms-slugs).

## Add a locale to this template

Do these in one change. Skipping one leaves a locale that half works.

1. `src/i18n/locales.ts`: add the entry with `label`, `languageTag`, `ogLocale`, `currency`, `timeZone`, `font`. Set `dir` to `"rtl"` for a right-to-left language and `"ltr"` otherwise. The layout, `LanguageSwitcher`, and `HomeIndex` read it, so nothing else needs a language check. Run `bun run i18n:check` afterward. It validates the route key, tag, Open Graph tag, currency, time zone, direction, and dictionary file.
2. `dictionary/<locale>.json`: copy `en.json`, translate every value, keep every ICU argument and tag. Run the message check.
3. Plural branches: add the locale's categories to every `plural` message. See [RTL and scripts](rtl-and-scripts.md#plural-categories).
4. Fonts: decide system or web font. Measure the payload if web.
5. `routing.ts` needs no change because it reads `locales`. The sitemap and the switcher iterate `routing.locales`, so they pick the locale up.
6. Metadata and the SEO guide copy: translate the `Metadata` and `SeoGuide` namespaces, since search results show them.
7. Tag choice: decide whether the locale targets a language or a country. Follow [international SEO](../../nextjs-i18n-seo/references/international-seo.md#choose-the-tag). Propose a tag, default to language-only (`de`), and flag it as an owner decision in the report. Never present a region tag as settled.
8. Documentation: update the README locale tables and file tree, `public/llms.txt`, the dictionary list in `dictionary/AGENTS.md`, and the language names inside `Metadata.description` and `SeoGuide` in every dictionary.
9. Verify per [Verification](verification.md): direct load, switcher both ways, `lang` and `dir`, formatting, sitemap entry, alternates.

Removing a locale: redirect its URLs with a 301 to the closest equivalent in the default locale, remove it from `locales`, then remove the dictionary and every alternate and sitemap entry. A removed locale that still answers 200 keeps competing in search.
