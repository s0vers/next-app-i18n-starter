# How i18n works in this template

A ten minute tour for someone who has never shipped a multilingual site. Read it once, then run the exercises at the end. Each exercise fails on purpose so you can see what the checks catch.

## Five things must agree

For every language, these five things have to match. Every i18n bug is one of them disagreeing with another.

| Thing | Where it lives | Example of it going wrong |
| --- | --- | --- |
| The URL | `src/i18n/routing.ts`, `src/proxy.ts` | Japanese pages live at `/jp` while the language code is `ja` |
| The page language | `<html lang dir>` in `src/app/[locale]/layout.tsx`, values from `src/i18n/locales.ts` | Arabic renders left to right |
| The text | `dictionary/*.json` | A key exists in English and is missing in Arabic |
| The navigation | `src/i18n/navigation.ts` | A link that drops the `/ja` prefix |
| The formatting | `src/i18n/request.ts`, `src/i18n/regional.ts` | A price shows dollars on the Spanish page |

## What happens when someone opens `/ja`

1. **The proxy** (`src/proxy.ts`) is next-intl's middleware. It applies the URL rules from `routing.ts`: English lives at `/`, every other language has a prefix, and nothing redirects you by browser language.
2. **The route** `src/app/[locale]/` receives `ja` as a parameter. The layout checks it with `hasLocale` and returns a 404 for anything unknown, so `/xx` never renders.
3. **The request config** (`src/i18n/request.ts`) picks the messages (`dictionary/ja.json`), the time zone, and the currency for that language from `localeConfig`.
4. **The layout** writes `<html lang="ja-JP" dir="ltr">` and passes the messages to the client.
5. **Server components** call `getTranslations`. **Client components** call `useTranslations`. Both read the same dictionary.
6. **Links** come from `src/i18n/navigation.ts`, so `/about` becomes `/ja/about` without you writing the prefix.

## Where to change things

| You want to | Change |
| --- | --- |
| Add a language | One entry in `src/i18n/locales.ts` and one file in `dictionary/`, then `bun run i18n:check` |
| Change a language's currency or time zone | The same entry in `locales.ts` |
| Add or edit text | The same key in every `dictionary/*.json` |
| Change the URL rules | `src/i18n/routing.ts` |
| Change what search engines see per page | `createLocalizedMetadata` in `src/lib/site.ts` |

Language and market are separate ideas. `localeConfig` ties one currency to each language because this is a demo. A real store that sells in two currencies in one language needs its own route for each, and the SEO skill explains why.

## Things that went wrong here, and what catches them

These are real. Each one was found in this repository.

- **A wrong language code.** A contributor fixed `jp` to `ja`. `bun run i18n:check` now fails on an unknown language code, so it cannot come back.
- **Two sets of `hreflang`.** The proxy added its own `Link` header with different tags than the page's HTML. Search engines saw two answers. `routing.ts` now turns the header off, and `verify-seo.mjs` fails if they disagree.
- **An error page nobody saw.** `error.tsx` sat outside `[locale]`, so a crash showed Next.js's plain English page. It lives inside `[locale]/` now.
- **Arabic digits.** The page tag is `ar-SA` but numbers format with the route key `ar`, so digits come out Latin. The tag decides digits, so choose on purpose and test one Arabic page.
- **Hardcoded `"ar"` checks.** Direction came from three places that each tested for Arabic. It now comes from `dir` in `localeConfig`.

## Try it

Run each one, read the failure, then undo it.

```bash
bun install
```

1. **Miss a translation.** Delete one key from `dictionary/ar.json`, then run `bun run i18n:check`. It names the missing key and file.
2. **Break a plural.** Add `"items": "{count, plural, one {# item}}"` under `Footer` in `dictionary/en.json` and run the check. It reports the plural with no `other` branch, and the four files that lack the key.
3. **Add a language.** Follow the steps in the README's "Adding a new language", using `fr`. Run `bun run i18n:check` after each step and watch what it asks for.
4. **Use a wrong code.** Rename the `ja` key in `locales.ts` to `jp` and run the check. It rejects the code, the mismatched tags, and the missing `jp.json`.
5. **Look at the page source.** Run `bun run dev`, open `/ar`, and view source. Find `<html lang dir>`, the `<link rel="alternate" hreflang>` tags, and the canonical.
6. **Check search signals.** With the dev server running, run `bun run seo:verify -- --base http://localhost:3000`. Then break the canonical in `createLocalizedMetadata` and run it again.

## Using an AI agent

The repository ships eight skills in `.agents/skills/`, short guides an agent follows when it works on locales or search: one for next-intl and seven for SEO. In this repository the instruction map in `AGENTS.md` sends an agent to the right one. In your own project, install them with `npx skills add s0vers/next-app-i18n-starter`. The [README](README.md#skills-for-coding-assistants) lists what each playbook covers.

Every check an agent runs is a script you can run yourself: `bun run check` for lint, locales, messages, and skills, and `bun run seo:verify` for search signals.
