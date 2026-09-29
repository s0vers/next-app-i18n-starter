# Security policy

## Reporting a vulnerability

Report a vulnerability privately through GitHub: open the **Security** tab of this repository and choose **Report a vulnerability**. Do not open a public issue for it.

Include the affected file or route, the steps to reproduce, and the impact you see. You can expect a first reply within a week. This is a small open-source starter maintained in spare time, so a fix may take longer, and the reply will say so.

## What is in scope

The code in this repository: the app, its configuration, and the scripts and workflows in `.github/`. A vulnerability in a dependency belongs to that project, but tell us if this template uses it in an unsafe way.

## Hardening a fork

The template sends basic security headers from `next.config.ts` and turns off `X-Powered-By`. It does not send a `Content-Security-Policy`, because the right one depends on the scripts and hosts your site uses. Add one before you ship anything that handles user data.
