"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Github, Copy, Check, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { ModeToggle } from "../ModeToggle";

import { useTranslations } from "next-intl";
import OmitRTL from "../OmmitRlt";
import LanguageSwitcher from "../LanguageSwitcher";

function CopyableCode({ children }: { children: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    });
  };

  return (
    <div className="relative">
      <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
        <code>{children}</code>
      </pre>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-2 right-2"
        onClick={copyToClipboard}
      >
        <p className="sr-only">Cope code button</p>
        {isCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

export default function HomeIndex() {
  const t = useTranslations("Index");

  const f = useTranslations("Footer");
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    setIsRTL(document.documentElement.dir === "rtl");
  }, []);
  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
        <Link className="flex items-center justify-center" href="#">
          <Globe className="h-6 w-6 m-2 text-primary" />
          <span className="font-bold text-xl">{t("boilerplateName")}</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <LanguageSwitcher />
          <ModeToggle />
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-8 md:py-12 lg:py-20">
          <div className=" px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  {t("title")}
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  {t("description")}
                </p>
              </div>
              <div className="flex justify-center align-middle items-center gap-4 flex-wrap">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 transition-colors duration-200"
                >
                  <Link
                    href="https://github.com/S0vers/next-app-i18n-starter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="m-2 h-5 w-5" />
                    {t("cloneRepository")}
                  </Link>
                </Button>
                <Button asChild size="lg" variant={"outline"}>
                  <Link
                    href="https://github.com/S0vers/next-app-i18n-starter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Star className="m-2 h-5 w-5" />
                    {t("leaveStar")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12">
          <div className="px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              {t("howToUse")}
            </h2>
            <Tabs
              defaultValue="install"
              className="max-w-3xl mx-auto"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="install"
                  className="hover:bg-secondary transition-colors duration-200"
                >
                  {t("installation")}
                </TabsTrigger>
                <TabsTrigger
                  value="omitrtl"
                  className="hover:bg-secondary transition-colors duration-200"
                >
                  {t("omitrtlUsage")}
                </TabsTrigger>
                <TabsTrigger
                  value="contribute"
                  className="hover:bg-secondary transition-colors duration-200"
                >
                  {t("contribute")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="install">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("gettingStarted")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-4">
                        <p>{t("installationSteps.cloneRepository")}</p>
                        <OmitRTL>
                          <CopyableCode>
                            git clone
                            https://github.com/S0vers/next-app-i18n-starter.git
                          </CopyableCode>
                        </OmitRTL>
                      </div>

                      <div className="space-y-4">
                        <p> {t("installationSteps.installDependencies")}</p>
                        <OmitRTL>
                          <CopyableCode>npm install</CopyableCode>
                        </OmitRTL>
                      </div>
                      <div className="space-y-4">
                        <p> {t("installationSteps.startDevServer")}</p>
                        <OmitRTL omitRTL={true}>
                          <CopyableCode>npm run dev</CopyableCode>
                        </OmitRTL>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="omitrtl">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("omitrtlUsage")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{t("OmitRTLInstruction")}</p>
                    <OmitRTL>
                      <CopyableCode>
                        {`import OmitRTL from './OmitRTL';

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
}`}
                      </CopyableCode>
                    </OmitRTL>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="contribute">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("howToContribute")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-4">
                        <p>{t("contributeSteps.fork")}</p>
                      </div>
                      <div className="space-y-4">
                        <p> {t("contributeSteps.createBranch")}</p>
                        <OmitRTL>
                          <CopyableCode>
                            git checkout -b feature/your-feature
                          </CopyableCode>
                        </OmitRTL>
                      </div>
                      <div className="space-y-4">
                        <p> {t("contributeSteps.commit")}</p>
                        <OmitRTL>
                          <CopyableCode>
                            git commit -am &apos;Add some feature&apos;
                          </CopyableCode>
                        </OmitRTL>
                      </div>
                      <div className="space-y-4">
                        <p> {t("contributeSteps.push")}</p>
                        <OmitRTL>
                          <CopyableCode>
                            git push origin feature/your-feature
                          </CopyableCode>
                        </OmitRTL>
                      </div>
                      <div className="space-y-4">
                        <p>{t("contributeSteps.pullRequest")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {f("copyright")}
        </p>
        <nav className=" flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4 hover:text-primary transition-colors duration-200"
            href="https://github.com/S0vers/next-app-i18n-starter"
            target="_blank"
            rel="noopener noreferrer"
          >
            {f("githubLink")}
          </Link>
        </nav>
      </footer>
    </div>
  );
}
