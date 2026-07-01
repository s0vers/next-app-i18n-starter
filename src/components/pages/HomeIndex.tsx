"use client";

import NextLink from "next/link";
import { useCallback, useState } from "react";
import { Check, Copy, Globe, Star } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import LanguageSwitcher from "../LanguageSwitcher";
import LocalizationTab from "../LocalizationTab";
import { ModeToggle } from "../ModeToggle";
import OmitRTL from "../OmmitRlt";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const GITHUB_URL = siteConfig.github;

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const CODE_EXAMPLES = {
  clone: "git clone https://github.com/S0vers/next-app-i18n-starter.git",
  install: "bun install",
  dev: "bun dev",
  branch: "git checkout -b feature/your-feature",
  commit: "git commit -am 'Add some feature'",
  push: "git push origin feature/your-feature",
  omitRTLExample: `import OmitRTL from './OmitRTL';

function MyComponent() {
  return (
    <OmitRTL omitRTL={true}>
      <pre>Always LTR content</pre>
    </OmitRTL>
  );
}`,
};

function CopyableCode({ children }: { children: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(children);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [children]);

  return (
    <div className="relative group">
      <pre className="overflow-x-auto rounded bg-muted p-2 font-mono text-xs sm:p-3 sm:text-sm">
        <code>{children}</code>
      </pre>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1 right-1 h-7 w-7 sm:top-2 sm:right-2"
        onClick={copy}
        aria-label="Copy code"
      >
        {isCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

function InstallationStep({
  description,
  code,
  omitRTL = false,
}: {
  description: string;
  code: string;
  omitRTL?: boolean;
}) {
  const block = <CopyableCode>{code}</CopyableCode>;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground sm:text-sm">
        {description}
      </p>
      {omitRTL ? <OmitRTL omitRTL>{block}</OmitRTL> : block}
    </div>
  );
}

export default function HomeIndex({
  starCount,
}: {
  starCount: number | null;
}) {
  const t = useTranslations("Index");
  const l = useTranslations("Localization");
  const f = useTranslations("Footer");
  const locale = useLocale();
  const format = useFormatter();
  const isRTL = locale === "ar";

  const stars =
    starCount !== null ? format.number(starCount, "compact") : null;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="w-full shrink-0 border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg hover:text-primary"
            aria-label="Home"
          >
            <Globe className="h-5 w-5 text-primary" />
            {t("boilerplateName")}
          </Link>
          <nav className="flex gap-2 sm:gap-3">
            <LanguageSwitcher />
            <ModeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-5">
            <section className="space-y-6 xl:col-span-2">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl xl:text-5xl">
                  {t("title")}
                </h1>
                <p className="max-w-xl text-muted-foreground">
                  {t("description")}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <NextLink
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubIcon className="mr-2 h-4 w-4" />
                    {t("cloneRepository")}
                  </NextLink>
                </Button>
                <Button variant="outline" asChild>
                  <NextLink
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    {stars ? `${t("leaveStar")} · ${stars}` : t("leaveStar")}
                  </NextLink>
                </Button>
              </div>
            </section>

            <section className="space-y-4 xl:col-span-3">
              <h2 className="text-2xl font-bold tracking-tight">
                {t("howToUse")}
              </h2>

              <Tabs
                defaultValue="install"
                className="w-full"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                  <TabsTrigger value="install">{t("installation")}</TabsTrigger>
                  <TabsTrigger value="omitrtl">{t("omitrtlUsage")}</TabsTrigger>
                  <TabsTrigger value="contribute">{t("contribute")}</TabsTrigger>
                  <TabsTrigger value="localization">
                    {t("localization")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="install" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("gettingStarted")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <InstallationStep
                        description={t("installationSteps.cloneRepository")}
                        code={CODE_EXAMPLES.clone}
                        omitRTL
                      />
                      <InstallationStep
                        description={t("installationSteps.installDependencies")}
                        code={CODE_EXAMPLES.install}
                        omitRTL
                      />
                      <InstallationStep
                        description={t("installationSteps.startDevServer")}
                        code={CODE_EXAMPLES.dev}
                        omitRTL
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="omitrtl" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("omitrtlUsage")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {t("OmitRTLInstruction")}
                      </p>
                      <OmitRTL>
                        <CopyableCode>{CODE_EXAMPLES.omitRTLExample}</CopyableCode>
                      </OmitRTL>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="contribute" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("howToContribute")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("contributeSteps.fork")}
                      </p>
                      <InstallationStep
                        description={t("contributeSteps.createBranch")}
                        code={CODE_EXAMPLES.branch}
                        omitRTL
                      />
                      <InstallationStep
                        description={t("contributeSteps.commit")}
                        code={CODE_EXAMPLES.commit}
                        omitRTL
                      />
                      <InstallationStep
                        description={t("contributeSteps.push")}
                        code={CODE_EXAMPLES.push}
                        omitRTL
                      />
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("contributeSteps.pullRequest")}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="localization" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{l("title")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LocalizationTab />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </section>
          </div>
        </div>
      </main>

      <footer className="w-full shrink-0 border-t bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>{f("copyright")}</p>
          <NextLink
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary hover:underline underline-offset-4"
          >
            {f("githubLink")}
          </NextLink>
        </div>
      </footer>
    </div>
  );
}
