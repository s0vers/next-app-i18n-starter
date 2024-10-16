import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Params = {
  locale: string;
};

type Translations = {
  en: {
    Index: {
      boilerplateName: string;
      title: string;
      description: string;
      cloneRepository: string;
      leaveStar: string;
      howToUse: string;
      installation: string;
      howToContribute: string;
      gettingStarted: string;
      omitrtlUsage: string;
      OmitRTLInstruction: string;
      contribute: string;
      installationSteps: {
        cloneRepository: string;
        installDependencies: string;
        startDevServer: string;
      };
      contributeSteps: {
        fork: string;
        createBranch: string;
        commit: string;
        push: string;
        pullRequest: string;
      };
    };
    Footer: {
      copyright: string;
      githubLink: string;
    };
    Metadata: {
      title: string;
      description: string;
    };
  };
  ar: {
    Index: {
      boilerplateName: string;
      description: string;
      title: string;
      cloneRepository: string;
      leaveStar: string;
      howToUse: string;
      gettingStarted: string;
      installation: string;
      howToContribute: string;
      omitrtlUsage: string;
      OmitRTLInstruction: string;
      contribute: string;
      installationSteps: {
        cloneRepository: string;
        installDependencies: string;
        startDevServer: string;
      };
      contributeSteps: {
        fork: string;
        createBranch: string;
        commit: string;
        push: string;
        pullRequest: string;
      };
    };
    Footer: {
      copyright: string;
      githubLink: string;
    };
    Metadata: {
      title: string;
      description: string;
    };
  };
};

const translations: Translations = {
  en: {
    Index: {
      boilerplateName: "Next.js i18n Boilerplate",
      title: "Next.js Boilerplate with i18n and Shadcn UI",
      description:
        "A powerful starting point for your next multilingual, accessible web application.",
      cloneRepository: "Clone Repository",
      leaveStar: "Leave a Star",
      howToUse: "How to Use",
      installation: "Installation",
      howToContribute: "How to Contribute",
      gettingStarted: "Getting Started",
      omitrtlUsage: "OmitRTL Usage",
      OmitRTLInstruction:
        "Wrap components you want to exclude from RTL rendering:",
      contribute: "Contribute",
      installationSteps: {
        cloneRepository: "Clone the repository:",
        installDependencies: "Install dependencies:",
        startDevServer: "Start the development server:",
      },
      contributeSteps: {
        fork: "Fork the repository",
        createBranch: "Create a new branch:",
        commit: "Commit your changes:",
        push: "Push to the branch:",
        pullRequest: "Create a new Pull Request",
      },
    },

    Footer: {
      copyright:
        "© 2024 Next.js i18n Boilerplate. Open source under MIT license.",
      githubLink: "GitHub",
    },
    Metadata: {
      title: "Next.js i18n Boilerplate with Themes",
      description:
        "Modern Next.js starter with i18n, shadcn UI, light/dark themes, and RTL support. Perfect for multilingual, accessible web applications.",
    },
  },
  ar: {
    Index: {
      boilerplateName: "قالب i18n لـ Next.js",
      description: "نقطة انطلاق قوية لتطبيق الويب متعدد اللغات وسهل الوصول.",
      title: "قالب Next.js مع i18n و Shadcn UI",
      cloneRepository: "استنساخ المستودع",
      leaveStar: "اترك نجمة",
      howToUse: "كيفية الاستخدام",
      installation: "التثبيت",
      howToContribute: "كيفية المساهمة",
      gettingStarted: "البدء",
      omitrtlUsage: "استخدام OmitRTL",
      OmitRTLInstruction:
        "قم بتغليف العناصر التي تريد استبعادها من التقديم من اليمين إلى اليسار:",
      contribute: "المساهمة",
      installationSteps: {
        cloneRepository: "استنساخ المستودع:",
        installDependencies: "تثبيت الاعتمادات:",
        startDevServer: "بدء خادم التطوير:",
      },
      contributeSteps: {
        fork: "قم بتقسيم المستودع",
        createBranch: "إنشاء فرع جديد:",
        commit: "تأكيد التغييرات:",
        push: "دفع إلى الفرع:",
        pullRequest: "إنشاء طلب سحب جديد",
      },
    },
    Footer: {
      copyright: "© 2024 قالب i18n لـ Next.js. مفتوح المصدر تحت رخصة MIT.",
      githubLink: "GitHub",
    },
    Metadata: {
      title: "قالب Next.js مع السمات",
      description:
        "قالب Next.js الحديث مع i18n و Shadcn UI وسمات فاتحة وداكنة ودعم RTL. مثالي لتطبيقات الويب متعددة اللغات وسهلة الوصول.",
    },
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { locale } = params;
  const translation = translations[locale as keyof Translations];

  if (!translation) {
    console.error("Invalid locale:", locale);
    return NextResponse.json({ error: "Locale not found" }, { status: 404 });
  }

  return NextResponse.json(translation);
}
