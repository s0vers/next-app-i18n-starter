# Internationalization instructions

The repository-level `AGENTS.md` applies here too. Translation files have additional rules in `dictionary/AGENTS.md`.

For substantial next-intl implementation or troubleshooting, read `.agents/skills/next-intl-i18n/SKILL.md` and the routing, rendering, or message playbook that matches the change. This repository reads the locale from `next/root-params` (Next.js 16.3+) in `src/i18n/request.ts`. `setRequestLocale` and `requestLocale` are deprecated since next-intl 4.13.5 and 4.13.6, so do not reintroduce them.

- `src/i18n/locales.ts` is the source for supported locale keys and their labels, language tags, Open Graph tags, currencies, time zones, and font choices. Add or remove locales there, then update every dictionary and verify route, switcher, formatting, and metadata behavior.
- `src/i18n/routing.ts` sets the default locale and URL policy. The current default is English, `localePrefix` is `"as-needed"`, `localeDetection` is `false`, `localeCookie` is `false`, and `alternateLinks` is `false`. English is `/`; other locales use a prefix. Page metadata and the sitemap own the `hreflang` set, and the proxy adds no `Link` alternates or locale cookie. Preserve these SEO behaviors unless the task calls for a deliberate change.
- Use the generated helpers in `src/i18n/navigation.ts` for locale-aware links, routers, pathnames, and URL generation. Avoid hardcoded locale URL maps.
- Route keys such as `zh` are distinct from BCP 47 language tags such as `zh-Hans-CN`. Use `localeConfig[locale].languageTag` for HTML `lang` and `hreflang`, and its Open Graph tag for social metadata.
- Currency, timezone, and number/date formats are derived from `localeConfig` and `src/i18n/regional.ts`. Use next-intl formatters instead of manually formatting localized values.
- The locale and its messages are resolved in `src/i18n/request.ts`. The locale comes from the `[locale]` route param, and an unsupported one calls `notFound()`. The route layout also rejects unsupported locales.
- Direction lives in `localeConfig[locale].dir`. The layout, `LanguageSwitcher`, and `HomeIndex` read it, so do not add a language check. The current Arabic locale is RTL. When adding or changing an RTL locale, update document direction and component behavior together; test mixed-direction text, numbers, code, and controls.
- If routing, language tags, regional defaults, or locale detection changes, update the relevant README and SEO notes.
