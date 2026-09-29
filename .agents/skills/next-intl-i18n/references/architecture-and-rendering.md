# Architecture and rendering

Use this reference for App Router setup, request-scoped configuration, Server and Client Components, or static rendering. Confirm the installed Next.js and next-intl versions before copying an API example.

## Choose the locale source first

Use locale-based routing when each language needs a stable, shareable URL. Use a request preference (such as a cookie) only when a single URL is intentionally rendered in the user's preferred language. A cookie-selected locale is not a substitute for distinct public locale URLs when each translation must be directly addressable. The App Router routing setup and getting-started docs distinguish these approaches: [locale-based routing](https://next-intl.dev/docs/routing/setup), [getting started](https://next-intl.dev/docs/getting-started/app-router).

## Wire App Router configuration

For the App Router, keep `i18n/request.ts` (or the project's configured equivalent) as the request boundary: resolve and validate the locale, load the relevant message bundle, and return request-specific locale, formats, time zone, and error handling. The Next.js plugin connects that file to next-intl. Its default discovery locations and custom path option are documented in the [plugin guide](https://next-intl.dev/docs/usage/plugin) and [request configuration guide](https://next-intl.dev/docs/usage/configuration).

The current docs also mark `requestLocale` in `getRequestConfig` as a legacy locale source after `next/root-params` became available. On a compatible Next.js version, use the route param through `next/root-params` for new locale-based App Router setup and handle missing/invalid values deliberately. If the repository already depends on `requestLocale`/`setRequestLocale`, treat migration as a separate compatibility change unless the task includes it. See [routing setup](https://next-intl.dev/docs/routing/setup) and [request configuration](https://next-intl.dev/docs/usage/configuration).

Keep locale validation explicit. Derive a locale from the route or an approved source, check it against the configured locale set with `hasLocale`, and apply the app's explicit invalid-locale behavior. Do not turn an invalid route into a plausible but incorrect language via an unreviewed silent fallback. The official setup examples use `notFound` for invalid route locale values: [routing setup](https://next-intl.dev/docs/routing/setup).

## Keep translation work on the server by default

In a Server Component, use `useTranslations`/`useFormatter` for synchronous shared components and `getTranslations`/`getFormatter` or the other awaitable server APIs in async components. Hooks cannot be called from async components. Server rendering keeps the message catalog and formatting library off the client when interactivity is unnecessary. See [Server and Client Components](https://next-intl.dev/docs/environments/server-client-components).

When client interactivity needs translated content, choose in this order:

1. Translate on the server and pass labels/children to an interactive leaf component.
2. Move shareable state into URL/search params or server state when this keeps the translation server-side.
3. Provide only the required messages through a nested `NextIntlClientProvider`.
4. Provide the full catalog only when the app's client-side translation needs justify it; measure before optimizing.

This order follows next-intl's documented performance guidance. Provider placement is not a blanket reason to ship every message to every client component. The root provider inherits request configuration by default in the App Router; provider props can also be narrowed. See [Server and Client Components](https://next-intl.dev/docs/environments/server-client-components) and [request configuration](https://next-intl.dev/docs/usage/configuration).

## Choose static rendering for the actual version

Current next-intl docs describe `next/root-params` as the preferred route-locale access path on Next.js 16.3 and later, with `generateStaticParams` for locales that should be prerendered. They also label `requestLocale` in request config and `setRequestLocale` as legacy, still-supported paths. Do not migrate a project just because the docs changed: verify its Next.js version, installed types, and repository constraints; preserve its established API unless the task includes a migration. In this template, the root `AGENTS.md` still requires `setRequestLocale` for locale pages, so follow that local contract for normal edits and surface the newer API as a separate migration opportunity. See [routing setup and static rendering](https://next-intl.dev/docs/routing/setup) and [request configuration](https://next-intl.dev/docs/usage/configuration).

For either path, inspect where static params are generated and which route segment they cover. Only return locales intended to be generated at build time; runtime or selectively rendered locales may need another rendering strategy. Use the locale passed to `generateMetadata` rather than reading request-only data where Next.js provides route params. See [routing setup](https://next-intl.dev/docs/routing/setup).

## Check rendered document attributes

Ensure the root document has the correct `lang` and `dir` for each rendered locale. `dir` should reflect the script/content direction, not be guessed from a language name alone. Keep locale selection, request messages, document language, and RTL styling consistent. The translations guide includes RTL considerations: [translations](https://next-intl.dev/docs/usage/translations).

## Verify

- Request at least one route in the default locale and one prefixed or domain locale.
- Check the rendered `lang`/`dir`, message selection, and no missing-locale fallback.
- For static pages, verify the build's prerender output and test a route excluded from static params if runtime rendering is intended.
- For Client Components, confirm the nearest provider and inspect whether message serialization is limited to what the component needs.
