# RTL and scripts

Read this for Arabic (RTL), Chinese and Japanese (CJK), and Spanish, and for any locale with a different script, plural system, or numeral system than English.

## Direction

- Set `dir` on `<html>` from a `dir` field in `localeConfig`, not from a hardcoded language check. Only `ar` is RTL here.
- Do not derive direction at runtime with `Intl.Locale().getTextInfo()`. Node supports it, and cross-browser support is not verified.
- Everything that reads direction (layout, `LanguageSwitcher`, `HomeIndex`, Radix `dir` props) reads the same field. A second hardcoded `=== "ar"` is the usual leak.

## Layout in RTL

Use logical utilities. They flip with `dir` and need no `rtl:` variant.

| Physical (breaks in RTL) | Logical |
| --- | --- |
| `ml-4` `mr-4` | `ms-4` `me-4` |
| `pl-4` `pr-4` | `ps-4` `pe-4` |
| `text-left` `text-right` | `text-start` `text-end` |
| `left-0` `right-0` | `start-0` `end-0` |
| `border-l` `rounded-l` | `border-s` `rounded-s` |

Use `rtl:` only where no logical property exists, mainly flipping directional icons with `rtl:-scale-x-100`. Flip chevrons, back arrows, and progress direction. Never flip logos, checkmarks, or media controls.

Wrap left-to-right tokens inside RTL text in `<bdi>` or the template's `OmitRTL`: code, URLs, version numbers, product SKUs, phone numbers. Without it the bidi algorithm reorders punctuation around them.

Arabic typography: no `letter-spacing`, because tracking breaks cursive joins. No italics. Give Arabic a taller line height than Latin. Use one Arabic-aware font per locale, since a mixed Latin and Arabic fallback stack causes vertical rhythm jumps.

## Numerals and formatting locale

`lang` and the formatting locale are separate inputs, and they can disagree.

| Locale | Digits |
| --- | --- |
| `ar` | Latin: `1,234.5` |
| `ar-SA`, `ar-EG` | Arabic-Indic: `١٬٢٣٤٫٥` |
| `ar-u-nu-latn` | Latin, forced |

This template sets `lang="ar-SA"` and formats with the route locale `ar`. Users see Latin digits under an `ar-SA` tag. Choose the numeral system on purpose, set `numberingSystem` in `formats`, and test one Arabic route. Pin the calendar with `-u-ca-gregory` when Gregorian dates are required, because the default calendar depends on the ICU version.

## Plural categories

Verified by running `Intl.PluralRules` on Node 24.19.

| Locale | Categories | Practical rule |
| --- | --- | --- |
| `en` | `one`, `other` | |
| `ar` | `zero`, `one`, `two`, `few`, `many`, `other` | 0 zero, 1 one, 2 two. Otherwise n mod 100 decides: 3 to 10 few (103 is few), 11 to 99 many (111 is many), 0 to 2 other (100 to 102 are other, and so are fractions). Write `=0` (it covers zero), `one`, `two`, `few`, `many`, and `other`, or a wrong form ships. |
| `es` | `one`, `many`, `other` | `many` applies at 1,000,000 ("1 millón de..."). Without a `many` branch ICU falls to `other`. |
| `zh`, `ja` | `other` | One branch only. Use `=1` when the copy must differ at one. |

Ordinals collapse to `other` in `ar`, `es`, `zh`, and `ja`. English needs `one`, `two`, `few`, `other`.

## Left-to-right Latin locales (German, French, Italian)

No `dir` change, no new plural work (`one` and `other`), and the loaded `latin` font subset already has the accented letters. Three things still need a check:

- Text runs about 30 percent longer than English. German compounds do not wrap, so a narrow button or card overflows. Test at 320 px, and set `hyphens: auto` with the correct `lang` so the browser can hyphenate.
- Use the locale's own quotes and number format. Do not hardcode `"` or a decimal point.
- Metadata and the guide copy in `en.json` list the supported languages by name. Add the new one there in every dictionary.

## Other formatting differences

- Lists: `ar` prefixes the conjunction with a joined "و". `zh` uses `、` and `和`. `ja` uses `、`. `es` uses `y`.
- Currency: `ja-JP` JPY prints a fullwidth yen, `￥1,234`. Compact notation gives `1.2億` in Japanese, `1.2亿` in Chinese, and `1,2 M` in Spanish.
- Grouping: `es-ES` omits grouping for four-digit numbers (`1234`) and groups from five (`12.345`). Set `useGrouping: "always"` when a design needs the separator.

## CJK

- Set the correct `lang`. It selects the Han glyph variant and the line-breaking rules, so `ja`, `zh-Hans`, and `zh-Hant` render the same code points differently.
- `word-break: keep-all` prevents breaks between CJK characters and overflows in `zh` and `ja`, which have no spaces. Leave the default. Use `overflow-wrap: anywhere` for long Latin tokens.
- `line-break: strict` or `loose` tunes punctuation rules. `text-autospace: normal` is Baseline 2025 and adds spacing between CJK and Latin.
- Never apply `text-transform: uppercase` or tracking to CJK or Arabic. Keep `font-synthesis: none`, since synthesized bold and italic distort these scripts.

## Fonts

`next/font` declares one CSS variable per font. A font imported in the root layout preloads on every route, so keep script-specific fonts behind a per-locale condition or a per-locale subset. Subsets listed in `subsets` preload, and a missing subset with `preload: true` warns.

This template uses system fonts for `ar`, `zh`, and `ja`. That costs no bytes and gives each OS its own glyph shapes. If a web font is adopted, measure its payload per locale in the network panel before merging. Arabic subsets can pass 60 KB, and CJK fonts are larger.

## Verify

- `/ar`: `dir="rtl"`, mirrored layout, mirrored directional icons, unmirrored logos.
- An Arabic plural for 0, 1, 2, 5, 11, and 100 shows six different forms.
- A mixed-direction string (a URL or SKU inside Arabic text) keeps its order.
- `/ja` and `/zh` show the right glyph variants and wrap without overflow at 320 px.
- One number, one date, and one list in every locale look native to a fluent reader.

Sources, checked 2026-09-30: [MDN word-break](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/word-break), [MDN text-autospace](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-autospace), [Tailwind margin utilities](https://tailwindcss.com/docs/margin), [Tailwind state variants](https://tailwindcss.com/docs/hover-focus-and-other-states), [next/font](https://nextjs.org/docs/app/api-reference/components/font), [W3C Arabic layout requirements](https://www.w3.org/TR/alreq/), [next-intl translations and RTL](https://next-intl.dev/docs/usage/translations).
