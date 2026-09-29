# Framework integrations and translation workflows

Use this reference for next-intl outside ordinary page rendering, translation operations, tooling, or non-App-Router environments.

## Metadata and other server entry points

In `generateMetadata`, Server Actions, Open Graph image generation, manifests, sitemaps, and Route Handlers, use the awaitable APIs from `next-intl/server`. Pass an explicit locale when that execution path cannot infer one from the request/route. In this template, await `params`, validate with `hasLocale`, call `getTranslations({locale, namespace})`, then pass the page's real internal pathname to `createLocalizedMetadata`; it calls `getPathname` to produce the public URL. A child page must not inherit the homepage canonical. For returned action messages, account for the user changing locale while a result remains visible. See [Server Actions, Metadata, and Route Handlers](https://next-intl.dev/docs/environments/actions-metadata-route-handlers).

next-intl supplies translations and locale-aware route helpers; the page's real translation inventory determines its canonical, valid alternate set, and sitemap entries. The current `createLocalizedMetadata` helper emits alternates for every configured locale, which is suitable only when every variant exists; adjust that contract when adding partially translated product or blog pages. Follow the project's [SEO skill](../../nextjs-i18n-seo/SKILL.md) for indexing and content policy.

## Error routes

Decide which errors should be localized. A `[locale]/not-found` handles `notFound()` within that route subtree; it does not automatically catch every unmatched URL. Unknown route segments may need a catch-all that calls `notFound()`, while requests outside the proxy matcher may require a global not-found page and an explicit locale. See [error files](https://next-intl.dev/docs/environments/error-files).

## TypeScript

Optional module augmentation can constrain the app's locale, message, and format types. Derive locale types from routing config and message types from the source catalog; keep imports resolvable in the repository's TypeScript setup. Use type errors as feedback for missing or malformed translation keys, not as a reason to weaken all message typing. See [TypeScript augmentation](https://next-intl.dev/docs/workflows/typescript).

## Translation authoring: catalogs or extraction

Follow the repository's existing authoring workflow. With `useTranslations`, keep source strings in the catalog and use short stable keys; add AI instructions to the repository's model-agnostic instructions so agents follow the same rule. Use `useExtracted` only after verifying the installed next-intl version and accepting its experimental status, compiler integration, catalog mutation, and translation-management implications. The docs describe it as inline messages extracted at build/dev time, with generated IDs and target catalogs synchronized. See [AI agents](https://next-intl.dev/docs/workflows/agents), [`useExtracted`](https://next-intl.dev/docs/usage/extraction), and [plugin options](https://next-intl.dev/docs/usage/plugin).

For larger translation teams, next-intl works with platforms supporting the project's catalog format. The docs recommend Crowdin and describe CLI, Git integration, webhooks, SDK delivery, or manual workflows; choose based on actual team operations rather than adding a platform automatically. See [localization management](https://next-intl.dev/docs/workflows/localization-management).

## Testing and component development

Render components that use client-context APIs under `NextIntlClientProvider` with representative locale/messages. Prefer sync/shared components when they can serve both server rendering and isolated tests. Choose verification from the changed behavior rather than asserting every locale on every task:

| Change | Observable check |
| --- | --- |
| Routing/proxy | Direct load and refresh of `/` and a prefixed route, superfluous `/en` redirect, unsupported prefix, locale switch in both directions |
| Dynamic localized content | Internal route resolves public slug for each available translation; switcher and alternates identify the same content item; missing translation follows policy |
| Messages/formatting | Key/ICU parity and a rendered plural, date, or currency in a target locale with different rules |
| RTL | `lang`, `dir`, mixed-direction identifiers, icon/layout direction, and keyboard interaction on an Arabic route |
| Static/metadata | Build output for intended locale paths and page-specific translated metadata using the actual route |

For Vitest/Jest ESM constraints, follow the [testing guide](https://next-intl.dev/docs/environments/testing) and verify the installed test runner version. This template has no test runner script, so do not claim an automated test passed unless one was actually run.

For Storybook, provide a global decorator with `NextIntlClientProvider` and test important components across more than the source locale. Async Server Component support depends on current Storybook support/config. See [Storybook integration](https://next-intl.dev/docs/workflows/storybook).

## Legacy and adjacent environments

- **Pages Router:** It remains supported, though next-intl recommends App Router for new work. Use the Pages Router provider and supply locale messages through the page's data-loading method; don't transplant App Router request config or server APIs into it. See [Pages Router setup](https://next-intl.dev/docs/getting-started/pages-router).
- **Plain React / React Native:** The `use-intl` core covers translation and formatting but not Next.js routing, App Router integration, or Next-specific awaitable APIs. Confirm the environment before importing those APIs. See [core library](https://next-intl.dev/docs/environments/core-library).
- **Runtime support:** Check target browser support for the `Intl` APIs the app actually uses and add polyfills only for unsupported target environments. See [runtime requirements](https://next-intl.dev/docs/environments/runtime-requirements).
