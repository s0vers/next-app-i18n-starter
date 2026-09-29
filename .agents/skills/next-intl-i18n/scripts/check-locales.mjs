#!/usr/bin/env node
// Validates the locale registry: route keys, language tags, Open Graph tags,
// currency, time zone, direction, and dictionary files.
// Usage: node check-locales.mjs [--config src/i18n/locales.ts] [--dir dictionary]
// Needs Node 22.18+ or 24 (runs the TypeScript config directly). Read-only. No dependencies.
//
// Catches the mistakes that ship silently: a route key that is not a language
// (jp instead of ja), a tag Google's hreflang rejects, a locale without a
// dictionary, a right-to-left language marked left to right, duplicate tags.

import { existsSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const configPath = resolve(opt("config", "src/i18n/locales.ts"));
const dictDir = resolve(opt("dir", "dictionary"));

const findings = [];
const fail = (where, message) => findings.push({ level: "FAIL", where, message });
const warn = (where, message) => findings.push({ level: "WARN", where, message });

if (!existsSync(configPath)) {
  console.error(`Config not found: ${configPath}`);
  process.exit(2);
}

let localeConfig;
try {
  ({ localeConfig } = await import(pathToFileURL(configPath).href));
} catch (error) {
  console.error(`Could not load ${configPath}: ${error.message}`);
  console.error("This script runs the TypeScript file directly and needs Node 22.18+ or 24.");
  process.exit(2);
}
if (!localeConfig || typeof localeConfig !== "object") {
  console.error(`${configPath} must export a localeConfig object.`);
  process.exit(2);
}

const languageNames = new Intl.DisplayNames(["en"], { type: "language", fallback: "none" });
const isLanguage = (code) => {
  try {
    return Boolean(languageNames.of(code));
  } catch {
    return false;
  }
};
const RTL_LANGUAGES = new Set(["ar", "he", "fa", "ur", "ps", "sd", "ug", "yi", "dv"]);
// Google's hreflang accepts an ISO 639-1 language, an optional ISO 15924 script,
// and an optional ISO 3166-1 alpha-2 region.
const HREFLANG = /^[a-z]{2}(-[A-Z][a-z]{3})?(-[A-Z]{2})?$/;

const keys = Object.keys(localeConfig);
const seenTags = new Map();
const files = existsSync(dictDir) ? readdirSync(dictDir).filter((f) => f.endsWith(".json")) : [];

for (const key of keys) {
  const c = localeConfig[key];
  const where = `locale "${key}"`;
  const keyLanguage = key.split("-")[0];

  if (!/^[a-z]{2,3}(-[a-z0-9]+)*$/.test(key)) fail(where, "route key must be lowercase letters, like ja or zh-hans");
  if (!isLanguage(keyLanguage)) fail(where, `"${keyLanguage}" is not a known language code (did you mean ja, not jp?)`);

  const tag = c.languageTag;
  if (typeof tag !== "string") {
    fail(where, "languageTag is missing");
  } else {
    let canonical = tag;
    try {
      canonical = Intl.getCanonicalLocales(tag)[0];
    } catch {
      fail(where, `languageTag "${tag}" is not a valid BCP 47 tag`);
    }
    if (canonical !== tag) warn(where, `languageTag "${tag}" canonicalizes to "${canonical}"`);
    if (!HREFLANG.test(tag)) {
      fail(where, `languageTag "${tag}" is not accepted by Google hreflang (needs a 2-letter language, optional script, optional 2-letter region)`);
    }
    if (tag.split("-")[0] !== keyLanguage) {
      fail(where, `languageTag "${tag}" is a different language than the route key "${key}"`);
    }
    if (seenTags.has(tag)) fail(where, `languageTag "${tag}" is also used by "${seenTags.get(tag)}", so two locales would share one hreflang`);
    seenTags.set(tag, key);
  }

  if (c.ogLocale !== undefined) {
    if (!/^[a-z]{2}_[A-Z]{2}$/.test(c.ogLocale)) fail(where, `ogLocale "${c.ogLocale}" must look like ja_JP`);
    else if (c.ogLocale.split("_")[0] !== keyLanguage) fail(where, `ogLocale "${c.ogLocale}" is a different language than "${key}"`);
  }

  if (c.currency !== undefined) {
    let ok = true;
    try {
      ok = Intl.supportedValuesOf("currency").includes(c.currency);
    } catch {
      ok = /^[A-Z]{3}$/.test(c.currency);
    }
    if (!ok) fail(where, `currency "${c.currency}" is not an ISO 4217 code`);
  }

  if (c.timeZone !== undefined) {
    try {
      new Intl.DateTimeFormat("en", { timeZone: c.timeZone });
    } catch {
      fail(where, `timeZone "${c.timeZone}" is not an IANA time zone`);
    }
  }

  if (c.dir === undefined) {
    warn(where, `no dir field. Add "ltr" or "rtl" so direction never depends on a hardcoded language check`);
  } else if (c.dir !== "ltr" && c.dir !== "rtl") {
    fail(where, `dir "${c.dir}" must be "ltr" or "rtl"`);
  } else if (RTL_LANGUAGES.has(keyLanguage) && c.dir !== "rtl") {
    fail(where, `"${keyLanguage}" is written right to left but dir is "${c.dir}"`);
  } else if (!RTL_LANGUAGES.has(keyLanguage) && c.dir === "rtl") {
    warn(where, `dir is "rtl" for "${keyLanguage}". Confirm this language is written right to left`);
  }

  if (!c.label) warn(where, "no label for the language switcher");
  if (!files.includes(`${key}.json`)) fail(where, `no dictionary file ${join(dictDir, `${key}.json`)}`);
}

for (const file of files) {
  const key = file.replace(/\.json$/, "");
  if (!keys.includes(key)) warn(`dictionary/${file}`, `no locale "${key}" in the config. Rename it or remove it`);
}

const failed = findings.filter((f) => f.level === "FAIL").length;
for (const f of findings) console.log(`${f.level.padEnd(4)} ${f.where}: ${f.message}`);
console.log(`${keys.length} locales checked: ${failed} failed, ${findings.length - failed} warnings.`);
process.exit(failed ? 1 : 0);
