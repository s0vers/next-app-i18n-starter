export const THEME_COOKIE_NAME = "theme";

export type Theme = "light" | "dark";

export function resolveSSRTheme(
  cookieValue: string | undefined,
  defaultTheme: Theme = "dark",
): Theme {
  return cookieValue === "light" || cookieValue === "dark"
    ? cookieValue
    : defaultTheme;
}

export function setThemeCookie(theme: Theme) {
  document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}
