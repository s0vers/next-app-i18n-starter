# Shared library instructions

The repository-level `AGENTS.md` applies here too.

- Check for an existing helper before adding another one. Keep shared modules focused on behavior used by more than one route or component.
- `src/lib/site.ts` owns `siteConfig`, the validated site origin, localized URL helpers, and `createLocalizedMetadata`. Read the SEO section in `README.md` and `.agents/skills/nextjs-i18n-seo/SKILL.md` before changing these rules.
- Keep production canonical URLs on the configured HTTPS origin. `NEXT_PUBLIC_SITE_URL` must be an origin without a path, query, or fragment; do not hardcode the live domain in application code. Vercel preview builds fall back to their own `VERCEL_URL`. Production and other hosts must set the variable, and the build fails without it.
- Use `getLocaleUrl` and `getAlternateLanguages` to build page URLs. Keep page canonical URLs, `hreflang` alternates, sitemap entries, and social metadata consistent.
- Keep optional Search Console verification server-only. Never add verification tokens or other secrets to source files.
- Run `bun run lint` after TypeScript changes and `bun run build` after substantive application changes.
