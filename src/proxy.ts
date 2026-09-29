import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const isDev = process.env.NODE_ENV === "development";

// Set to true to log violations in the browser console without blocking
// anything. Use it when you add a script, font, or image host, browse every
// page, fix what is reported, then set it back to false.
const REPORT_ONLY = false;
const CSP_HEADER = REPORT_ONLY
  ? "Content-Security-Policy-Report-Only"
  : "Content-Security-Policy";

// Built per request because the nonce is random per request. Read each line as
// "this kind of resource may only come from ...".
function buildCsp(nonce: string) {
  return [
    "default-src 'self'",
    // A script runs only with this request's nonce, or when a nonced script
    // added it ('strict-dynamic', which is how the Vercel components load).
    // 'self' is a fallback for browsers that do not know 'strict-dynamic'.
    // React needs 'unsafe-eval' in development to rebuild server error stacks.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // Production only loads CSS files. Development injects <style> for hot reload.
    `style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`}`,
    // style="..." attributes cannot carry a nonce, and UI libraries set them.
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' blob: data:",
    // next/font self-hosts the Geist files, so no font host is needed.
    "font-src 'self'",
    // Vercel Analytics and Speed Insights post to same-origin paths.
    `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    // Matches X-Frame-Options: SAMEORIGIN in next.config.ts.
    "frame-ancestors 'self'",
  ].join("; ");
}

export default function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  // Next.js reads the nonce from the request's CSP header and puts it on its
  // own scripts. next-intl builds its request headers from this request, so
  // the values below reach the page render as well as the response.
  request.headers.set("x-nonce", nonce);
  request.headers.set(CSP_HEADER, csp);

  const response = handleI18nRouting(request);
  response.headers.set(CSP_HEADER, csp);
  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
