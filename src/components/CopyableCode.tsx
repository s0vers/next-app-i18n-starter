"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "./ui/button";

// Client Component: it needs state, a timer, and the clipboard API. Everything
// around it on the page renders on the server.
export default function CopyableCode({ children }: { children: string }) {
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
