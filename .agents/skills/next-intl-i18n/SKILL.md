---
name: next-intl-i18n
description: Implement, review, or troubleshoot internationalization with next-intl in a Next.js app. Use the relevant routing, rendering, messages, formatting, or integration playbook; verify APIs against the installed next-intl and Next.js versions.
---

# next-intl implementation

Use this skill for changes to locale routing, translated messages, locale-aware formatting, or next-intl integration. Apply the library's documented model, then fit it to the repository's route architecture and product requirements. Internationalization includes language, regional conventions, URLs, direction, and content—not only translated strings.

## Choose a playbook

| Work | Read |
| --- | --- |
| Initial setup, request config, rendering, or static generation | [Architecture and rendering](references/architecture-and-rendering.md) |
| Locales, prefixes, localized paths, domains, proxy, or navigation | [Routing and navigation](references/routing-and-navigation.md) |
| Message catalogs, ICU, translation keys, dates, numbers, lists, or RTL | [Messages and formatting](references/messages-and-formatting.md) |
| Metadata, actions, errors, tests, TypeScript, extraction, translation operations, or Storybook | [Integrations and workflows](references/integrations-and-workflows.md) |
| Pages Router or non-Next React consumers | [Integrations and workflows](references/integrations-and-workflows.md#legacy-and-adjacent-environments) |

Load multiple playbooks only when the change crosses those areas. For broader search strategy, use the repository's SEO guidance when available; this skill covers next-intl's locale-aware integration points.

## Implementation loop

1. Read the repository instructions and inspect its installed `next-intl` and Next.js versions, routing config, request config, locale source, navigation exports, dictionaries, and affected route. Current online docs can describe APIs unavailable in the installed package.
2. Establish the intended locale set, locale fallback, URL strategy, regional formatting, translation workflow, and whether the request means language choice or region choice. Derive answers from the user and tracked configuration; do not silently infer product policy from the library defaults.
3. Select the matching playbook and implement the smallest complete change using the repository's established architecture. Keep routing config shared across proxy and navigation, and keep locale-dependent content and formatting request-scoped.
4. Complete every affected locale path: routes, messages, formats, metadata, switcher behavior, and direction. Use the project's translation workflow; do not invent unsupported locale strings or pretend an untranslated fallback is reviewed copy.
5. Verify the visible behavior and route behavior for the changed locale(s), then run the repository's relevant checks. Report which locales and execution paths were verified and which remain unverified.

## Working principles

- Prefer Server Components for translated static content. Add client-side message delivery only for components that actually need client-side translation or formatting; pass translated labels from a Server Component to an interactive leaf when that fits.
- Use next-intl's formatting APIs and the locale's real regional settings for dates, numbers, currencies, lists, and display names. Avoid hardcoded separators, currency symbols, plural logic, and locale names.
- Use `createNavigation` wrappers for localized links and navigation. Keep routing settings in one shared source so links, proxy behavior, and generated URLs agree.
- Treat examples and defaults in the docs as choices, not universal product decisions. In particular, determine whether locale detection, cookies, prefixes, domains, and static generation match the actual app.
- For version-sensitive or experimental features, inspect the installed package types and current official docs before using them. Prefer stable APIs unless the task explicitly accepts an experimental dependency.

## Source of truth

This skill distills the official [next-intl documentation](https://next-intl.dev/docs/getting-started), checked 2026-09-30. The linked playbooks describe the decision points and caveats; consult the live docs for full API signatures and current version details. A dated source inventory and summary is in [docs/next-intl-docs-research.md](../../../docs/next-intl-docs-research.md).
