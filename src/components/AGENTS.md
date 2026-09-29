# Component instructions

The repository-level `AGENTS.md` applies here too.

- Keep components in the existing structure: page compositions in `src/components/pages/`, shared feature components in `src/components/`, and reusable shadcn primitives in `src/components/ui/`.
- Components are Server Components by default. Add `"use client"` only when a component needs state, effects, event handlers, or browser APIs. Keep data loading and static composition on the server where practical.
- Use Tailwind CSS 4 utilities and `cn()` from `@/lib/utils`. Reuse the CSS theme variables in `src/app/globals.css` and existing shadcn variants before adding new styling systems.
- Preserve keyboard access, visible focus, labels, and usable touch targets when changing controls. Prefer semantic HTML and native browser behavior.
- The document direction is set by the locale layout. Use direction-aware layout and spacing; wrap code, URLs, and other intentionally left-to-right content with `OmitRTL` from `@/components/OmmitRlt` when needed.
- Theme state uses the cookie-based SSR helpers in `src/lib/theme.ts`, `ThemeProvider`, and `ModeToggle`. Extend that flow instead of adding a second theme system or a flash-prevention script.
- Use the installed `lucide-react` icons. Add shadcn components through the project's configured aliases and conventions.
- Run `bun run lint` after component changes and `bun run build` after substantive UI or application changes.
