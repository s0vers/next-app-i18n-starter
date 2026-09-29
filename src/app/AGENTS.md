# App Router instructions

The repository-level `AGENTS.md` applies here too.

- Put user-facing pages under `src/app/[locale]/`. Keep root metadata routes such as `robots.ts` and `sitemap.ts` at `src/app/`.
- In Next.js 16, route `params` and `searchParams` are promises. Await them before reading values.
- Validate locale route params with `hasLocale(routing.locales, locale)` and call `notFound()` for unsupported locales.
- Call `setRequestLocale(locale)` in locale Server Components that use translations or need static rendering. Load server translations with `getTranslations({ locale, namespace })`.
- Use `generateStaticParams` from the supported routing configuration when enumerating locale routes. Keep catch-all invalid routes returning `notFound()`.
- For page metadata, load translated title and description and call `createLocalizedMetadata` from `@/lib/site` with the page's actual localized route. Do not inherit the homepage canonical for a child page.
- Add every indexable localized page variant to `src/app/sitemap.ts`, and give each translation a matching canonical and reciprocal alternate map. Include only locale variants that actually exist. Include `lastModified` only when an actual content timestamp is available.
- Keep `robots.ts` aligned with the deployment's crawler policy and sitemap origin. App rules do not override hosting, CDN, firewall, or authentication restrictions.
- Render JSON-LD in a Server Component, match it to visible content, and serialize safely with `JSON.stringify(data).replace(/</g, "\\u003c")`.
- Update `README.md` when changing route or SEO conventions. See its SEO section and `.agents/skills/nextjs-i18n-seo/SKILL.md` before changing the shared SEO design.
