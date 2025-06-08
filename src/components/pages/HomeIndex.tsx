"use client";
import Link from "next/link";
import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Github, Copy, Check, Star } from "lucide-react";
import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { ModeToggle } from "../ModeToggle";
import { useTranslations } from "next-intl";
import OmitRTL from "../OmmitRlt";
import LanguageSwitcher from "../LanguageSwitcher";

// Responsive CopyableCode component
const CopyableCode = memo(function CopyableCode({
  children,
}: {
  children: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(children).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [children]);

  const iconVariants = useMemo(
    () => ({
      initial: { scale: 0, rotate: 180 },
      animate: { scale: 1, rotate: 0 },
      exit: { scale: 0, rotate: -180 },
      transition: { duration: 0.2 },
    }),
    []
  );

  const checkVariants = useMemo(
    () => ({
      initial: { scale: 0, rotate: -180 },
      animate: { scale: 1, rotate: 0 },
      exit: { scale: 0, rotate: 180 },
      transition: { duration: 0.2 },
    }),
    []
  );

  return (
    <motion.div
      className="relative group"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <pre className="bg-gray-100 dark:bg-gray-700 p-2 sm:p-3 rounded text-xs sm:text-sm overflow-x-auto transition-all duration-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-600">
        <code className="font-mono">{children}</code>
      </pre>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-1 right-1 sm:top-2 sm:right-2"
      >
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 sm:h-7 sm:w-7 backdrop-blur-sm bg-background/80 border-border/50 hover:bg-background/90 transition-all duration-200"
          onClick={copyToClipboard}
        >
          <span className="sr-only">Copy code button</span>
          <AnimatePresence mode="wait" initial={false}>
            {isCopied ? (
              <motion.div key="check-icon" {...checkVariants}>
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
              </motion.div>
            ) : (
              <motion.div key="copy-icon" {...iconVariants}>
                <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </motion.div>
  );
});

// Responsive InstallationStep component
const InstallationStep = memo(function InstallationStep({
  description,
  code,
  delay = 0,
  omitRTL = false,
}: {
  description: string;
  code: string;
  delay?: number;
  omitRTL?: boolean;
}) {
  const stepVariants = useMemo(
    () => ({
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { delay },
    }),
    [delay]
  );

  return (
    <motion.div className="space-y-1 sm:space-y-2" {...stepVariants}>
      <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed">
        {description}
      </p>
      <OmitRTL omitRTL={omitRTL}>
        <CopyableCode>{code}</CopyableCode>
      </OmitRTL>
    </motion.div>
  );
});

// Responsive TabCard component
const TabCard = memo(function TabCard({
  title,
  children,
  contentKey,
}: {
  title: string;
  children: React.ReactNode;
  contentKey: string;
}) {
  const cardVariants = useMemo(
    () => ({
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
      transition: { duration: 0.2 },
    }),
    []
  );

  return (
    <motion.div key={contentKey} {...cardVariants}>
      <Card className="border-border/50 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-sm sm:text-base font-semibold">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3 sm:space-y-4">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default function HomeIndex() {
  const t = useTranslations("Index");
  const f = useTranslations("Footer");
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    setIsRTL(document.documentElement.dir === "rtl");
  }, []);

  useEffect(() => {
    // Prevent scroll during initial render
    document.documentElement.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    // Remove overflow-hidden after initial animations complete
    const timer = setTimeout(() => {
      document.documentElement.style.overflow = "auto";
    }, 1000); // Adjust timing based on your longest animation delay

    return () => {
      clearTimeout(timer);
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  // Memoize animation variants
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
          delayChildren: 0.1,
        },
      },
    }),
    []
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          ease: "easeOut",
        },
      },
    }),
    []
  );

  // Memoize translations
  const translations = useMemo(
    () => ({
      boilerplateName: t("boilerplateName"),
      title: t("title"),
      description: t("description"),
      cloneRepository: t("cloneRepository"),
      leaveStar: t("leaveStar"),
      howToUse: t("howToUse"),
      installation: t("installation"),
      omitrtlUsage: t("omitrtlUsage"),
      contribute: t("contribute"),
      gettingStarted: t("gettingStarted"),
      howToContribute: t("howToContribute"),
      OmitRTLInstruction: t("OmitRTLInstruction"),
      installationSteps: {
        cloneRepository: t("installationSteps.cloneRepository"),
        installDependencies: t("installationSteps.installDependencies"),
        startDevServer: t("installationSteps.startDevServer"),
      },
      contributeSteps: {
        fork: t("contributeSteps.fork"),
        createBranch: t("contributeSteps.createBranch"),
        commit: t("contributeSteps.commit"),
        push: t("contributeSteps.push"),
        pullRequest: t("contributeSteps.pullRequest"),
      },
    }),
    [t]
  );

  const footerTranslations = useMemo(
    () => ({
      copyright: f("copyright"),
      githubLink: f("githubLink"),
    }),
    [f]
  );

  // Memoize constants
  const githubUrl = useMemo(
    () => "https://github.com/S0vers/next-app-i18n-starter",
    []
  );

  const codeExamples = useMemo(
    () => ({
      clone: "git clone https://github.com/S0vers/next-app-i18n-starter.git",
      install: "npm install",
      dev: "npm run dev",
      branch: "git checkout -b feature/your-feature",
      commit: "git commit -am 'Add some feature'",
      push: "git push origin feature/your-feature",
      omitRTLExample: `import OmitRTL from './OmitRTL';

function MyComponent() {
  return (
    <div>
      <p>This text follows the website's direction.</p>
      <OmitRTL omitRTL={true}>
        <img src="/logo.png" alt="Logo" />
        <div>
          <h2>This content is always LTR</h2>
          <p>Regardless of website direction.</p>
        </div>
      </OmitRTL>
    </div>
  );
}`,
    }),
    []
  );

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Responsive Header with container constraints */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full border-b backdrop-blur-sm bg-background/95 flex-shrink-0"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-12 sm:h-14 lg:h-16 flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link className="flex items-center justify-center group" href="#">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Globe className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary" />
                </motion.div>
                <span className="font-bold text-base sm:text-lg lg:text-xl group-hover:text-primary transition-colors duration-300">
                  {translations.boilerplateName}
                </span>
              </Link>
            </motion.div>
            <nav className="flex gap-2 sm:gap-3 lg:gap-4">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <LanguageSwitcher />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <ModeToggle />
              </motion.div>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content with responsive container and ultrawide optimization */}
      <main className="flex-1 w-full overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full max-h-screen">
          {/* Responsive grid layout */}
          <div className="h-full py-4 sm:py-6 lg:py-8">
            {/* Mobile and Tablet Layout (< lg) */}
            <div className="lg:hidden space-y-6 sm:space-y-8">
              {/* Hero Section - Mobile/Tablet */}
              <motion.div
                className="text-center space-y-4 sm:space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="space-y-3 sm:space-y-4"
                  variants={itemVariants}
                >
                  <motion.h1
                    className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    {translations.title}
                  </motion.h1>
                  <motion.p
                    className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {translations.description}
                  </motion.p>
                </motion.div>

                <motion.div
                  className="flex justify-center gap-3 sm:gap-4 flex-wrap"
                  variants={itemVariants}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      asChild
                      size="sm"
                      className="sm:size-default bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Link
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        <span className="hidden xs:inline">
                          {translations.cloneRepository}
                        </span>
                        <span className="xs:hidden">Clone</span>
                      </Link>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="sm:size-default transition-all duration-300 hover:shadow-md"
                    >
                      <Link
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Star className="mr-2 h-4 w-4" />
                        <span className="hidden xs:inline">
                          {translations.leaveStar}
                        </span>
                        <span className="xs:hidden">Star</span>
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Tabs Section - Mobile/Tablet */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.h2
                  className="text-xl sm:text-2xl font-bold tracking-tight text-center mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  {translations.howToUse}
                </motion.h2>

                <Tabs
                  defaultValue="install"
                  className="w-full"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <TabsList className="grid w-full grid-cols-3 bg-muted/50 backdrop-blur-sm mb-4">
                    <TabsTrigger
                      value="install"
                      className="text-xs sm:text-sm transition-all duration-300 hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      {translations.installation}
                    </TabsTrigger>
                    <TabsTrigger
                      value="omitrtl"
                      className="text-xs sm:text-sm transition-all duration-300 hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      {translations.omitrtlUsage}
                    </TabsTrigger>
                    <TabsTrigger
                      value="contribute"
                      className="text-xs sm:text-sm transition-all duration-300 hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      {translations.contribute}
                    </TabsTrigger>
                  </TabsList>

                  <AnimatePresence mode="wait" initial={false}>
                    <TabsContent
                      value="install"
                      key="install-tab"
                      className="mt-0"
                    >
                      <TabCard
                        title={translations.gettingStarted}
                        contentKey="install-content"
                      >
                        <div className="space-y-3 sm:space-y-4">
                          <InstallationStep
                            description={
                              translations.installationSteps.cloneRepository
                            }
                            code={codeExamples.clone}
                            delay={0.05}
                          />
                          <InstallationStep
                            description={
                              translations.installationSteps.installDependencies
                            }
                            code={codeExamples.install}
                            delay={0.1}
                          />
                          <InstallationStep
                            description={
                              translations.installationSteps.startDevServer
                            }
                            code={codeExamples.dev}
                            delay={0.15}
                            omitRTL={true}
                          />
                        </div>
                      </TabCard>
                    </TabsContent>

                    <TabsContent
                      value="omitrtl"
                      key="omitrtl-tab"
                      className="mt-0"
                    >
                      <TabCard
                        title={translations.omitrtlUsage}
                        contentKey="omitrtl-content"
                      >
                        <div className="space-y-3 sm:space-y-4">
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {translations.OmitRTLInstruction}
                          </p>
                          <OmitRTL>
                            <CopyableCode>
                              {codeExamples.omitRTLExample}
                            </CopyableCode>
                          </OmitRTL>
                        </div>
                      </TabCard>
                    </TabsContent>

                    <TabsContent
                      value="contribute"
                      key="contribute-tab"
                      className="mt-0"
                    >
                      <TabCard
                        title={translations.howToContribute}
                        contentKey="contribute-content"
                      >
                        <div className="space-y-3 sm:space-y-4">
                          <motion.div
                            className="space-y-1 sm:space-y-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 }}
                          >
                            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                              {translations.contributeSteps.fork}
                            </p>
                          </motion.div>

                          <InstallationStep
                            description={
                              translations.contributeSteps.createBranch
                            }
                            code={codeExamples.branch}
                            delay={0.1}
                          />

                          <InstallationStep
                            description={translations.contributeSteps.commit}
                            code={codeExamples.commit}
                            delay={0.15}
                          />

                          <InstallationStep
                            description={translations.contributeSteps.push}
                            code={codeExamples.push}
                            delay={0.2}
                          />

                          <motion.div
                            className="space-y-1 sm:space-y-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 }}
                          >
                            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                              {translations.contributeSteps.pullRequest}
                            </p>
                          </motion.div>
                        </div>
                      </TabCard>
                    </TabsContent>
                  </AnimatePresence>
                </Tabs>
              </motion.div>
            </div>

            {/* Desktop and Ultrawide Layout (>= lg) */}
            <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-5 2xl:grid-cols-7 gap-6 xl:gap-8 h-full">
              {/* Hero Section - Desktop/Ultrawide */}
              <motion.div
                className="lg:col-span-1 xl:col-span-2 2xl:col-span-3 flex flex-col justify-center space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="space-y-4 text-left"
                  variants={itemVariants}
                >
                  <motion.h1
                    className="text-3xl xl:text-4xl 2xl:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    {translations.title}
                  </motion.h1>
                  <motion.p
                    className="text-base xl:text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {translations.description}
                  </motion.p>
                </motion.div>

                <motion.div
                  className="flex gap-4 flex-wrap"
                  variants={itemVariants}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      asChild
                      className="bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Link
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        {translations.cloneRepository}
                      </Link>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      asChild
                      variant="outline"
                      className="transition-all duration-300 hover:shadow-md"
                    >
                      <Link
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Star className="mr-2 h-4 w-4" />
                        {translations.leaveStar}
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Tabs Section - Desktop/Ultrawide */}
              <motion.div
                className="lg:col-span-1 xl:col-span-3 2xl:col-span-4 flex flex-col"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.h2
                  className="text-2xl xl:text-3xl font-bold tracking-tight text-left mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  {translations.howToUse}
                </motion.h2>

                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <Tabs
                    defaultValue="install"
                    className="h-full flex flex-col"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    <TabsList className="grid w-full grid-cols-3 bg-muted/50 backdrop-blur-sm mb-4 h-12">
                      <TabsTrigger
                        value="install"
                        className="text-sm transition-all duration-300 hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                      >
                        {translations.installation}
                      </TabsTrigger>
                      <TabsTrigger
                        value="omitrtl"
                        className="text-sm transition-all duration-300 hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                      >
                        {translations.omitrtlUsage}
                      </TabsTrigger>
                      <TabsTrigger
                        value="contribute"
                        className="text-sm transition-all duration-300 hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                      >
                        {translations.contribute}
                      </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-hidden">
                      <AnimatePresence mode="wait" initial={false}>
                        <TabsContent
                          value="install"
                          key="install-tab"
                          className="h-full mt-0"
                        >
                          <TabCard
                            title={translations.gettingStarted}
                            contentKey="install-content"
                          >
                            <div className="space-y-4">
                              <InstallationStep
                                description={
                                  translations.installationSteps.cloneRepository
                                }
                                code={codeExamples.clone}
                                delay={0.05}
                              />
                              <InstallationStep
                                description={
                                  translations.installationSteps
                                    .installDependencies
                                }
                                code={codeExamples.install}
                                delay={0.1}
                              />
                              <InstallationStep
                                description={
                                  translations.installationSteps.startDevServer
                                }
                                code={codeExamples.dev}
                                delay={0.15}
                                omitRTL={true}
                              />
                            </div>
                          </TabCard>
                        </TabsContent>

                        <TabsContent
                          value="omitrtl"
                          key="omitrtl-tab"
                          className="h-full mt-0"
                        >
                          <TabCard
                            title={translations.omitrtlUsage}
                            contentKey="omitrtl-content"
                          >
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {translations.OmitRTLInstruction}
                              </p>
                              <OmitRTL>
                                <CopyableCode>
                                  {codeExamples.omitRTLExample}
                                </CopyableCode>
                              </OmitRTL>
                            </div>
                          </TabCard>
                        </TabsContent>

                        <TabsContent
                          value="contribute"
                          key="contribute-tab"
                          className="h-full mt-0"
                        >
                          <TabCard
                            title={translations.howToContribute}
                            contentKey="contribute-content"
                          >
                            <div className="space-y-4">
                              <motion.div
                                className="space-y-2"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 }}
                              >
                                <p className="text-sm font-medium text-muted-foreground">
                                  {translations.contributeSteps.fork}
                                </p>
                              </motion.div>

                              <InstallationStep
                                description={
                                  translations.contributeSteps.createBranch
                                }
                                code={codeExamples.branch}
                                delay={0.1}
                              />

                              <InstallationStep
                                description={
                                  translations.contributeSteps.commit
                                }
                                code={codeExamples.commit}
                                delay={0.15}
                              />

                              <InstallationStep
                                description={translations.contributeSteps.push}
                                code={codeExamples.push}
                                delay={0.2}
                              />

                              <motion.div
                                className="space-y-2"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.25 }}
                              >
                                <p className="text-sm font-medium text-muted-foreground">
                                  {translations.contributeSteps.pullRequest}
                                </p>
                              </motion.div>
                            </div>
                          </TabCard>
                        </TabsContent>
                      </AnimatePresence>
                    </div>
                  </Tabs>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Responsive Footer */}
      <motion.footer
        className="w-full border-t backdrop-blur-sm bg-background/95 flex-shrink-0"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row py-3 sm:py-4 items-center justify-between gap-2">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {footerTranslations.copyright}
            </p>
            <nav>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  className="text-xs sm:text-sm hover:underline underline-offset-4 hover:text-primary transition-all duration-300"
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {footerTranslations.githubLink}
                </Link>
              </motion.div>
            </nav>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
