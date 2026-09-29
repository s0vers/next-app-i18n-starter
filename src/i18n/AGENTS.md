# Internationalization instructions

The repository-level `AGENTS.md` applies here too. Translation files have additional rules in `dictionary/AGENTS.md`.

For substantial next-intl implementation or troubleshooting, read `.agents/skills/next-intl-i18n/SKILL.md` and the routing, rendering, or message playbook that matches the change. `setRequestLocale` and `requestLocale` are deprecated since next-intl 4.13.5 and 4.13.6 but still work. This repository standardizes on them, so keep that convention unless the task explicitly includes migrating to `next/root-params`. The next-intl skill has the migration steps.

- `src/i18n/locales.ts` is the source for supported locale keys and their labels, language tags, Open Graph tags, currencies, time zones, and font choices. Add or remove locales there, then update every dictionary and verify route, switcher, formatting, and metadata behavior.
- `src/i18n/routing.ts` sets the default locale and URL policy. The current default is English, `localePrefix` is `"as-needed"`, and `localeDetection` is `false`. English is `/`; other locales use a prefix. Preserve these SEO behaviors unless the task calls for a deliberate change.
- Use the generated helpers in `src/i18n/navigation.ts` for locale-aware links, routers, pathnames, and URL generation. Avoid hardcoded locale URL maps.
- Route keys such as `zh` are distinct from BCP 47 language tags such as `zh-Hans-CN`. Use `localeConfig[locale].languageTag` for HTML `lang` and `hreflang`, and its Open Graph tag for social metadata.
- Currency, timezone, and number/date formats are derived from `localeConfig` and `src/i18n/regional.ts`. Use next-intl formatters instead of manually formatting localized values.
- Request messages are loaded in `src/i18n/request.ts`. Keep fallback behavior explicit. The route layout must reject unsupported locales.
- The current Arabic locale is RTL. When adding or changing an RTL locale, update document direction and component behavior together; test mixed-direction text, numbers, code, and controls.
- If routing, language tags, regional defaults, or locale detection changes, update the relevant README and SEO notes.
