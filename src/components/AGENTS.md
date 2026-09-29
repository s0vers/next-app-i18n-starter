# Component instructions

The repository-level `AGENTS.md` applies here too.

- The locale layout renders the skip link, `SiteHeader`, `<main id="main">`, and `SiteFooter` around every page, including the 404 and error pages. A page component renders only its own content, never a second header, footer, or `<main>`.
- Keep components in the existing structure: page compositions in `src/components/pages/`, shared feature components in `src/components/`, and reusable shadcn primitives in `src/components/ui/`.
- Components are Server Components by default. Add `"use client"` only when a component needs state, effects, event handlers, or browser APIs. Keep data loading and static composition on the server where practical.
- Use Tailwind CSS 4 utilities and `cn()` from `@/lib/utils`. Reuse the CSS theme variables in `src/app/globals.css` and existing shadcn variants before adding new styling systems.
- Preserve keyboard access, visible focus, labels, and usable touch targets when changing controls. Prefer semantic HTML and native browser behavior.
- The document direction is set by the locale layout, and a `DirectionProvider` there feeds Radix menus and tabs, so do not pass `dir` to them. Use logical utilities (`ps-*`, `pe-*`, `start-*`, `ms-*`). Wrap code and URLs with `OmitRTL` from `@/components/OmitRtl`. Do not use it on formatted numbers, prices, or dates: give those `dir="auto"` so `Intl` output keeps its native order.
- Headings take `tracking-(--tracking-heading)` and `leading-(--leading-heading)`, not `tracking-tight`. `globals.css` zeroes both per script, because negative letter-spacing breaks Arabic joins and crowds CJK.
- Animate the `scale` property with `transition-[...,scale]`. Tailwind 4 compiles `scale-*` to `scale`, which `transition-[transform]` does not cover.
- Theme state uses the cookie-based SSR helpers in `src/lib/theme.ts`, `ThemeProvider`, and `ModeToggle`. Extend that flow instead of adding a second theme system or a flash-prevention script.
- Use the installed `lucide-react` icons. Add shadcn components through the project's configured aliases and conventions.
- Run `bun run lint` after component changes and `bun run build` after substantive UI or application changes.
