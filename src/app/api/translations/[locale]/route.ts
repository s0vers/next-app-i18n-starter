// /app/api/translations/[locale]/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Params = {
  locale: string;
};

type Translations = {
  en: {
    Index: { title: string };
    Metadata: { title: string; description: string };
  };
  ar: {
    Index: { title: string };
    Metadata: { title: string; description: string };
  };
};

const translations: Translations = {
  en: {
    Index: { title: "Hello world!" },
    Metadata: {
      title: "Simple BoilerPlate",
      description:
        "Simple BoilerPlate for language switcher and theme switcher",
    },
  },
  ar: {
    Index: { title: "مرحبا بالعالم!" },
    Metadata: {
      title: "قالب بسيط",
      description: "قالب بسيط لمفتاح تبديل اللغة ومفتاح تبديل السمة",
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
