# Routing and navigation

Use this reference for locale URLs, route matching, localized pathnames, domain routing, or locale switching.

## Make routing one shared contract

Define the supported locales, default locale, prefixes, pathnames, domains, cookie/detection policy, and alternate-link behavior in one `defineRouting` configuration. Consume it from the proxy handler (typically created with `createMiddleware`) and from `createNavigation`; if runtime locale lists require a different setup, keep both sides' remaining settings aligned. See [routing configuration](https://next-intl.dev/docs/routing/configuration), [middleware](https://next-intl.dev/docs/routing/middleware), and [navigation APIs](https://next-intl.dev/docs/routing/navigation).

Choose the URL shape from product and indexing needs:

- `always`: every locale appears in the URL; this is the routing config default.
- `as-needed`: the default locale is unprefixed and other locales are prefixed. Ensure the matcher sees unprefixed paths and understand that cookies/detection can redirect the unprefixed URL.
- `never`: omit locale prefixes when the locale is determined by a domain or user preference. Consider whether distinct translations still need separately addressable URLs.

These modes change redirect/cookie behavior as well as URL appearance. Verify direct loads, explicit locale switches, and unprefixed requests; don't select a mode solely for visual URL cleanliness. See [routing configuration](https://next-intl.dev/docs/routing/configuration).

## Proxy and locale detection

In current Next.js 16 docs the file is `proxy.ts`; it was named `middleware.ts` through Next.js 15. Use the filename expected by the installed framework. The next-intl proxy handles negotiation, redirects/rewrites, and alternate links. Its matcher must cover all intended app routes while excluding framework assets and API paths only where appropriate. See [proxy/middleware](https://next-intl.dev/docs/routing/middleware).

With prefix-based detection, the documented priority is explicit URL prefix, saved locale cookie, `Accept-Language`, then `defaultLocale`. An explicit locale URL takes precedence and can update the saved preference. If the product disables automatic detection or cookies, preserve that intent instead of enabling the defaults. Verify the final behavior for each route type. See [locale detection](https://next-intl.dev/docs/routing/middleware).

Compose other proxy logic with next-intl's response deliberately: retain the intended rewrite/redirect and response headers/cookies rather than accidentally replacing them. For static export or deployments without proxy/middleware support, use the documented no-proxy setup and accept its routing constraints: [proxy/middleware](https://next-intl.dev/docs/routing/middleware).

## Localized paths and domains

Use `pathnames` to map stable internal routes to external localized URLs. Define each route once internally; map locale-specific slugs in routing config and use typed internal route values through the next-intl `Link`, `useRouter`, and `getPathname` wrappers. This keeps application route code stable while links and rewrites expose localized paths. Dynamic and catch-all segments are supported; URL-encode non-ASCII paths as needed. See [routing configuration](https://next-intl.dev/docs/routing/configuration) and [navigation APIs](https://next-intl.dev/docs/routing/navigation).

Use `domains` only when locale-market/domain mapping is an actual deployment requirement. Domain routing requires each locale to resolve unambiguously across domains; regional locale identifiers commonly express those variants. Test local development hosts and no-domain-match behavior as well as production hosts. See [domain routing](https://next-intl.dev/docs/routing/configuration).

## Localized navigation

Export one central wrapper module from `createNavigation(routing)`. Use its `Link`, `redirect`, `usePathname`, `useRouter`, and `getPathname` throughout app navigation so locale prefixes and localized pathnames stay coherent. For locale switching, pass the target locale to the wrapper and preserve the current logical route when that route exists in the target locale. Handle missing target-locale pages according to the site's explicit fallback UX. See [navigation APIs](https://next-intl.dev/docs/routing/navigation).

When `pathnames` is enabled, pass internal route templates and explicit params in the shape expected by the generated types. Test dynamic routes, query strings, hash fragments, back/forward navigation, and switcher behavior across locales. Use normal Next.js APIs only for framework operations that next-intl does not wrap, such as reading a segment when the official docs demonstrate that boundary.

## SEO handoff

`createMiddleware` may emit alternate links and route config can change public URLs. Audit the actual rendered canonical/alternate URLs and localized route coverage when these settings change. Keep page-specific international SEO policy, translated metadata quality, sitemap completeness, and indexing decisions in the project's separate SEO guidance; do not infer all translations exist just because a locale is configured. See [middleware](https://next-intl.dev/docs/routing/middleware).
