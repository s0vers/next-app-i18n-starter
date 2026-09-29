# Translation instructions

The repository-level `AGENTS.md` applies here too.

- The message files are `dictionary/en.json`, `ar.json`, `zh.json`, `es.json`, and `ja.json`. Keep their namespaces and keys aligned. English defines the TypeScript message shape through `global.d.ts`.
- When adding, removing, or renaming a message key, make the same structural change in every locale file. Preserve each file's valid JSON syntax.
- Translate user-facing copy, page titles, descriptions, and SEO guide text. Keep interpolation placeholders and formatting tokens unchanged across locales.
- Do not add a `keywords` metadata field. Keep metadata specific to its page and locale.
- Treat regional tags as audience choices. Have fluent speakers review translations and confirm terms match the intended country or region before production use.
- When changing translation keys, run `node .agents/skills/next-intl-i18n/scripts/check-messages.mjs`, then `bun run lint` and `bun run build`. The check fails on missing or extra keys, changed ICU arguments or rich-text tags, empty values, and plurals without an `other` branch.
