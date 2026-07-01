export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export function isTheme(value: string | undefined): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

/** Server-side: resolve cookie to a concrete class for `<html>`. */
export function resolveSSRTheme(
  cookieValue: string | undefined,
  defaultTheme: ResolvedTheme = "dark",
): ResolvedTheme {
  if (cookieValue === "light" || cookieValue === "dark") {
    return cookieValue;
  }
  return defaultTheme;
}

export function setThemeCookie(theme: Theme) {
  document.cookie = `${THEME_STORAGE_KEY}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}
