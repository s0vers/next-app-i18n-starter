# Repository instructions

These instructions apply to coding assistants of any model or editor. Read this file first, then read the nearest `AGENTS.md` for the files you change. User instructions take priority. When documentation conflicts with the code or configuration, verify the behavior and update the stale documentation in the same change.

## Project facts

- Next.js 16 App Router, React 19, next-intl 4, Tailwind CSS 4, and shadcn/ui.
- Bun is the package manager; `bun.lock` is the lockfile. Node.js 24 is required.
- The app supports English, Arabic, Chinese, Spanish, and Japanese. English is the default locale.

## Shared rules

- Keep changes focused on the requested outcome. Inspect the relevant code and current Git status first, reuse existing patterns, and avoid dependencies or abstractions without a concrete need.
- Protect credentials and user data. Never read, edit, or commit `.env` files. Put new variable names and safe example values in `.env.example`; never place real credentials there.
- Use `@/i18n/navigation` for links and navigation that should preserve locale. Use Next.js navigation APIs directly when the operation is not locale-aware, such as `notFound()`.
- `dictionary/en.json` defines translation message types. Add or rename message keys in every `dictionary/*.json` file. Keep locale copy accurate and have fluent speakers review production translations.
- Locale routes live under `src/app/[locale]/`. Server components that need locale-aware static rendering must call `setRequestLocale(locale)` and validate route locales with `hasLocale` before using them.
- Build locale URLs with helpers from `src/lib/site.ts`. Routing uses `localePrefix: "as-needed"`: English uses `/`, and other locales use `/{locale}`. Automatic locale detection is disabled so cookies and browser language do not redirect the default URL.
- Use `createLocalizedMetadata` for page metadata and keep canonical, alternate-language, sitemap, and Open Graph URLs aligned. Follow the SEO guide in `README.md` and the SEO skill (`.agents/skills/nextjs-i18n-seo/SKILL.md`). Add structured data only when it describes visible page content; render JSON-LD in a Server Component and escape `<` in its serialized value.
- Prefer Server Components. Add `"use client"` only for client state, event handlers, or browser APIs. Theme initialization uses the existing cookie-based SSR implementation.
- Follow the component, styling, accessibility, and RTL conventions in `src/components/AGENTS.md` when changing UI.
- Keep documentation and instructions consistent with the implementation when changing a convention, route, locale, or environment variable.

## Verification

- Run `bun run lint` after changes to TypeScript, TSX, or lint configuration. `bun run check` also runs the locale, message, and skills checks that CI runs.
- Run `bun run build` after substantive application changes. Production builds require `NEXT_PUBLIC_SITE_URL` to be set to the deployment's HTTPS origin; use the safe example in `.env.example` for local verification.
- `package.json` lists the available scripts. Do not claim a check passed unless it completed successfully.

## Instruction map

- `src/app/AGENTS.md`: routes, metadata, sitemap, robots, and structured data.
- `src/i18n/AGENTS.md`: locale routing, navigation, and regional formatting.
- `dictionary/AGENTS.md`: translation keys and message files.
- `src/components/AGENTS.md`: React boundaries, styling, accessibility, theme, and RTL.
- `src/lib/AGENTS.md`: shared helpers and canonical site metadata.
- Read `.agents/skills/next-intl-i18n/SKILL.md` and only the relevant playbook before you add or change a locale, a message or plural, a formatted number, date, or list (including digits and calendars), RTL layout, the language switcher, the error page, or the proxy and routing config. `bun run i18n:check` validates the locale registry and dictionaries.
- Read `.agents/skills/nextjs-i18n-seo/SKILL.md` and the relevant playbook before you touch hreflang, canonicals, the sitemap, `robots.ts`, JSON-LD, page metadata, product or blog pages, search analytics, or AI crawler policy, and before you answer a question about rankings, traffic, indexing, or Search Console. Its `scripts/verify-seo.mjs` checks alternates, canonicals, and sitemap agreement on a running site.
- `README.md`: human setup and implementation reference.
- `public/llms.txt`: public project overview for tools that read it; it is secondary documentation, not an instruction source.
- `.cursor/rules/`: optional Cursor adapters. The `AGENTS.md` files above are the canonical rules for every assistant.

## Git

- Do not create commits, push branches, or open pull requests unless the user asks.
- Never commit `.env`, credentials, generated build output, or dependencies.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
