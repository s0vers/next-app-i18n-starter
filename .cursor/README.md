# Cursor configuration

This folder configures [Cursor](https://cursor.com) AI agents for the **Next.js 16 i18n Starter** repository.

## Layout

```
.cursor/
├── README.md           # This file
└── rules/              # Agent rules (.mdc with YAML frontmatter)
    ├── project-core.mdc
    ├── i18n.mdc
    ├── nextjs-pages.mdc
    ├── seo.mdc
    └── components.mdc
```

Project-level agent entry point: [`AGENTS.md`](../AGENTS.md) at the repo root.

## How rules work

| Rule | Scope | When it applies |
|------|--------|-----------------|
| `project-core` | Whole repo | Every chat (`alwaysApply: true`) |
| `i18n` | `dictionary/`, `src/i18n/` | Editing translations or i18n config |
| `nextjs-pages` | `src/app/**` | App Router pages, layouts, metadata routes |
| `seo` | SEO-related paths | Metadata, sitemap, robots, `site.ts` |
| `components` | `src/components/**` | UI and page components |

Rules are **concise constraints**, not tutorials. For full workflows see [`README.md`](../README.md) and [`public/llms.txt`](../public/llms.txt).

## Maintaining rules

1. **One concern per file** — split new guidance into the matching rule instead of bloating `project-core`.
2. **Keep under ~50 lines** per rule when possible; link to README/llms.txt for long explanations.
3. **Mirror real conventions** — if the codebase changes (new locale, proxy rename, etc.), update the relevant rule in the same PR.
4. **Do not duplicate** `llms.txt` — rules enforce behavior; `llms.txt` remains the machine-readable reference for external tools.

## Related docs

- [README.md](../README.md) — human documentation
- [public/llms.txt](../public/llms.txt) — LLM/AI context (llmstxt.org)
- [AGENTS.md](../AGENTS.md) — quick agent onboarding
