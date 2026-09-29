# Cursor compatibility files

This directory contains optional Cursor-specific adapters. The instructions used across coding assistants live in standard `AGENTS.md` files:

- [`../AGENTS.md`](../AGENTS.md) applies repository-wide.
- [`../src/app/AGENTS.md`](../src/app/AGENTS.md) applies to App Router work.
- [`../src/i18n/AGENTS.md`](../src/i18n/AGENTS.md) applies to locale configuration and navigation.
- [`../dictionary/AGENTS.md`](../dictionary/AGENTS.md) applies to translation files.
- [`../src/components/AGENTS.md`](../src/components/AGENTS.md) applies to UI components.
- [`../src/lib/AGENTS.md`](../src/lib/AGENTS.md) applies to shared helpers and site metadata.

The `.mdc` files in `rules/` only point Cursor to these canonical instructions. Put new project conventions in the `AGENTS.md` files, not in Cursor-only rules. Keep the adapters aligned when instruction paths change.
