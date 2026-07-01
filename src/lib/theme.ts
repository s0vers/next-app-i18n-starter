export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

export function isTheme(value: string | undefined): value is Theme {
  return value === "light" || value === "dark";
}

export function resolveSSRTheme(
  cookieValue: string | undefined,
  defaultTheme: Theme = "dark",
): Theme {
  return cookieValue === "light" || cookieValue === "dark"
    ? cookieValue
    : defaultTheme;
}

export function setThemeCookie(theme: Theme) {
  document.cookie = `${THEME_STORAGE_KEY}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}
