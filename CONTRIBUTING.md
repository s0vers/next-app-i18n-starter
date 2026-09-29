# Contributing

Thanks for helping. This starter is meant for people who are learning i18n in Next.js, so a change that makes something easier to understand is as welcome as a new feature.

## Set up

You need Node.js 24 and [Bun](https://bun.sh).

```bash
bun install
cp .env.example .env.local   # then set NEXT_PUBLIC_SITE_URL
bun run dev
```

## Before you open a pull request

```bash
bun run check   # lint, typecheck, locale and message parity, skills structure
bun run build   # needs NEXT_PUBLIC_SITE_URL set to an HTTPS origin
```

## Guidelines

- Keep a change focused on one outcome. Explain why in the description.
- Add every new message key to all five files in `dictionary/`. `bun run i18n:check` fails when one is missing.
- Use `Link` and navigation helpers from `@/i18n/navigation`. ESLint blocks the alternatives.
- Read `AGENTS.md` and the `AGENTS.md` nearest to the files you change. They hold the conventions, and they are written for people as well as coding agents.
- Translations should be reviewed by a fluent speaker. Say in the pull request when they are not.
- Do not commit `.env` files or credentials.

## Skills

The agent skills live in `.agents/skills/`. `bun run skills:check` validates them. The SEO skills share one block of text kept in `.github/shared/seo-shared.md`. Edit that file, then run `node .github/scripts/sync-shared.mjs` to copy it into each skill.
