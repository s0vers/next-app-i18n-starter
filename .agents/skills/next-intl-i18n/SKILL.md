---
name: next-intl-i18n
description: Implement, migrate, or debug next-intl in a Next.js App Router project. Use when a change touches a locale URL, proxy, request config, message file, ICU message, formatted number, date, or list, RTL or CJK layout, localized CMS content, a locale switcher, or a translated error page. Not for canonicals, hreflang, sitemaps, or indexing; use nextjs-i18n-seo for those, and load both when a route or locale is added.
---

# next-intl in a Next.js App Router project

Five things must agree for every locale: the URL, the rendered language (`lang` and `dir`), the messages, the navigation, and the formatting. Every i18n bug is one of the five disagreeing with another. Find which pair disagrees before editing.

Both libraries move fast, and each reference dates its sources. Read the installed version in `package.json` before applying an example.

## Recon

Always read `package.json` (`next` and `next-intl` versions) and the nearest `AGENTS.md`. Then read by task, and stop when the task is unambiguous.

| Task | Also read |
| --- | --- |
| A message or a formatted value | `dictionary/en.json` and one other locale for the namespace, `src/i18n/request.ts`, `src/i18n/regional.ts`, `global.d.ts` |
| A redirect, prefix, cookie, or switcher problem | `src/i18n/routing.ts`, `src/proxy.ts`, `next.config.ts`, and host redirect rules (`vercel.json`, CDN) |
| Rendering, static output, or a new page | `request.ts`, `[locale]/layout.tsx`, the affected page |
| A new locale | `src/i18n/locales.ts`, every file in `dictionary/`, the layout, `LanguageSwitcher.tsx`, `HomeIndex.tsx` |

Then answer in one line each: which API path (below), which locale source, which rendering mode (static, dynamic, cached). A message-only task can answer the last two with "unchanged".

If the config already does what the user asks, the fault is the deployment or a stale cache, not the source. Check the deployed response before editing.

| API path | Signals | Locale reaches server code through |
| --- | --- | --- |
| Root params | Next >= 16.3 and `[locale]` hosts `<html>` | `next/root-params`, automatic inside `getTranslations` |
| Legacy | `requestLocale` in `request.ts`, `setRequestLocale` in pages | Explicit `setRequestLocale(locale)` before any next-intl call |

`requestLocale` and `setRequestLocale` are deprecated since next-intl 4.13.6 and 4.13.5. They still work. On an installed version older than 4.13.5 the deprecation does not apply yet, and the legacy path is simply current. This template still uses the legacy path, and the root `AGENTS.md` requires `setRequestLocale`, so keep it in ordinary edits. Migrate only when the task says so, and follow the migration steps in [architecture](references/architecture-and-rendering.md#migrate-to-root-params).

## Read next

| Task | Reference |
| --- | --- |
| Request config, static rendering, Cache Components, server versus client, provider payload, `lang` and `dir` | [Architecture and rendering](references/architecture-and-rendering.md) |
| Prefix mode, proxy, cookies, `pathnames`, domains, `Link`, locale switcher | [Routing and navigation](references/routing-and-navigation.md) |
| Catalogs, ICU, plural categories, rich text, formatters, typing, extraction, translation review | [Messages and formatting](references/messages-and-formatting.md) |
| Arabic, Chinese, Japanese, Spanish, or German layout, numerals, plurals, fonts, line breaking | [RTL and scripts](references/rtl-and-scripts.md) |
| Blog, product, or CMS content with per-locale slugs, partial translation, adding a locale | [Localized content](references/localized-content.md) |
| Metadata, Open Graph, manifests, Server Actions, error pages, tests, Pages Router | [Integrations and workflows](references/integrations-and-workflows.md) |
| Proving the change works, or diagnosing a symptom | [Verification](references/verification.md) |

Load a second reference only when the change crosses into it. A new locale needs routing, messages, RTL and scripts, and localized content, and also the [SEO skill](../nextjs-i18n-seo/SKILL.md) for tags and alternates. A new translated string needs only messages. A string with a count also needs the plural table in [RTL and scripts](references/rtl-and-scripts.md#plural-categories).

## Hard rules

Each rule carries its reason. A rule applied without its reason gets applied where it does not belong.

1. Every locale has its own URL. Crawlers and shared links carry no cookies, so a cookie-selected language cannot be found or shared.
2. One `defineRouting` object feeds both the proxy and `createNavigation`. Two configs drift, and the drift shows up as links the proxy redirects.
3. Validate the route locale with `hasLocale` and call `notFound()` for anything else. The request-config fallback to English would otherwise render a valid page under `/xx`.
4. Build locale URLs with `@/i18n/navigation` and `getPathname`, never by string concatenation. Prefix rules and localized pathnames change, and hand-built URLs do not follow.
5. Give translators the whole sentence. Use ICU `plural`, `select`, and `t.rich`. Never join fragments, branch on `count === 1`, or `join(", ")` a list. Word order and plural categories differ per language.
6. A key change lands in every `dictionary/*.json` in the same edit. Types come from `en.json` only, so a missing key in `ar.json` compiles and fails at runtime.
7. Language is not market. Currency, time zone, tax, and availability come from explicit config or data, not from the locale key.
8. Use logical CSS (`ms-*`, `pe-*`, `text-start`, `border-s`). Physical `ml-*` and `text-left` break in RTL. Exempt: directional icons, which use `rtl:-scale-x-100`.
9. Translate on the server. The catalog and the formatter stay off the client bundle, and the ICU parser stays out of it too.
10. Dictionary parity is not localization, and draft copy is not reviewed copy. A locale is done when its rendered page has the right text, `lang`, `dir`, and formatting, and a fluent reviewer signed off. Until then label the copy as draft in the report.

## Done when

1. `bun run i18n:check` exits 0 after any message or locale edit. It validates the locale registry (`check-locales.mjs`) and message parity (`check-messages.mjs`).
2. `bun run lint` passes after TypeScript or TSX edits. `bun run build` passes after substantive changes, with `NEXT_PUBLIC_SITE_URL` set to the safe example from `.env.example`.
3. The rendered check for the change type in [Verification](references/verification.md) ran against English and at least one prefixed locale. Arabic counts whenever layout or formatting changed. If no server may run, or nothing renders the change yet, run the static checks (message check, lint, build route table) and list every rendered check under Not verified.
4. The report lists what was verified and what was not, using the shape in [Verification](references/verification.md#report-shape). "Not verified" is a valid entry. A guess presented as a result is not.

When nobody can answer a question (an unattended run), take the conservative default and record the assumption in the report: keep the existing routing contract, propose a language-only tag, label copy as draft, and skip any migration the task did not name.

## Documentation boundary

The [official next-intl docs](https://next-intl.dev/docs/getting-started) own API signatures. The installed package and repository conventions settle version differences. `next-intl.dev` publishes no `llms.txt`, so read the pages.
