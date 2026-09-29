# Integrations and workflows

Read this for next-intl outside ordinary page rendering: metadata, Open Graph images, manifests, Server Actions, Route Handlers, error pages, tests, and non-App-Router environments.

## Server entry points

These run outside a normal locale render, so they cannot infer the locale. Pass it explicitly and validate it.

| Entry point | Locale source | Pattern |
| --- | --- | --- |
| `generateMetadata` | Awaited route `params` (legacy). No argument needed under root params. | `getTranslations({ locale, namespace: "Metadata" })` |
| `opengraph-image`, `twitter-image` | Awaited `params` | Same call. Bypass the proxy matcher only when customizing prefixes. |
| `manifest.ts` | None | Serve one manifest per locale from a route, or a default-locale manifest. Pass `locale` explicitly. |
| Server Action | A hidden field or the current path | Validate with `hasLocale` first. The user can switch locale while a result is still visible, so return message keys or re-translate on render. |
| Route Handler | Search param or header | Validate with `hasLocale`, then `getTranslations({ locale })`. |
| `sitemap.ts` | Loops `routing.locales` | Build URLs with `getPathname({ locale, href })`. |

Page metadata rule for this template: await `params`, validate with `hasLocale`, translate, then call `createLocalizedMetadata` with the page's real internal pathname. A child page must not inherit the homepage canonical. The helper emits alternates for every configured locale, which is correct only for fully translated pages. For partial coverage see [localized content](localized-content.md).

## Error pages

- `[locale]/not-found.tsx` fires only on `notFound()` inside that subtree. Unknown segments need `[locale]/[...rest]/page.tsx` that calls `notFound()`. This template has it.
- A request outside the proxy matcher (a dotted path, `/api`) never reaches `[locale]`, so localizing it needs Next.js `global-not-found` with an explicit locale.
- An `error.tsx` renders translated text only where a provider exists above it. Keep it inside `[locale]/`. This template once kept it at `src/app/error.tsx`, above the locale layout. Visitors to a broken page then got Next.js's generic English "This page couldn't load", with no title and no locale, and the translated page never rendered. Confirm after any move: add a temporary route that throws, build, and open it in a prefixed locale. Expect the translated error page.

## Translation workflows

The choice table is in [messages and formatting](messages-and-formatting.md#authoring-workflows). Two operational rules:

- Keep agent instructions for translation in the repository's model-agnostic files (`AGENTS.md`, `dictionary/AGENTS.md`) so every assistant follows the same rules.
- After changing message keys, run the message check, `bun run lint`, and `bun run build`, in that order. The check is the fastest failure.

## Testing

Render client-context components under `NextIntlClientProvider` with `locale` and `messages`. Prefer sync shared components when they serve both the server and isolated tests, because async Server Components are hard to unit test.

- Vitest: `test.server.deps.inline: ["next-intl"]`.
- Jest: `transformIgnorePatterns: ["node_modules/(?!next-intl)/"]`.
- Storybook: a global decorator with `NextIntlClientProvider`, and stories in more than the source locale.

This template has no test runner script. Never claim an automated test passed unless one ran.

## Adjacent environments

- Pages Router: supported, and next-intl recommends the App Router for new work. Use the Pages Router provider and load messages in the page's data function. Do not carry App Router request config into it.
- Plain React and React Native: `use-intl` covers translation and formatting, and none of the Next.js routing or awaitable APIs. Confirm the environment before importing `next-intl/server`.
- Runtime support: check that target browsers support the `Intl` APIs the app uses. Add polyfills only for a browser you support.
- Static export: no proxy, every prefix required, no negotiation, no `pathnames`. Decide before choosing export.

Sources, checked 2026-09-30: [Server Actions, metadata, Route Handlers](https://next-intl.dev/docs/environments/actions-metadata-route-handlers), [error files](https://next-intl.dev/docs/environments/error-files), [testing](https://next-intl.dev/docs/environments/testing), [Storybook](https://next-intl.dev/docs/workflows/storybook), [Pages Router](https://next-intl.dev/docs/getting-started/pages-router), [core library](https://next-intl.dev/docs/environments/core-library), [runtime requirements](https://next-intl.dev/docs/environments/runtime-requirements).
