---
name: nextjs-i18n-seo
description: Plan, audit, or implement SEO for this Next.js and next-intl template or a fork. Use the relevant technical, international, content, AI search, or measurement playbook. Verify site-specific facts and current guidance; never promise rankings.
---

# Next.js i18n SEO

Use this skill when a request concerns organic discovery, search presentation, multilingual SEO, or SEO measurement for this template or a fork. SEO includes distinct technical, editorial, international, and business-specific work. Choose the playbook that matches the request, then load only the references needed for the affected work.

## Choose a playbook

| Request | Read |
| --- | --- |
| Crawlability, indexing, URLs, canonicals, metadata, rendering, robots, sitemap, structured data, or performance | [Technical SEO](references/technical-seo.md) |
| Locale routes, translations, language or region targeting, `hreflang`, or international rollout | [International SEO](references/international-seo.md) |
| Search intent, page copy, titles, headings, internal links, or content planning | [Content and on-page SEO](references/content-and-onpage.md) |
| Google AI search, answer engines, crawler policy, or browser agents | [AI and agentic discovery](references/ai-and-agentic-discovery.md) |
| Broad audit, production launch, domain change, migration, or monitoring | [Audits, launches, and migrations](references/audits-launches-migrations.md) |
| Local business, ecommerce, publisher, video, or image search | [Site types and search features](references/site-types-and-search-features.md) |

For a broad audit, start with the audit reference and add only the playbooks supported by evidence. For a focused fix, skip unrelated references.

## Shared workflow

1. Read the repository `AGENTS.md` and the closest scoped guide. Inspect the route, rendered output, and existing helpers before proposing a change.
2. Establish the target site, page, audience, locale, deployment, and desired outcome from tracked files and user-provided facts. This repository's demo URL and author are not defaults for a fork. Never read `.env` or claim that DNS, deployment variables, Search Console, hosting controls, or live crawl access are configured without evidence.
3. Separate observed symptoms from causes. Use a URL, locale, response, rendered page, or report as evidence. For production indexing or traffic complaints, repository inspection alone cannot identify the live cause. If production evidence is unavailable, report repository findings as hypotheses, request the specific live evidence needed, and do not change code based only on the reported symptom.
4. For current platform behavior, browse the owning platform's official documentation. Use expert commentary only as secondary analysis. Date research notes and cite direct sources. If current guidance cannot be checked, say so.
5. Make changes within the requested scope. Reuse project helpers and conventions. Update shared documentation when a reusable SEO behavior changes.
6. Verify at the layer changed. Run `bun run lint` after TypeScript or TSX edits and `bun run build` after substantive app changes. Inspect locale HTML, canonical and alternate links, sitemap, robots, and structured data when affected. Report local checks separately from production checks.
7. Report evidence, changes, checks, tradeoffs, and the next owner action. Eligibility, validation tools, or implementation alone do not prove indexing, rankings, traffic, or AI citations.

## Project invariants

Apply these rules when changing this template. A fork may have different routes or product decisions; verify them before carrying these defaults forward.

- English is `/`; other configured locales use prefixes, and automatic locale detection is disabled. Use `getLocaleUrl`, `getAlternateLanguages`, and `createLocalizedMetadata` from `src/lib/site.ts` rather than hardcoding URLs.
- Give each translated, indexable page a real localized route, self-canonical, reciprocal alternate set, and matching sitemap entry. Use only locales whose route exists. Set `lastModified` only from a reliable content date.
- Read language and region tags from `localeConfig`. Add translated message keys to every `dictionary/*.json` file. Treat regional targeting as a market decision, not an automatic result of translation.
- Keep JSON-LD in a Server Component, escape `<` in serialized JSON, and describe only content visible on the page. The existing `WebSite` site-name node belongs on the default-locale domain homepage.
- Check both app robots rules and the deployment layer. A permissive `robots.ts` does not prove the host, CDN, firewall, or authentication layer allows access.
- Change crawler policy only when requested. Search discovery and model-training access are separate owner choices; check each provider's current crawler documentation before editing rules.

## Project references

- [README.md](../../../README.md): template behavior and implementation guide.
- [docs/seo-research.md](../../../docs/seo-research.md): sourced decisions for this deployment. Recheck dated guidance before relying on it.
