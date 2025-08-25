# Next.js 15 Template with i18n and Shadcn UI

A modern, SEO-optimized template for Next.js 15 applications featuring server components, internationalization support, shadcn UI components, and theme switching capabilities. Perfect for building performant, accessible, and multilingual web applications.

## ✨ Features

- **Next.js 15**: Built on the latest [Next.js 15](https://nextjs.org/) React framework with App Router and Server Components for optimal performance
- **SEO Optimization**: Includes metadata API, structured data, and optimized page loading strategies
- **Internationalization**: Full i18n support using middleware-based routing with [next-intl](https://next-intl-docs.vercel.app/)
- **Shadcn UI**: Pre-configured [shadcn UI](https://ui.shadcn.com/) components using the new React Server Components pattern
- **Theme System**: CSS Variables-based theme system with light/dark mode toggle and system preference detection
- **Language Switching**: Seamless switching between languages (including RTL support for Arabic and other RTL languages)
- **OmitRTL Utility**: Helper component to control elements that should maintain LTR (left-to-right) rendering in RTL contexts
- **TypeScript**: Type-safe codebase with TypeScript configuration optimized for Next.js 15
- **Metadata API**: Built-in SEO metadata management using Next.js 15's metadata API

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/S0vers/next-app-i18n-starter.git
```

Install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📋 Project Structure

The project follows Next.js 15's recommended App Router structure with additions for internationalization:

```
├── .next                                 # Next.js build output
├── dictionary                            # i18n translation files
│   ├── ar.json                           # Arabic translations
│   ├── en.json                           # English translations
│   ├── es.json                           # Spanish translations
│   ├── ja.json                           # Japanese translations
│   └── zh.json                           # Chinese translations
├── node_modules                          # Dependencies
├── public                                # Static assets
├── src                                   # Source code
│   ├── app                               # Next.js App Router
│   │   ├── [locale]                      # Dynamic locale routing
│   │   │   ├── page.tsx                  # Home page
│   │   │   ├── error.tsx                 # Error handling
│   │   │   ├── favicon.ico               # Favicon
│   │   │   ├── globals.css               # Global styles
│   │   │   ├── robots.txt                # SEO robots file
│   │   │   └── sitemap.ts                # Dynamic sitemap generation
│   │   └── components                    # Application components
│   │       ├── ui                        # shadcn UI components
│   │       ├── LanguageSwitcher.tsx      # Language toggle component
│   │       ├── ModeToggle.tsx            # Theme toggle component
│   │       ├── OmitRTL.tsx               # RTL handling utility
│   │       └── theme-provider.tsx        # Theme context provider
│   ├── i18n                              # Internationalization utilities
│   │   ├── navigation.ts                 # Localized navigation helpers
│   │   ├── requests.ts                   # i18n-aware API request helpers
│   │   └── routing.ts                    # Locale routing utilities
│   ├── lib                               # Utility functions and shared code
│   │   └── middleware.ts                 # i18n middleware for route handling
│   └── components.json                   # shadcn UI component configuration
├── .eslintrc.json                        # ESLint configuration
├── global.d.ts                           # Global TypeScript declarations
├── LICENSE                               # Project license
├── next-env.d.ts                         # Next.js TypeScript declarations
├── next.config.js                        # Next.js configuration
├── package.json                          # Project dependencies and scripts
├── bun.lock                              # Bun lock file
├── postcss.config.js                     # PostCSS configuration
├── README.md                             # Project documentation
└── tsconfig.json                         # TypeScript configuration
```

## 🌐 Internationalization

This template uses middleware-based i18n routing with Next.js 15. Language files are stored in the `dictionary/` directory.

### Supported Languages

The template currently supports **5 languages**:

- 🇺🇸 **English** (`en`) - Default language
- 🇸🇦 **Arabic** (`ar`) - With RTL support
- 🇨🇳 **Chinese** (`zh`) - Simplified Chinese
- 🇪🇸 **Spanish** (`es`) - European Spanish
- 🇯🇵 **Japanese** (`ja`) - Japanese

### Adding a New Language

1. Create a new JSON file in the `dictionary/` directory (e.g., `fr.json`)
2. Add the language to the supported locales in `src/app/[locale]/layout.tsx` and `src/app/sitemap.ts`
3. Add language option to the `LanguageSwitcher` component

## 🎨 Shadcn UI Components

Shadcn UI components are configured to work with Next.js 15 Server Components. Import them from the `components/ui/` directory:

```jsx
import { Button } from "@/components/ui/button";

export default function Home() {
  return <Button>Click me</Button>;
}
```

## 🔄 OmitRTL Utility

The `OmitRTL` utility helps you control which elements should maintain LTR direction even when the site is in RTL mode.

### How to use the function:

```jsx
import { OmitRTL } from "@/components/OmitRTL";

function MyComponent() {
  return (
    <div>
      <p>This text will follow the website's direction.</p>
      <OmitRTL omitRTL={true}>
        <img src="/logo.png" alt="Logo" />
        <div>
          <h2>This heading and content will always be LTR</h2>
          <p>Regardless of the website's direction.</p>
        </div>
      </OmitRTL>
    </div>
  );
}
```

### NPM Package

If you just need the OmitRTL function, it's also available as an npm package:

```bash
npm i react-omit-rtl
```

```jsx
import React from "react";
import OmitRTL from "react-omit-rtl";

function App() {
  return (
    <OmitRTL omitRTL={true}>
      <p>This text will not have RTL direction.</p>
    </OmitRTL>
  );
}
export default App;
```

## 🔍 SEO Optimization

The template provides comprehensive SEO features with the Next.js 15 Metadata API. All metadata is dynamically generated based on the current locale and stored in the `dictionary/[locale]/Metadata` namespace.

### Complete Metadata Implementation

```jsx
export async function generateMetadata({
  params,
}: {
  params: { locale: string },
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    other: {
      "google-site-verification": "********",
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: DOMAIN,
      siteName: "Next.js i18n Template",
      images: [
        {
          url: `${DOMAIN}/og-image.png`,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${DOMAIN}/og-image.png`],
      creator: "@s0ver5",
    },
    alternates: {
      canonical: DOMAIN,
      languages: {
        en: `${DOMAIN}/en`,
        ar: `${DOMAIN}/ar`,
        zh: `${DOMAIN}/zh`,
        es: `${DOMAIN}/es`,
        ja: `${DOMAIN}/ja`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
```

### Structured Data

Structured data is implemented using react-schemaorg for better search engine understanding:

```jsx
<script
  {...(jsonLdScriptProps <
    WebSite >
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: t("title"),
      description: t("description"),
      url: DOMAIN,
      inLanguage: locale,
    })}
/>
```

### SEO Features Included

- **Dynamic Metadata**: Locale-specific titles, descriptions, and keywords
- **OpenGraph Tags**: Optimized for social media sharing across all platforms
- **Twitter Cards**: Enhanced Twitter sharing with large image support
- **Canonical URLs**: Prevents duplicate content issues
- **Hreflang Tags**: Proper language targeting for all 5 supported languages
- **Robots Directives**: Comprehensive search engine crawling instructions
- **Google Site Verification**: Ready for Google Search Console integration
- **Dynamic Sitemap**: Automatically generated sitemap.xml
- **Robots.txt**: Properly configured with sitemap reference
- **Structured Data**: Schema.org markup for better search understanding

### Language-Specific SEO

Each language version includes:

- Proper HTML `lang` attribute
- RTL support for Arabic (`dir="rtl"`)
- Locale-specific metadata from translation files
- Proper hreflang implementation
- Language-specific OpenGraph locale tags

These features work together to help search engines better understand, index, and display your content to potential visitors across different languages and regions.

## 🤝 Contributing

We welcome contributions to improve this template! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
