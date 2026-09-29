"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
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
  clone: `git clone ${GITHUB_URL}.git`,
  install: "bun install",
  dev: "bun dev",
  branch: "git checkout -b feature/your-feature",
  commit: "git commit -am 'Add some feature'",
  push: "git push origin feature/your-feature",
  omitRTLExample: `import OmitRTL from '@/components/OmmitRlt';

function MyComponent() {
  return (
    <OmitRTL omitRTL>
      <pre>Always LTR content</pre>
    </OmitRTL>
  );
}`,
};

function CopyableCode({ children }: { children: string }) {
  const [copyResult, setCopyResult] = useState<"idle" | "success" | "error">("idle");
  const [animateIcon, setAnimateIcon] = useState(false);
  const copyAttempt = useRef(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = useTranslations("Index");

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    copyAttempt.current += 1;
  }, []);

  async function copy(fromPointer: boolean) {
    const attempt = ++copyAttempt.current;
    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }

    try {
      await navigator.clipboard.writeText(children);
      if (attempt !== copyAttempt.current) return;
      setAnimateIcon(fromPointer);
      setCopyResult("success");
    } catch {
      if (attempt !== copyAttempt.current) return;
      setAnimateIcon(false);
      setCopyResult("error");
    }

    resetTimer.current = setTimeout(() => {
      setCopyResult("idle");
      resetTimer.current = null;
    }, 2000);
  }

  const isCopied = copyResult === "success";

  return (
    <div className="min-w-0">
      <div className="flex min-w-0 items-start rounded-md bg-muted">
        <pre className="code-scroll min-w-0 flex-1 overflow-x-auto px-3 py-4 font-mono text-sm leading-relaxed">
          <code>{children}</code>
        </pre>
        <Button
          variant="outline"
          size="icon"
          className="m-1 size-11 shrink-0"
          onClick={(event) => copy(event.detail > 0)}
          aria-label={isCopied ? t("copied") : t("copyCode")}
        >
          <span className="relative size-4" aria-hidden>
            <Copy
              className={`absolute inset-0 size-4 ${animateIcon ? "transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.25,0.1,0,1)] motion-reduce:transition-none" : ""} ${isCopied ? "scale-50 opacity-0" : "scale-100 opacity-100"}`}
            />
            <Check
              className={`absolute inset-0 size-4 ${animateIcon ? "transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.25,0.1,0,1)] motion-reduce:transition-none" : ""} ${isCopied ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
            />
          </span>
        </Button>
      </div>
      <span className="sr-only" role="status">
        {isCopied ? t("copied") : ""}
      </span>
      {copyResult === "error" && (
        <p className="mt-2 text-sm text-destructive" dir="auto" role="alert">
          {t("copyFailed")}
        </p>
      )}
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
      <p className="text-sm font-medium text-muted-foreground">
        {description}
      </p>
      {omitRTL ? <OmitRTL omitRTL>{block}</OmitRTL> : block}
    </div>
  );
}

export default function HomeIndex({
  starCount,
  guide,
}: {
  starCount: number | null;
  guide: ReactNode;
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
      <header className="w-full shrink-0 border-b bg-background">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex min-h-11 min-w-0 items-center gap-2 text-base font-bold transition-colors duration-150 ease-out motion-reduce:transition-none hover:text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:text-lg"
            aria-label={t("boilerplateName")}
            title={t("boilerplateName")}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
              <Globe className="size-4" aria-hidden />
            </span>
            <span className="truncate">{t("boilerplateName")}</span>
          </Link>
          <nav className="flex shrink-0 gap-1 sm:gap-2" aria-label={t("settings")}>
            <LanguageSwitcher />
            <ModeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-muted/25">
        <div className="container mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-5 xl:gap-14">
            <section className="min-w-0 space-y-6 xl:col-span-2">
              <div className="space-y-4">
                <h1 className="max-w-xl text-3xl font-bold leading-[1.15] tracking-tight text-balance sm:text-4xl xl:text-5xl">
                  {t("title")}
                </h1>
                <p className="max-w-prose leading-relaxed text-pretty text-muted-foreground">
                  {t("description")}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="min-h-11 motion-safe:active:scale-[0.96] motion-safe:focus-visible:active:scale-100" asChild>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubIcon className="size-4" />
                    {t("cloneRepository")}
                  </a>
                </Button>
                <Button variant="outline" className="min-h-11 motion-safe:active:scale-[0.96] motion-safe:focus-visible:active:scale-100" asChild>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Star className="size-4" />
                    <span>{t("leaveStar")}</span>
                    {stars && <span className="tabular-nums opacity-70">· {stars}</span>}
                  </a>
                </Button>
              </div>
            </section>

            <section className="min-w-0 space-y-4 xl:col-span-3">
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-balance">
                {t("howToUse")}
              </h2>

              <Tabs
                defaultValue="install"
                className="w-full"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <TabsList className="grid h-auto w-full grid-cols-2 gap-1 p-1 sm:grid-cols-4">
                  <TabsTrigger className="min-h-11 whitespace-normal text-center leading-tight hover:text-foreground" value="install">{t("installation")}</TabsTrigger>
                  <TabsTrigger className="min-h-11 whitespace-normal text-center leading-tight hover:text-foreground" value="omitrtl">{t("omitrtlUsage")}</TabsTrigger>
                  <TabsTrigger className="min-h-11 whitespace-normal text-center leading-tight hover:text-foreground" value="contribute">{t("contribute")}</TabsTrigger>
                  <TabsTrigger className="min-h-11 whitespace-normal text-center leading-tight hover:text-foreground" value="localization">
                    {t("localization")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="install" className="mt-4">
                  <Card className="gap-5 border-border/80 py-5 shadow-none sm:gap-6 sm:py-6">
                    <CardHeader className="px-4 sm:px-6">
                      <CardTitle>{t("gettingStarted")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 px-4 sm:px-6">
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
                  <Card className="gap-5 border-border/80 py-5 shadow-none sm:gap-6 sm:py-6">
                    <CardHeader className="px-4 sm:px-6">
                      <CardTitle>{t("omitrtlUsage")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-4 sm:px-6">
                      <p className="max-w-prose leading-relaxed text-pretty text-muted-foreground">
                        {t("OmitRTLInstruction")}
                      </p>
                      <OmitRTL>
                        <CopyableCode>{CODE_EXAMPLES.omitRTLExample}</CopyableCode>
                      </OmitRTL>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="contribute" className="mt-4">
                  <Card className="gap-5 border-border/80 py-5 shadow-none sm:gap-6 sm:py-6">
                    <CardHeader className="px-4 sm:px-6">
                      <CardTitle>{t("howToContribute")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-4 sm:px-6">
                      <p className="leading-relaxed text-muted-foreground">
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
                      <p className="leading-relaxed text-muted-foreground">
                        {t("contributeSteps.pullRequest")}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="localization" className="mt-4">
                  <Card className="gap-5 border-border/80 py-5 shadow-none sm:gap-6 sm:py-6">
                    <CardHeader className="px-4 sm:px-6">
                      <CardTitle>{l("title")}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6">
                      <LocalizationTab />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </section>
          </div>
        </div>
        {guide}
      </main>

      <footer className="w-full shrink-0 border-t bg-background">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-2 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>{f("copyright")}</p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 min-w-11 items-center justify-center decoration-from-font [text-underline-position:from-font] [text-decoration-skip-ink:auto] hover:text-primary hover:underline"
          >
            {f("githubLink")}
          </a>
        </div>
      </footer>
    </div>
  );
}
