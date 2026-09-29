# International SEO

Use this playbook for language routes, country targeting, translation quality, `hreflang`, and multilingual launches. Language switching is a product feature; international SEO also requires the correct audience, URL, content, and search intent for each market.

## Plan a locale before adding it

For each proposed locale, record:

- The intended audience and whether the target is a language, a country, or both.
- The URL pattern and the page variants that will actually exist.
- Who will translate and review the main content, metadata, navigation, and transactional text.
- The currency, date, number, units, terminology, and legal or cultural details that need localization.
- Whether local query research shows an audience and search intent the page can serve.

If these are unknown, distinguish a translated demo from a production market launch. Do not invent local search volume, keywords, or demand.

## Implement the URL and alternate set

1. Give each language or region version a stable, directly reachable URL. Google recommends distinct URLs instead of changing page language based on cookies or browser settings.
2. Serve the intended language in the main rendered content. A translated title around an untranslated body does not create a useful localized page.
3. Set a self-referencing canonical on each equivalent locale route. Do not canonicalize all translations to the default language.
4. Build an equivalence set per page, not a site-wide list of locales. Emit reciprocal `hreflang` links among real translated equivalents; each points to matching content with its own canonical. A partially translated blog or product catalog can have a smaller set than the homepage. Exclude missing, redirected, or substantially different pages.
5. Use valid BCP 47 language or language-region tags. Choose a region only when the content and intended audience support it; do not use route slugs as `hreflang` values.
6. Add one sitemap entry per indexable URL and keep its alternate map consistent with page metadata. Use `x-default` for an actual language-neutral selector or deliberate default fallback; inspect where it resolves. It need not exist on every multilingual site.
7. Keep navigation links between language versions visible and usable. A language switcher should preserve the current page only when the equivalent page exists in the destination locale; otherwise send the visitor to a deliberate fallback.

## This template's conventions

- `src/i18n/locales.ts` owns locale labels, language tags, Open Graph tags, regional defaults, and fonts. `src/i18n/routing.ts` owns route policy.
- English is `/`; other locales use a prefix. Automatic locale detection is disabled. Preserve direct URLs unless the user asks to change routing.
- Build canonical and alternate URLs with `getLocaleUrl`, `getAlternateLanguages`, and `createLocalizedMetadata` in `src/lib/site.ts`. The current helpers emit all configured locales, which fits the fully translated homepage. Extend or call them selectively for routes whose locale coverage differs; never publish nonexistent alternates.
- Add translated keys to every `dictionary/*.json` file. English defines the message shape; it does not guarantee translation completeness or quality.
- Use `localeConfig[locale].languageTag` for HTML `lang` and `hreflang`, and its Open Graph tag for social metadata.

## Verify every target

For each locale, compare the rendered page, not only the dictionary:

- Page body, title, description, headings, calls to action, and navigation use the expected language.
- `<html lang>` and `dir` match the page's actual script and reading direction.
- Canonical points to that exact locale URL. Alternates are reciprocal and all resolve to the intended page.
- Locale switcher behavior is correct for both equivalent and unavailable routes.
- Sitemap URLs and alternate annotations match the page output.
- A fluent reviewer checks meaning, terminology, natural phrasing, and regional assumptions before production. For a locale-specific product or article, also verify offer availability, currency, author/date claims, and local examples.

Google uses visible page content to determine language and may not index all variants of locale-adaptive pages. `hreflang` helps describe alternate pages; it does not translate or localize content for you.

## References

- [Google multilingual and multi-regional sites](https://developers.google.com/search/docs/advanced/crawling/managing-multi-regional-sites)
- [Google localized page versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google locale-adaptive pages](https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages)
- [Google sitemap guidance for localized pages](https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap)
- [next-intl routing and locale detection](https://next-intl.dev/docs/routing/middleware)
