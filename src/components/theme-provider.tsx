"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { type Theme, setThemeCookie } from "@/lib/theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
let restoreTransitions: number | undefined;

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (root.classList.contains(theme)) return;

  if (restoreTransitions !== undefined) cancelAnimationFrame(restoreTransitions);
  root.classList.add("theme-switching");
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
  // Apply the new colors before transitions are restored on the next frame.
  void root.offsetWidth;
  restoreTransitions = requestAnimationFrame(() => {
    root.classList.remove("theme-switching");
    restoreTransitions = undefined;
  });
}

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  useEffect(() => {
    applyTheme(theme);
    setThemeCookie(theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme: setThemeState }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
