# Messages and locale-aware formatting

Use this reference for catalogs, translated copy, ICU messages, regional formatting, language direction, or translation integrity.

## Structure message catalogs for ownership and type safety

Keep message keys stable and organized around a component or feature's translation needs. Namespace at the lowest common parent a component consumes. The `.` character denotes nesting and cannot be a literal key character. Use source-locale messages as the type source where the repository does so; preserve its catalog format and translation process. See [rendering translations](https://next-intl.dev/docs/usage/translations) and [TypeScript augmentation](https://next-intl.dev/docs/workflows/typescript).

For each user-facing string, use the project's established API (`useTranslations`, `getTranslations`, or a deliberately adopted extraction workflow) rather than hardcoding text in a component. In this template, `dictionary/en.json` defines the message type and every `dictionary/*.json` must have the same key structure. Keep locale-specific page metadata and UI copy in their appropriate namespaces. If a locale is intentionally incomplete in another project, implement explicit fallback/optional-message behavior; do not report an untranslated fallback as completed localization. See [AI agent guidance](https://next-intl.dev/docs/workflows/agents) and [optional messages](https://next-intl.dev/docs/usage/translations).

## Give translators control of the whole sentence

Use ICU arguments for variable insertion and stateful wording. Use ICU `plural` for counts and `select` for grammatical variants; do not concatenate fragments or encode English singular/plural rules in application logic. Let each locale use its own plural categories while preserving argument names and required branches such as `other`. Use ICU ordinal syntax for rank/position, and escape literal braces as documented. See [ICU messages](https://next-intl.dev/docs/usage/translations).

Use `t.rich` when a translated sentence contains React-rendered emphasis, links, or other safe component slots. Keep component attributes and destinations in code, not in translator-authored markup. `t.markup` returns a string of generated HTML; `t.raw` returns unparsed raw content and requires the same trust/sanitization care as any other HTML injection. Prefer React rich text over `dangerouslySetInnerHTML` for ordinary rich copy. See [rich text, markup, and raw messages](https://next-intl.dev/docs/usage/translations).

## Format data from locale, not English assumptions

Use `useFormatter` or `getFormatter` for plain values and configured shared formats for repeated presentation:

- Numbers and currencies: use `format.number`; allow locale-specific digits, separators, grouping, and currency position. Currency code and locale are distinct business inputs. See [number formatting](https://next-intl.dev/docs/usage/numbers).
- Dates and times: use `format.dateTime`; choose the time zone from product/data requirements, not the server's implicit zone. Use relative time, ranges, and shared formats when those are the actual presentation needs. See [date and time formatting](https://next-intl.dev/docs/usage/dates-times).
- Lists: use `format.list` for conjunction/disjunction and locale-aware separators; do not build grammatical lists with `join(', ')`. See [list formatting](https://next-intl.dev/docs/usage/lists).
- Locale labels: use `format.displayName` for locale-aware language, region, currency, and script names rather than a hand-maintained English map when runtime support meets the need. See [display names](https://next-intl.dev/docs/usage/display-name).

Keep server and client formatting inputs consistent. For relative times or `now`-dependent output, provide a stable `now`/update interval when deterministic rendering is required; check the [date/time guide](https://next-intl.dev/docs/usage/dates-times) and [request config guide](https://next-intl.dev/docs/usage/configuration).

## Treat locale as a bundle of language and conventions

A locale can include language and regional preferences; it does not automatically determine every market decision such as currency, tax, inventory, or time zone. Keep those choices explicit in application config or data. This template's route keys (`zh`, `ar`) differ from the BCP 47 tags in `localeConfig` (`zh-Hans-CN`, `ar-SA`); use the latter for HTML `lang` and language annotations while keeping routing keys for route selection. See [translations terminology](https://next-intl.dev/docs/usage/translations) and [routing configuration](https://next-intl.dev/docs/routing/configuration).

For RTL locales, set document direction and audit layout behavior, punctuation, icons, mixed-direction identifiers, and inline content. Direction is part of the rendered experience, not a translation-key concern. Consult the RTL section of [rendering translations](https://next-intl.dev/docs/usage/translations).

## Keep catalogs valid

After message edits, check JSON validity, namespace/key parity, ICU argument and rich-text tag parity, and required locale coverage. Spot-check a plural or interpolated message in a target language with different grammar; a passing type check alone cannot judge linguistic quality. Follow `dictionary/AGENTS.md` for fluent-speaker review before production. The next-intl docs describe `@eloqnt/cli` for missing translations and inconsistent ICU arguments; adopt it only when the project accepts the new dependency and workflow. See [linting messages](https://next-intl.dev/docs/workflows/messages).
