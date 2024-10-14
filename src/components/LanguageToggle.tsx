"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const LocalSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    // Check cookies for saved language preference (NEXT_LOCALE)
    const savedLanguage =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("NEXT_LOCALE="))
        ?.split("=")[1] || "en";
    setCurrentLanguage(savedLanguage);

    // Set initial language based on URL
    const urlLanguage = pathname.split("/")[1];
    if (urlLanguage === "en" || urlLanguage === "ar") {
      setCurrentLanguage(urlLanguage);
    }
  }, [pathname]);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "ar" : "en";
    setCurrentLanguage(newLanguage);

    // Set the NEXT_LOCALE cookie
    document.cookie = `NEXT_LOCALE=${newLanguage}; path=/;`;

    // Preserve the full path structure when changing languages
    const segments = pathname.split("/");
    if (segments[1] === "en" || segments[1] === "ar") {
      segments[1] = newLanguage;
    } else {
      segments.splice(1, 0, newLanguage);
    }
    const newPath = segments.join("/");

    // Refresh the page by navigating to the new path
    router.push(newPath);
    router.refresh(); // Forces a page reload to apply the new language
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleLanguage} className="">
      {currentLanguage === "ar" ? "EN" : "عر"}
      <span className="sr-only">Toggle language</span>
    </Button>
  );
};

export default LocalSwitcher;
