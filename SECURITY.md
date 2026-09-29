# Security policy

## Reporting a vulnerability

Report a vulnerability privately through GitHub: open the **Security** tab of this repository and choose **Report a vulnerability**. Do not open a public issue for it.

Include the affected file or route, the steps to reproduce, and the impact you see. You can expect a first reply within a week. This is a small open-source starter maintained in spare time, so a fix may take longer, and the reply will say so.

## What is in scope

The code in this repository: the app, its configuration, and the scripts and workflows in `.github/`. A vulnerability in a dependency belongs to that project, but tell us if this template uses it in an unsafe way.

## Hardening a fork

The template sends basic security headers from `next.config.ts`, turns off `X-Powered-By`, and sets a nonce-based `Content-Security-Policy` in `src/proxy.ts`. The policy allows only your own origin. When you add a script, font, image, or API host, add it to `buildCsp` in `src/proxy.ts`. Set `REPORT_ONLY = true` while you test, so violations are logged in the browser console instead of blocked.
