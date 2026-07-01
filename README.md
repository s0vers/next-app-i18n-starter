# Next.js 16 i18n Starter

A modern, SEO-optimized boilerplate for multilingual Next.js applications. Built with **Next.js 16**, **React 19**, **next-intl 4**, and **shadcn/ui**.

**Author:** [Sovers Tonmoy Pandey](https://s0vers.com) (S0vers) · [GitHub](https://github.com/S0vers)

**Live demo:** [next-app-i18n-starter.vercel.app](https://next-app-i18n-starter.vercel.app)

## Features

- **Next.js 16** — App Router, Server Components, `proxy.ts` for i18n routing
- **next-intl 4** — ICU messages, `useFormatter`, locale-driven currency and time zones
- **5 languages** — English, Arabic (RTL), Chinese, Spanish, Japanese
- **Locale-driven formatting** — switch language to change currency, dates, and relative time
- **shadcn/ui** — accessible components with Tailwind CSS 4
- **Theme system** — cookie SSR + client `ThemeProvider` (no blocking scripts)
- **OmitRTL** — keep LTR layout for code, logos, and numbers in RTL locales
- **SEO** — `metadataBase`, hreflang, JSON-LD, dynamic sitemap and robots

## Getting Started

```bash
git clone https://github.com/S0vers/next-app-i18n-starter.git
cd next-app-i18n-starter
bun install
cp .env.example .env.local   # optional: set NEXT_PUBLIC_SITE_URL
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── dictionary/                 # Translation files (en, ar, zh, es, ja)
├── public/
│   ├── llms.txt                # Machine-readable project summary
│   └── og-image.png            # Open Graph image
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx      # Metadata, theme SSR, NextIntlClientProvider
│   │   │   └── page.tsx        # Home page + JSON-LD
│   │   ├── robots.ts           # Dynamic robots.txt
│   │   └── sitemap.ts          # Sitemap with hreflang alternates
│   ├── components/
│   │   ├── LocalizationTab.tsx # Locale formatting demo
│   │   ├── LanguageSwitcher.tsx
│   │   ├── ModeToggle.tsx
│   │   └── theme-provider.tsx
│   ├── i18n/
│   │   ├── request.ts          # getRequestConfig (locale, timeZone, formats)
│   │   ├── routing.ts          # Locales, localePrefix: as-needed
│   │   ├── regional.ts         # Per-locale currency & time zone
│   │   └── navigation.ts       # Localized Link, useRouter, getPathname
│   ├── lib/
│   │   ├── site.ts             # Site URL, author, SEO constants
│   │   └── theme.ts
│   └── proxy.ts                # next-intl proxy (Next.js 16)
├── .env.example
└── next.config.ts
```

## Internationalization

### How locale drives formatting

`src/i18n/request.ts` configures next-intl per request:

```ts
const currency = resolveCurrency(locale);
const timeZone = resolveTimeZone(locale);

return {
  locale,
  timeZone,
  now: new Date(),
  formats: createRegionalFormats(currency),
  messages: (await import(`../../dictionary/${locale}.json`)).default,
};
```

Regional defaults live in `src/i18n/regional.ts`:

| Locale | Currency | Time zone |
|--------|----------|-----------|
| en | USD | America/New_York |
| ar | SAR | Asia/Riyadh |
| zh | CNY | Asia/Shanghai |
| es | EUR | Europe/Madrid |
| ja | JPY | Asia/Tokyo |

Switch language in the header — prices and dates update automatically.

### Routing

`localePrefix: "as-needed"` in `src/i18n/routing.ts`:

- English (default): `/`
- Other locales: `/ar`, `/zh`, `/es`, `/ja`

### Adding a language

1. Add `dictionary/xx.json` (copy from `en.json`)
2. Add locale to `src/i18n/routing.ts`
3. Add regional defaults to `src/i18n/regional.ts`
4. Add label to `LanguageSwitcher.tsx`

## OmitRTL

Wrap elements that must stay LTR in RTL locales:

```tsx
import OmitRTL from "@/components/OmmitRlt";

<OmitRTL omitRTL>
  <code>git clone ...</code>
</OmitRTL>
```

Also available as [react-omit-rtl](https://www.npmjs.com/package/react-omit-rtl).

## SEO

- **Metadata API** — locale-specific titles/descriptions from `dictionary/*/Metadata`
- **metadataBase** — resolved from `NEXT_PUBLIC_SITE_URL`
- **hreflang** — built with `getPathname` from `@/i18n/navigation`
- **JSON-LD** — `WebSite` and `Person` schemas on the home page
- **Sitemap** — `/sitemap.xml` with language alternates
- **Robots** — `/robots.txt` via `src/app/robots.ts`
- **Open Graph** — `/og-image.png` (1200×630)

Set your production URL:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Theme

Theme is stored in a cookie and applied server-side on `<html>` to avoid flash. Client-side `ThemeProvider` syncs toggles. No `<script>` tags in the React tree (React 19 compatible).

## Scripts

```bash
bun dev      # Development server
bun build    # Production build
bun start    # Start production server
bun lint     # ESLint
```

## Contributing

1. Fork the repository
2. Create a branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

MIT © [Sovers Tonmoy Pandey](https://s0vers.com)
