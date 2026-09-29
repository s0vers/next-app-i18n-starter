---
name: nextjs-i18n-seo
description: Plan, implement, or audit search discovery for this Next.js and next-intl template or a fork, including multilingual routes, products, articles, measurement, and AI search. Verify current platform rules before applying them.
---

# Next.js i18n SEO

Choose the page type and failure mode before loading a playbook. This template provides locale routing and homepage SEO conventions; a fork's business, content, and search goals must be established from its own pages and owner data.

## Choose a playbook

| Request | Read |
| --- | --- |
| Crawlability, indexing, URLs, canonicals, metadata, rendering, robots, sitemap, structured data, or performance | [Technical SEO](references/technical-seo.md) |
| Locale routes, translations, language or region targeting, `hreflang`, or international rollout | [International SEO](references/international-seo.md) |
| Search intent, page copy, titles, headings, internal links, or content planning | [Content and on-page SEO](references/content-and-onpage.md) |
| Product pages, categories, variants, offers, feeds, filters, or ecommerce | [Commerce and products](references/commerce-and-products.md) |
| Blog posts, articles, news, archives, or editorial publishing | [Editorial and publishing](references/editorial-and-publishing.md) |
| Search Console, GA4, Bing Webmaster Tools, attribution, or SEO reporting | [Measurement](references/measurement.md) |
| Google AI search, answer engines, crawler policy, or browser agents | [AI and agentic discovery](references/ai-and-agentic-discovery.md) |
| Broad audit, production launch, domain change, migration, or monitoring | [Audits, launches, and migrations](references/audits-launches-migrations.md) |
| Local business, video, image search, or another vertical | [Site types and search features](references/site-types-and-search-features.md) |

For mixed requests, load the relevant playbooks together. A product launch across languages, for example, needs commerce, international, and technical guidance. A traffic drop needs audit and measurement guidance before a code change.

## Shared workflow

1. Read the repository `AGENTS.md` and the closest scoped guide. Inspect the route, rendered output, and existing helpers before proposing a change.
2. Name the target URL set, page type, locale or market, search surface, and desired outcome. Establish deployment facts from tracked files and user-provided evidence. This repository's demo URL and author are not defaults for a fork. Never read `.env` or infer live configuration from source code.
3. Gather evidence at the failing layer. Source code and local output prove implementation behavior; live HTTP responses prove deployment behavior; Search Console and provider reports show their own observations. A ranking or traffic complaint needs the relevant dated report or URL Inspection result before a causal claim. If production evidence is unavailable, report repository findings as hypotheses and request the specific live evidence needed.
4. For current platform behavior, browse the owning platform's official documentation. Use expert commentary as a hypothesis, not a platform rule. Date durable research notes and cite direct sources. If current guidance cannot be checked, say so.
5. Make the smallest coherent change within scope. Reuse project helpers. When adding a route or locale variant, reconcile its rendered content, canonical, alternates, sitemap, and internal links as one URL set. Update shared documentation when a reusable convention changes.
6. Verify at the layer changed. Run `bun run lint` after TypeScript or TSX edits and `bun run build` after substantive app changes. Inspect representative rendered HTML and live responses where available. Validate structured data against the applicable feature rules. Report local checks separately from production checks.
7. Report evidence, changes, checks, tradeoffs, and the next owner action. Eligibility, validation tools, or implementation alone do not prove indexing, rankings, traffic, or AI citations.

## Project invariants

Apply these rules when changing this template. A fork may have different routes or product decisions; verify them before carrying these defaults forward.

- English is `/`; other configured locales use prefixes, and automatic locale detection is disabled. Use `getLocaleUrl`, `getAlternateLanguages`, and `createLocalizedMetadata` from `src/lib/site.ts` for routes available in every locale. For partially translated or CMS-driven routes, adapt those helpers to accept the real locale and slug map before emitting alternates; do not hardcode URLs at each call site.
- Give each translated, indexable page a real localized route, self-canonical, reciprocal alternate set, and matching sitemap entry. Use only locales whose route exists. Set `lastModified` only from a reliable content date.
- Read language and region tags from `localeConfig`. Add translated message keys to every `dictionary/*.json` file. Treat regional targeting as a market decision, not an automatic result of translation.
- Keep JSON-LD in a Server Component, escape `<` in serialized JSON, and describe only content visible on the page. The existing `WebSite` site-name node belongs on the default-locale domain homepage.
- Check both app robots rules and the deployment layer. A permissive `robots.ts` does not prove the host, CDN, firewall, or authentication layer allows access.
- Change crawler policy only when requested. Search discovery and model-training access are separate owner choices; check each provider's current crawler documentation before editing rules.

## Project references

- [README.md](../../../README.md): template behavior and implementation guide.
- [docs/seo-research.md](../../../docs/seo-research.md): sourced decisions for this deployment. Recheck dated guidance before relying on it.
