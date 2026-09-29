# Messages and formatting

Read this for catalogs, ICU, rich text, number, date, and list formatting, typing, extraction, and translation review.

## Catalog structure

- `dictionary/en.json` defines the types through `global.d.ts`. Every other file mirrors its keys exactly.
- Keys are short, stable, and named for meaning, not for the English text. `Checkout.payNow`, not `Checkout.clickHereToPay`. Renaming English copy must not rename a key.
- `.` is the nesting separator and cannot appear in a key.
- Scope a namespace at the lowest parent a component consumes: `useTranslations("Index.hero")`.
- Page metadata lives in its own namespace, so a title change never touches UI strings.
- Put a new key in the namespace of the component that will use it. Create a namespace only for a new feature area. Add a message without its consumer only when the user asked for the message alone, and say in the report that nothing renders it yet.
- Do not add a `keywords` metadata field. Search engines ignore it.

## ICU in one table

| Need | Write | Trap |
| --- | --- | --- |
| Insert a value | `Hello {name}` | Names use letters, digits, and underscore only. No dashes. |
| Count | `{count, plural, =0 {No items} one {# item} other {# items}}` | `other` is mandatory in every locale. `=0` matches only the number 0, so it also covers Arabic's `zero` category. Do not add both. Categories per locale are in [RTL and scripts](rtl-and-scripts.md#plural-categories). |
| Grammar or state | `{gender, select, female {her} male {his} other {their}}` | `other` is mandatory. |
| Rank | `{n, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}` | Only English needs these branches. Other locales collapse to `other`. |
| Literal brace | `'{'` | A single quote escapes. |
| Number, date | `{price, number, currency}` or `{d, date, ::yyyyMMMd}` | Skeletons need the `::` prefix. Named formats come from `formats` in request config. |

Each locale supplies its own plural branches. Arabic uses six categories and Spanish adds `many`. See [RTL and scripts](rtl-and-scripts.md#plural-categories) for the table. Never encode English singular and plural in application code.

## Rich text and raw HTML

| API | Returns | Use |
| --- | --- | --- |
| `t.rich("key", { b: (c) => <b>{c}</b> })` | React nodes | Emphasis, links, and other slots. Attributes and destinations stay in code. |
| `t.markup` | HTML string | Rare. Trust and sanitize like any HTML injection. |
| `t.raw` | Unparsed message | Arrays or structured data. Not supported with `precompile`. |
| `t.has("key")` | boolean | Optional messages. |

Prefer `t.rich` over `dangerouslySetInnerHTML` for ordinary copy. Translators must never author `href` values.

## Format values with the locale's rules

| Value | API | Rule |
| --- | --- | --- |
| Number, currency, percent | `format.number` | Currency code is a business input. The locale only decides symbol placement and digits. |
| Date and time | `format.dateTime`, `format.dateTimeRange` | Set `timeZone` from product needs, never from the server's zone. Store dates as ISO 8601 strings. |
| Relative time | `format.relativeTime`, `useNow({ updateInterval })` | Pass a stable `now` or the server and client render different text and hydration warns. |
| List | `format.list(items, { type })` | `conjunction` for "and", `disjunction` for "or". Never `join(", ")`. |
| Language, region, currency name | `format.displayName(code, { type })` | Available from 4.11.0 and documented for `useFormatter` only. Check the installed types before using it in async server code. |

This template derives currency and time zone from `localeConfig` through `createRegionalFormats`. Use its named formats (`price`, `compact`, `short`, `long`) instead of inline options.

## Typing

```ts
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof en;
    Formats: typeof formats;
  }
}
```

The interface must be named `AppConfig`, and the file must be in `tsconfig` `include`. A type error on a message key is feedback. Fix the key, never widen the type.

## Authoring workflows

| Workflow | Choose when | Cost |
| --- | --- | --- |
| Catalog with `useTranslations` (this template) | Default | You maintain keys by hand. |
| `useExtracted` and `getExtracted` | The team wants inline source strings | Experimental. Literal messages only. Generated keys changed in 4.13.0 and `.po` users need an update in 4.14.0. |
| `experimental.messages.precompile` | A measured client bundle problem | Static messages only, and no `t.raw`. |
| Translation platform (Crowdin) | Several translators or a review process | Adds a service. Do not add one by default. |

The next-intl docs warn against having an agent translate catalogs unsupervised. Missing context and drift produce wrong copy that type checks. Draft a translation when asked, mark it draft in the report, and leave production sign-off to a fluent reviewer.

## Wrong and right

| Wrong | Right | Why |
| --- | --- | --- |
| `` `${count} ${count === 1 ? "item" : "items"}` `` | `t("items", { count })` with ICU plural | Arabic has six plural forms. |
| `t("greeting") + " " + name` | `t("greeting", { name })` | Word order differs. |
| `items.join(", ")` | `format.list(items, { type: "conjunction" })` | Separators and the word for "and" differ. |
| `"$" + price` | `format.number(price, "price")` | Symbol placement and digits differ. |
| Hardcoded string in JSX | `t("key")` in all five files | Untranslated text ships silently. |
| Key added to `en.json` only | Key added to every dictionary | Type checks read only `en.json`. |

## Validate

Run `node .agents/skills/next-intl-i18n/scripts/check-messages.mjs` after any edit. It reads `dictionary/*.json` and fails on invalid JSON, missing or extra keys, changed ICU arguments, changed rich-text tags, empty strings, and plurals without `other`. It does not judge meaning. Spot-check one plural and one interpolated message in a language whose grammar differs from English, and have a fluent speaker review production copy. `npx eloqnt lint` from `@eloqnt/cli` covers similar ground and adds a dependency, so adopt it only on request.

Sources, checked 2026-09-30: [translations](https://next-intl.dev/docs/usage/translations), [messages](https://next-intl.dev/docs/usage/messages), [numbers](https://next-intl.dev/docs/usage/numbers), [dates and times](https://next-intl.dev/docs/usage/dates-times), [lists](https://next-intl.dev/docs/usage/lists), [display names](https://next-intl.dev/docs/usage/display-name), [TypeScript](https://next-intl.dev/docs/workflows/typescript), [extraction](https://next-intl.dev/docs/usage/extraction), [AI agents](https://next-intl.dev/docs/workflows/agents), [precompilation](https://next-intl.dev/blog/precompilation).
