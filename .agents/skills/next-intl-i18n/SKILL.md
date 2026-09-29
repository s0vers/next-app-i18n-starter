---
name: next-intl-i18n
description: Implement or debug next-intl localization in Next.js: locale routing, request configuration, translated UI, formatting, and framework integration. Use for concrete i18n work; use the SEO skill for search strategy and indexing policy.
---

# next-intl in this repository

Keep each locale's URL, rendered language, messages, navigation, and regional formatting in agreement. Read the repository and nearest `AGENTS.md` first. Check `package.json` and installed types before applying live documentation examples: this template declares Next.js `^16.3.7`, pins next-intl `4.13.0`, and uses the supported `requestLocale` / `setRequestLocale` path. `src/i18n/AGENTS.md` requires that path until migration is explicitly in scope.

## Route to the relevant reference

| Task | Read |
| --- | --- |
| Request config, Server/Client Components, static rendering, or provider payload | [Architecture and rendering](references/architecture-and-rendering.md) |
| Prefixes, proxy, pathnames, domains, navigation, or locale switching | [Routing and navigation](references/routing-and-navigation.md) |
| Message catalogs, ICU, translations, regional formats, or RTL | [Messages and formatting](references/messages-and-formatting.md) |
| Metadata and other server entry points, errors, typing, tooling, or tests | [Integrations and workflows](references/integrations-and-workflows.md) |
| Pages Router or non-Next consumers | [Legacy and adjacent environments](references/integrations-and-workflows.md#legacy-and-adjacent-environments) |

Read a second reference only when the task crosses that boundary. For canonical URLs, `hreflang`, sitemap, indexing, content strategy, or search measurement, also read the [SEO skill](../nextjs-i18n-seo/SKILL.md).

## Work from the actual locale contract

1. Inspect `src/i18n/locales.ts`, `routing.ts`, `request.ts`, `navigation.ts`, `src/proxy.ts`, the affected route and dictionaries. Identify the route locale, HTML language tag, region, currency, time zone, direction, and content locale separately. Do not infer a market policy from a language code.
2. Define the public URL and content availability for each affected locale. For a CMS item, identify the same logical item across translations before building a locale switcher or alternate URLs. A configured locale does not prove that a translated page exists.
3. Make the smallest complete change in the established architecture. Keep `defineRouting` shared between proxy and navigation, validate route params with `hasLocale`, and use `@/i18n/navigation` for locale-aware navigation. Use awaitable `next-intl/server` APIs in async Server Components and framework entry points.
4. Update all required dictionaries when keys change. Preserve ICU arguments and rich-text slots; do not mark machine or draft copy as reviewed production translation.
5. Verify the behavior affected by the change: direct load and navigation in English and at least one prefixed locale, missing or invalid locale handling, rendered `lang`/`dir`, correct messages and formatting, and any affected static or metadata output. Run repository checks required by `AGENTS.md`; report exact checks and locale paths exercised.

## Documentation boundary

The [official next-intl docs](https://next-intl.dev/docs/getting-started) are the API source. Use the installed package and repository conventions to settle version differences. The [dated research inventory](../../../docs/next-intl-docs-research.md) records why the playbooks make their main recommendations; it is not a substitute for current API signatures.
