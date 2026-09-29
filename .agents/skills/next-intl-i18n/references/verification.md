# Verification

Read this to prove a change works, to diagnose a symptom, or to write the final report. Verify the rendered artifact, not a proxy for it. A passing type check, a green build, and matching dictionaries are proxies.

Local commands in this repository:

```bash
bun run i18n:check   # locale registry (check-locales.mjs) and message parity (check-messages.mjs)
bun run lint
NEXT_PUBLIC_SITE_URL=https://next-app-i18n-starter.vercel.app bun run build   # the safe example from .env.example
```

For rendered checks start `bun run dev` (or `bun run start` after a build) and use `curl`. Substitute the port. In Windows PowerShell call `curl.exe`, because `curl` there is an alias for a different command.

When no server may run, or nothing renders the change yet (a message with no consumer), run the static checks only: the message check, lint, and the build route table. Then list each rendered check under Not verified with the reason. Never mark a rendered check as passed from reading source.

## Done-when matrix

| Change | Observable check | Fails when |
| --- | --- | --- |
| Routing, proxy, prefix mode | `curl -sI /` returns 200. `/en` redirects to `/`. `/xx` returns 404. Switching en to ja and back ends at `/`. | A saved cookie or `Accept-Language` redirects `/` |
| Alternate links | `curl -sI` shows the intended `Link` header. HTML alternates match the sitemap. | Header and HTML use different tags, or list untranslated pages |
| Localized content | Each published item resolves in its locale. Switcher and alternates come from one function. Unpublished locale returns 404. | A switcher link 404s, or a sitemap lists a draft |
| Messages | Message check exits 0. One plural and one interpolated string render correctly in Arabic. | A placeholder differs, or a key is missing in one file |
| Formatting | One number, date, and list per locale look native. Hydration produces no warning. | `now` or `timeZone` differs between server and client |
| RTL | `/ar` has `dir="rtl"`, mirrored layout, unmirrored logos, intact mixed-direction text. | A physical `ml-*` or hardcoded `"ar"` check remains |
| CJK | `/ja` and `/zh` wrap without overflow at 320 px and show correct glyphs. | `lang` is wrong or `keep-all` is set |
| Static rendering | The build route table shows the intended static or dynamic marker per locale page. | A locale page is dynamic because `setRequestLocale` is missing |
| Metadata | View source: title, description, canonical, and `og:locale` are translated and locale-specific. | A child page inherits the homepage canonical |
| Error pages | `/ja/does-not-exist` returns a localized page with status 404. A forced throw renders text. | The boundary shows a missing-context error |

## Symptom to first check

| Symptom | Check first |
| --- | --- |
| "Unable to find `next-intl` locale" or missing-locale error | Proxy file name and matcher. Does the request reach the proxy? |
| Locale page is dynamic, not static | Legacy path: `setRequestLocale` before any next-intl call in every layout and page. Then look for `headers()` or `cookies()` reads. |
| `headers()` inside `use cache` | The legacy path under Cache Components. Migrate to root params. |
| `/` redirects to another language | Detection on, or a stale `NEXT_LOCALE` cookie plus `localeDetection` set differently than assumed |
| Client component "no context" | The nearest `NextIntlClientProvider`. Is the component above it, or in a boundary outside `[locale]`? |
| `MISSING_MESSAGE` in one locale | Key parity. Then `onError` and `getMessageFallback`, which a provider does not inherit. |
| Hydration mismatch on a date | Server and client `timeZone` and `now`. Use one stable `now`. |
| Wrong glyphs or line breaks | `<html lang>` |
| Digits differ from the `lang` tag | The formatting locale versus the tag. See [RTL and scripts](rtl-and-scripts.md#numerals-and-formatting-locale). |
| Link flashes a prefixed URL | `Link` with a `locale` prop under `as-needed`. Expected, and it resolves to the canonical URL. |
| Slug switch 404s | The switcher builds URLs from routing, not from content data |
| Google shows the wrong language version | Hand off to the `nextjs-seo-international` skill |

## Report shape

Every report ends with these four lines. A blank line is a claim, so write "none" when it is none.

```text
Changed: <files and behavior>
Verified: <check, locale or route, result>
Not verified: <check and why: no reviewer, no production access, not run>
Next owner action: <what a human still has to do, including fluent review of any draft copy>
```

Sample: `Verified: message check exit 0; /ja and /ar direct load 200, lang and dir correct; build route table static for all five locales. Not verified: fluent review of the new ja and ar copy.`
