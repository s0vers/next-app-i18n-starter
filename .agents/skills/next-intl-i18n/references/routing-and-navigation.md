# Routing and navigation

Read this for locale URLs, prefix mode, the proxy, cookies, localized pathnames, domains, `Link`, and locale switching.

## One routing contract

`defineRouting` holds locales, default locale, prefix mode, pathnames, domains, detection, and cookie policy. Import that object in exactly two places: the proxy (`createMiddleware(routing)`) and `createNavigation(routing)`. This template exports it from `src/i18n/routing.ts`: `en` at `/`, the others prefixed, `localeDetection: false`.

## Pick the prefix mode

| Mode | URLs | Consequences |
| --- | --- | --- |
| `always` (library default) | `/en`, `/ja` | Simplest. No redirect logic for the default locale. |
| `as-needed` (this template) | `/`, `/ja` | Clean default URL. `/en/x` redirects to `/x`. The matcher must see unprefixed paths. |
| `never` | `/` for every locale | Locale comes from a domain or a cookie. Alternate links turn off. One URL serves many languages, so it suits signed-in apps only. |
| `{ mode, prefixes }` | `/us`, `/de` | Custom prefixes for region paths. Still verify the alternate set. |

The mode changes redirect and cookie behavior as well as the URL. Never choose one for URL aesthetics alone.

## Detection and cookies

With detection on, the order is: URL prefix, saved cookie, `Accept-Language`, `defaultLocale`. An explicit prefix wins and updates the cookie.

`localeDetection: false` stops the cookie and `Accept-Language` from redirecting `/`. It does not stop the proxy from writing `NEXT_LOCALE`. Since next-intl 4.0 only `localeCookie: false` disables the cookie. Left on, it is a session cookie, and it adds a `Set-Cookie` to every page response, which blocks shared caching. With detection off nothing reads it, so this template sets `localeCookie: false`. Turn it back on with `localeCookie: { maxAge }` only if detection returns and the preference must survive restarts.

A stale `NEXT_LOCALE` cookie does not redirect `/` while detection is off. A visitor who is still redirected meets a host redirect rule, a CDN, or a deployment built before the setting changed. After any change to detection or the cookie, test `/`, `/en`, and each prefix with and without `Cookie: NEXT_LOCALE=ja` and `Accept-Language: ja`. English at `/` must answer 200 in every case.

## Alternate links

The proxy adds an HTTP `Link` header with `hreflang` alternates for every route unless `alternateLinks: false`. It builds them from route keys (`en`, `ar`, `zh`), and page metadata builds a second set in HTML from language tags (`en-US`, `ar-SA`, `zh-Hans-CN`). Two sources with two vocabularies contradict each other, and the header announces alternates for pages that have no translation. Before 2026-09-30 this template shipped exactly that.

Decide once who owns alternates. In this template page metadata and the sitemap own them, so `routing.ts` sets `alternateLinks: false`. Confirm with `curl -I` that no `hreflang` remains in `Link`. Read [international SEO](../../nextjs-i18n-seo/references/international-seo.md) for the tag vocabulary.

## The proxy

Next.js 16 names the file `proxy.ts`. It was `middleware.ts` through Next.js 15. The codemod is `npx @next/codemod@canary middleware-to-proxy .`.

- It runs on the Node.js runtime. Setting `runtime` throws.
- It does not exist in static export. Without it, every prefix is required, there is no negotiation, and `pathnames` are unsupported.
- Matcher values must be constants. A path the matcher skips also skips Server Function calls posted to it.
- The matcher must exclude `api`, `_next`, and files with a dot. A dotted dynamic route such as `/users/jane.doe` needs its own matcher entry: `"/([\\w-]+)?/users/(.+)"`.
- When composing other proxy logic, return next-intl's response object and add headers to it. Building a new response drops the rewrite.

## Localized pathnames and CMS slugs

`pathnames` maps one internal route to one external path per locale. It localizes route patterns such as `/about` to `/ja/about-ja`. It does not localize entity slugs.

For a blog post or product with a per-locale slug, the slug is data, not routing config. Resolve it from content before building any link:

```text
switch link or alternate for item X in locale L
├── X has a published translation in L → its slug in L
└── it does not → follow the missing-translation policy in localized-content.md, never a 404 or an unrelated item
```

`revalidatePath` takes the localized path for statically generated routes and the internal path for runtime-rendered routes. Check the route's rendering mode before choosing.

`domains` maps hostnames to `{ domain, defaultLocale, locales }`. Each locale belongs to one domain, or resolution is ambiguous. Localhost falls back to prefix detection, so test both local and production hosts.

## Navigation API

Export once from `src/i18n/navigation.ts`, import everywhere from there.

| Need | Use | Behavior to know |
| --- | --- | --- |
| Link | `Link` | `locale` prop emits a prefixed URL first, even in `as-needed`, and disables prefetch. next-intl then redirects to the canonical form. |
| Server redirect | `redirect({ href, locale })` | `locale` is required. `forcePrefix` and `permanentRedirect` exist. |
| Current path | `usePathname()` | Returns the path without the prefix. |
| Programmatic navigation | `useRouter().replace(pathname, { locale })` | Locale switching without `pathnames`. |
| URL for another locale | `getPathname({ locale, href })` | Feeds sitemaps and metadata. |
| Not locale-aware | `notFound()`, `redirect` from `next/navigation` | Import from Next.js directly. |

## Locale switcher

```text
Is there a `pathnames` map?
├── No → usePathname() plus router.replace(pathname, { locale })
└── Yes → pass the internal template plus params to router.replace
Is the page CMS-driven?
└── Yes → resolve the target slug from content; render a link only for locales that have the item
```

A switcher that lands on a 404 is a bug. It is also the most common crawlable dead link on a multilingual site. Query string and hash should survive the switch. Check back and forward in both directions.

## Verify

- Direct load and refresh of `/` and a prefixed route.
- `/en` redirects to `/`. `/xx` returns 404.
- Switch en to ja and back. The final URL has no `/en`.
- `curl -I` shows the intended `Link` header and cookie.
- After a matcher change, `/unknown.txt` and `/api/x` bypass the proxy.

Sources, checked 2026-09-30: [routing configuration](https://next-intl.dev/docs/routing/configuration), [proxy and detection](https://next-intl.dev/docs/routing/middleware), [navigation](https://next-intl.dev/docs/routing/navigation), [Next.js proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy), [next-intl 4.0 release](https://next-intl.dev/blog/next-intl-4-0).
