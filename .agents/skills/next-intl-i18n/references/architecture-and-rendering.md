# Architecture and rendering

Read this for request config, static rendering, Cache Components, the server and client split, provider payload, and the document's `lang` and `dir`.

## Choose the locale source

Walk the tree top to bottom and stop at the first match.

```text
Does each language need to be found, indexed, or shared?
├── Yes
│   ├── One hostname per market (us.example.com, de.example.com)?
│   │   └── Yes → `domains` in routing config; every locale belongs to exactly one domain
│   └── No → path prefix (`/ja`); this template's choice
└── No (signed-in app, no SEO)
    └── Cookie or user setting with `localePrefix: "never"`; alternate links turn off
```

Why the first branch wins: Google recommends distinct URLs per language and warns that pages adapted by cookie or `Accept-Language` may not be crawled in every variant.

## Request config

`src/i18n/request.ts` is the request boundary. It resolves the locale, loads messages, and returns `timeZone`, `now`, and `formats`. The plugin in `next.config.ts` connects it.

Root params path (Next >= 16.3, `[locale]` hosts `<html>`):

```ts
import * as rootParams from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const param = await rootParams.locale();
    if (hasLocale(routing.locales, param)) locale = param;
    else notFound();
  }
  return { locale, messages: (await import(`../../dictionary/${locale}.json`)).default };
});
```

The `({ locale })` form is deliberate. Route Handlers and Server Actions pass a locale explicitly, and this form lets it through. The getter name comes from the folder name, so `[locale]` gives `locale`. Kebab-case folder names do not work.

Legacy path (older projects and forks that have not migrated): read `requestLocale`, fall back to `routing.defaultLocale` when `hasLocale` fails. The fallback exists for execution paths outside a locale route. It must never make an invalid public route look valid, so `[locale]/layout.tsx` keeps its own `hasLocale` plus `notFound()`.

## Static rendering

| Mode | Needs | Fails when |
| --- | --- | --- |
| Root params | `generateStaticParams` returning the locales to prerender. No `setRequestLocale`. | Next < 16.3 without `experimental.rootParams`. Root params are unavailable in Client Components, Server Actions, Route Handlers, and `unstable_cache`. |
| Legacy | `setRequestLocale(locale)` in every layout and page, before any next-intl call, plus `generateStaticParams` | One page forgets the call and turns dynamic, because layouts and pages render independently |

Both modes: `generateStaticParams` returns only locales meant for build-time output. Check the build's route table. A locale page marked as dynamic (`ƒ`) when it should be static means the locale source is being read from headers.

### Cache Components

`cacheComponents: true` changes three rules.

1. Root params are the only working path. The legacy path fails with a `headers()` inside `use cache` error.
2. `generateStaticParams` must return at least one value for each root param, or the build fails.
3. `dynamicParams = false` is incompatible. Validate at runtime with `hasLocale` and `notFound()`.

Values returned from `generateMetadata` under `use cache` must be serializable, so pass URL strings and not `URL` objects.

### Migrate to root params

Run this only when the task includes migration. It touches every locale page, so it is a separate change.

1. Confirm `next` >= 16.3 (or set `experimental.rootParams`) and that `[locale]/layout.tsx` renders `<html>`.
2. Confirm `next-intl` >= 4.13.6. Upgrading crosses 4.14.0, which needs a message update for `.po` users.
3. Replace the body of `request.ts` with the snippet above.
4. Delete every `setRequestLocale(locale)` call. In the layout, read the locale with `await getLocale()` from `next-intl/server`.
5. In `generateMetadata`, `getTranslations("Metadata")` works without `params`. Keep the explicit `{ locale, namespace }` form for Route Handlers, manifests, and Server Actions.
6. Update the repository rule that requires `setRequestLocale` (root `AGENTS.md`, `src/app/AGENTS.md`, `src/i18n/AGENTS.md`) in the same change.
7. Run `bun run build`. Every locale page keeps its static marker, and `/xx/` still returns 404.

## Server and client

Default to the server. Use `getTranslations` and `getFormatter` in async components. Use `useTranslations` and `useFormatter` in sync shared components. Hooks cannot run in async components.

When a Client Component needs translated text, take the first option that works.

1. Translate on the server and pass strings or children into the interactive leaf.
2. Move the state to the URL or the server so the text stays server-side.
3. Nest a `NextIntlClientProvider` with only the needed namespaces (`pick(messages, ["Ns"])`).
4. Pass the full catalog only when the client translates broadly and the payload is measured.

This template passes the full catalog from its locale layout. Change that only for a measured payload problem. The provider inherits `locale`, `messages`, `now`, `timeZone`, and `formats`. It does not inherit `onError` or `getMessageFallback`, because functions cannot cross the boundary. Set those in a `"use client"` wrapper. `messages={null}` opts a subtree out.

## Document attributes

`<html lang>` comes from `localeConfig[locale].languageTag`. `dir` must come from data, not from a hardcoded check. This template stores `dir` in `localeConfig` and reads it in the layout, `LanguageSwitcher`, and `HomeIndex`. `check-locales.mjs` fails when a right-to-left language is marked `ltr`.

Route keys (`zh`) are not language tags (`zh-Hans-CN`). Route keys select routes. Tags go in `lang`, `hreflang`, and Open Graph.

## Verify

- `/` and one prefixed locale respond 200, and `/xx/` responds 404.
- View source for `<html lang dir>` per locale.
- The build route table shows the intended static and dynamic markers.
- A Client Component renders under the layout without a "no context" error.

Sources, checked 2026-09-30: [routing setup](https://next-intl.dev/docs/routing/setup), [request configuration](https://next-intl.dev/docs/usage/configuration), [root params blog](https://next-intl.dev/blog/nextjs-root-params), [Next.js root params](https://nextjs.org/docs/app/api-reference/functions/next-root-params), [Server and Client Components](https://next-intl.dev/docs/environments/server-client-components), [next-intl 4.13.5](https://github.com/amannn/next-intl/releases/tag/v4.13.5) and [4.13.6](https://github.com/amannn/next-intl/releases/tag/v4.13.6) release notes.
