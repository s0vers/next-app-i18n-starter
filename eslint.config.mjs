import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // These imports work but skip the locale prefix, or use an API this
    // template replaced. Each message says what to import instead.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "next/link",
              message: 'Import Link from "@/i18n/navigation" so links keep the locale.',
            },
            {
              name: "next/navigation",
              importNames: ["redirect", "permanentRedirect", "usePathname", "useRouter"],
              message: 'Import this from "@/i18n/navigation" so it is locale-aware. notFound() may stay in next/navigation.',
            },
            {
              name: "next-intl/server",
              importNames: ["setRequestLocale"],
              message: "The locale comes from next/root-params in src/i18n/request.ts. setRequestLocale is deprecated.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
