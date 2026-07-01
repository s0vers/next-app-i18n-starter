"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  type ResolvedTheme,
  type Theme,
  setThemeCookie,
  THEME_STORAGE_KEY,
} from "@/lib/theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribeToSystemTheme(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function readStoredTheme(initialTheme: Theme): Theme {
  if (typeof window === "undefined") {
    return initialTheme;
  }
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return initialTheme;
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(resolved);
}

type ThemeProviderProps = {
  children: ReactNode;
  initialTheme: Theme;
  defaultTheme?: ResolvedTheme;
  enableSystem?: boolean;
};

export function ThemeProvider({
  children,
  initialTheme,
  defaultTheme = "dark",
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() =>
    readStoredTheme(initialTheme),
  );

  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme,
    () => defaultTheme,
  );

  const resolvedTheme = useMemo((): ResolvedTheme => {
    const active =
      theme === "system" && !enableSystem ? defaultTheme : theme;
    if (active === "system") {
      return systemTheme;
    }
    return active;
  }, [theme, defaultTheme, enableSystem, systemTheme]);

  useEffect(() => {
    applyTheme(resolvedTheme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    setThemeCookie(theme);
  }, [theme, resolvedTheme]);

  const setTheme = useCallback((value: Theme) => {
    setThemeState(value);
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, resolvedTheme }),
    [theme, setTheme, resolvedTheme],
  );

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
