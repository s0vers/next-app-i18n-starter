import type { ReactNode } from "react";
import { Star } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { siteConfig } from "@/lib/site";
import CopyableCode from "../CopyableCode";
import LocalizationTab from "../LocalizationTab";
import OmitRTL from "../OmitRtl";
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
  dev: "bun run dev",
  branch: "git checkout -b feature/your-feature",
  commit: "git commit -am 'Add some feature'",
  push: "git push origin feature/your-feature",
  omitRTLExample: `import OmitRTL from '@/components/OmitRtl';

function MyComponent() {
  return (
    <OmitRTL omitRTL>
      <pre>Left-to-right content</pre>
    </OmitRTL>
  );
}`,
};

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
  const format = useFormatter();

  const stars =
    starCount !== null ? format.number(starCount, "compact") : null;

  return (
    <>
      <div className="container mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-5 xl:gap-14">
          <section className="min-w-0 space-y-6 xl:col-span-2">
            <div className="space-y-4">
              <h1 className="max-w-xl text-3xl font-bold leading-(--leading-heading) tracking-(--tracking-heading) text-balance sm:text-4xl xl:text-5xl">
                {t("title")}
              </h1>
              <p className="max-w-prose leading-relaxed text-pretty text-muted-foreground">
                {t("description")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="min-h-11 motion-safe:active:scale-96 motion-safe:focus-visible:active:scale-100" asChild>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon className="size-4" />
                  {t("cloneRepository")}
                </a>
              </Button>
              <Button variant="outline" className="min-h-11 motion-safe:active:scale-96 motion-safe:focus-visible:active:scale-100" asChild>
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
            <h2 className="text-2xl font-bold leading-(--leading-heading) tracking-(--tracking-heading) text-balance">
              {t("howToUse")}
            </h2>

            <Tabs defaultValue="install" className="w-full">
              <TabsList aria-label={t("howToUse")} className="grid h-auto w-full grid-cols-2 gap-1 p-1 sm:grid-cols-4">
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
    </>
  );
}
