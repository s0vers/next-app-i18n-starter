# Acknowledgments

Thanks to the maintainers and contributors behind the projects listed here.

---

## Core stack

| Project | Role in this repo | Links |
| ------- | ----------------- | ----- |
| [Next.js](https://nextjs.org) | App Router, Server Components, Metadata API, sitemap/robots, Turbopack | [GitHub](https://github.com/vercel/next.js) |
| [React](https://react.dev) | UI runtime (v19) | [GitHub](https://github.com/facebook/react) |
| [TypeScript](https://www.typescriptlang.org) | Static typing across the codebase | [GitHub](https://github.com/microsoft/TypeScript) |

---

## Internationalization

| Project | Role in this repo | Links |
| ------- | ----------------- | ----- |
| [next-intl](https://next-intl.dev) | Locale routing, ICU messages, `useFormatter`, `getRequestConfig`, hreflang-friendly navigation | [GitHub](https://github.com/amannn/next-intl) |

The i18n architecture in this starter (locale-scoped App Router, `localePrefix: "as-needed"`, per-request regional formats) follows patterns documented by the next-intl project.

---

## UI and styling

| Project | Role in this repo | Links |
| ------- | ----------------- | ----- |
| [shadcn/ui](https://ui.shadcn.com) | Component patterns and CLI setup (`components.json`) | [GitHub](https://github.com/shadcn-ui/ui) |
| [Base UI](https://base-ui.com) | Accessible primitives (button, menu, tabs, direction provider) | [GitHub](https://github.com/mui/base-ui) |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling (v4) | [GitHub](https://github.com/tailwindlabs/tailwindcss) |
| [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) | Animation utilities for UI components | [GitHub](https://github.com/jamiebuilds/tailwindcss-animate) |
| [class-variance-authority](https://cva.style) | Variant APIs for buttons and similar components | [GitHub](https://github.com/joe-bell/cva) |
| [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | `cn()` class merging in `src/lib/utils.ts` | — |
| [Lucide](https://lucide.dev) | Icons (`lucide-react`) | [GitHub](https://github.com/lucide-icons/lucide) |
| [Geist](https://vercel.com/font) | Sans and mono fonts via `next/font/google` | — |

---

## Analytics and deployment

| Project | Role in this repo | Links |
| ------- | ----------------- | ----- |
| [Vercel Analytics](https://vercel.com/docs/analytics) | `@vercel/analytics` in root layout | — |
| [Vercel Speed Insights](https://vercel.com/docs/speed-insights) | `@vercel/speed-insights` in root layout | — |

---

## Tooling

| Project | Role in this repo | Links |
| ------- | ----------------- | ----- |
| [Bun](https://bun.sh) | Package manager and script runner | [GitHub](https://github.com/oven-sh/bun) |
| [ESLint](https://eslint.org) + [eslint-config-next](https://nextjs.org/docs/app/api-reference/config/eslint) | Linting | — |

---

## Assistant instructions

| Resource | Role in this repo | Links |
| -------- | ----------------- | ----- |
| [`AGENTS.md`](AGENTS.md) | Shared instructions for coding assistants across models and editors | — |
| [Next.js SEO skills](.agents/skills/) | Seven focused SEO skills for this template and its forks | — |
| [llms.txt](https://llmstxt.org) | Public project reference for tools that read it (`public/llms.txt`) | [Spec](https://llmstxt.org) |
| [Cursor](https://cursor.com) | Optional adapters under `.cursor/rules/` | — |

---

## License note

Dependencies retain their own licenses. This repository is released under the [MIT License](LICENSE). See each upstream project for its terms.

If you maintain a project listed here and want a wording or link change, open an issue or pull request.
