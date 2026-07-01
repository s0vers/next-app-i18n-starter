# Agent guide

Instructions for AI coding assistants working in this repository.

## Project

Next.js 16 App Router boilerplate with **next-intl 4**, locale-driven formatting, shadcn/ui, RTL, cookie-based theme SSR, and full SEO.

- **Package manager:** `bun` (preferred) or `pnpm` — not npm/yarn
- **Node:** 24.x (see `.nvmrc`, `package.json` engines)
- **After substantive changes:** `bun run build` (and `bun run lint` when touching TS/TSX)

## Non-negotiables

1. **Never edit `.env` or commit secrets** — use `.env.example` as the template only
2. **Navigation:** use `@/i18n/navigation` (`Link`, `useRouter`, `usePathname`, `getPathname`) — not `next/link` or `next/navigation` directly
3. **Translations:** `en.json` is the type source of truth; add keys to **all** `dictionary/*.json` files
4. **Locale pages:** call `setRequestLocale(locale)` in Server Components under `src/app/[locale]/`
5. **URLs for SEO:** build with `getPathname` — English is `/` (`localePrefix: "as-needed"`), not `/en`
6. **React 19:** no `next/script` or inline `<script>` in client components; JSON-LD in Server Components only
7. **Minimize diff scope** — match existing patterns; no drive-by refactors

## Cursor rules

Detailed, file-scoped rules live in [`.cursor/rules/`](.cursor/rules/). Cursor loads them automatically.

| File | Purpose |
|------|---------|
| `project-core.mdc` | Tooling, env, commits, general standards |
| `i18n.mdc` | Locales, dictionaries, regional formatting |
| `nextjs-pages.mdc` | App Router pages and layouts |
| `seo.mdc` | Metadata, sitemap, robots, canonical URLs |
| `components.mdc` | React components, shadcn, RTL, theme |

## Deep reference

- Human docs: [README.md](README.md)
- Machine-readable: [public/llms.txt](public/llms.txt)
- Cursor setup: [.cursor/README.md](.cursor/README.md)

## Common tasks (pointers)

| Task | Where to look |
|------|----------------|
| Add language | `src/i18n/locales.ts` (`localeConfig`) — routing, regional, OG, and switcher derive from it |
| Add page | `src/app/[locale]/…/page.tsx`, dictionary namespace, `@/i18n/navigation` links |
| Add SEO to page | `generateMetadata`, dictionary meta keys, `sitemap.ts` entry |
| RTL islands | `OmitRTL` from `@/components/OmmitRlt` |
| Site constants | `src/lib/site.ts` |
