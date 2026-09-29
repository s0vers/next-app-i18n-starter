#!/usr/bin/env node
// Verifies multilingual SEO signals on a running site. No dependencies. Read-only requests.
//
// Usage:
//   node verify-seo.mjs --base http://localhost:3000 [--origin https://example.com] [--urls /,/ja] [--max 50]
//
//   --base    where to send requests (default http://localhost:3000)
//   --origin  the public origin used in canonicals and the sitemap, when it differs from --base
//             (a production build run locally). Defaults to the sitemap's own origin.
//   --urls    comma-separated paths to check instead of the sitemap URLs
//   --max     cap on pages checked (default 50)
//
// Exits 1 when any check fails. Warnings do not fail the run.
// Proves local implementation only. It cannot prove indexing, rankings, or how a search engine chooses a canonical.

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const base = opt("base", "http://localhost:3000").replace(/\/$/, "");
const explicitOrigin = opt("origin", "");
const explicitUrls = opt("urls", "");
const max = Number(opt("max", "50"));

const results = { pass: 0, warn: 0, fail: 0 };
const log = (level, url, message) => {
  results[level]++;
  const tag = level.toUpperCase().padEnd(4);
  console.log(`${tag} ${url ? `${url}  ` : ""}${message}`);
};

async function get(url, headers = {}) {
  const response = await fetch(url, { redirect: "manual", headers });
  const text = response.status === 200 ? await response.text() : "";
  return { status: response.status, headers: response.headers, text };
}

const isAbsolute = (u) => /^https?:\/\//.test(u ?? "");

const norm = (u) => {
  try { return new URL(u).href; } catch { return u; }
};

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g)) {
    out[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? "";
  }
  return out;
}

function parsePage(html) {
  const tags = (name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((m) => attrs(m[0]));
  const htmlTag = tags("html")[0] ?? {};
  const links = tags("link");
  const metas = tags("meta");
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.trim() ?? "";
  const robotsMeta = metas
    .filter((m) => ["robots", "googlebot"].includes((m.name ?? "").toLowerCase()))
    .map((m) => m.content ?? "")
    .join(",")
    .toLowerCase();
  const description = metas.find((m) => (m.name ?? "").toLowerCase() === "description")?.content ?? "";
  const canonicalRaw = links.find((l) => (l.rel ?? "").toLowerCase() === "canonical")?.href ?? "";
  const canonical = isAbsolute(canonicalRaw) ? norm(canonicalRaw) : canonicalRaw;
  const alternates = {};
  for (const l of links) {
    if ((l.rel ?? "").toLowerCase() === "alternate" && l.hreflang) {
      alternates[l.hreflang] = isAbsolute(l.href) ? norm(l.href) : l.href;
    }
  }
  const jsonLd = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  return { lang: htmlTag.lang ?? "", dir: htmlTag.dir ?? "", title, description, canonical, alternates, robotsMeta, jsonLd, h1Count };
}

function parseLinkHeader(value) {
  const out = {};
  for (const m of (value ?? "").matchAll(/<([^>]+)>\s*;\s*rel="alternate"\s*;\s*hreflang="([^"]+)"/gi)) out[m[2]] = norm(m[1]);
  return out;
}

function parseSitemap(xml) {
  const entries = [];
  for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)) {
    const loc = /<loc>\s*([^<\s]+)\s*<\/loc>/i.exec(block[1])?.[1];
    if (!loc) continue;
    const alternates = {};
    for (const l of block[1].matchAll(/<xhtml:link\b[^>]*>/gi)) {
      const a = attrs(l[0]);
      if (a.hreflang && a.href) alternates[a.hreflang] = norm(a.href);
    }
    entries.push({ loc: norm(loc), alternates });
  }
  return entries;
}

const validHreflang = /^(x-default|[a-z]{2,3}(-[A-Z][a-z]{3})?(-[A-Z]{2})?)$/;
const sameSet = (a, b) => {
  const ka = Object.keys(a).sort();
  const kb = Object.keys(b).sort();
  return ka.length === kb.length && ka.every((k, i) => k === kb[i] && a[k] === b[k]);
};

async function main() {
  console.log(`Checking ${base}\n`);

  // robots.txt
  const robots = await get(`${base}/robots.txt`);
  let sitemapUrl = `${base}/sitemap.xml`;
  if (robots.status !== 200) {
    log("fail", "/robots.txt", `status ${robots.status}`);
  } else {
    const sitemapLine = /^sitemap:\s*(\S+)/im.exec(robots.text)?.[1];
    if (!sitemapLine) log("warn", "/robots.txt", "no Sitemap line");
    else log("pass", "/robots.txt", `Sitemap line present (${sitemapLine})`);
    if (/user-agent:\s*\*\s*[\r\n]+(?:(?!user-agent)[^\r\n]*[\r\n]+)*?disallow:\s*\/\s*$/im.test(robots.text)) {
      log("fail", "/robots.txt", 'group "*" disallows "/"');
    }
    const groups = [...robots.text.matchAll(/^user-agent:\s*(.+)$/gim)].map((m) => m[1].trim()).filter((u) => u !== "*");
    if (groups.length) log("pass", "/robots.txt", `named crawler groups: ${groups.join(", ")}`);
  }

  // sitemap
  const sitemap = await get(sitemapUrl);
  let entries = [];
  if (sitemap.status !== 200) log("fail", "/sitemap.xml", `status ${sitemap.status}`);
  else {
    entries = parseSitemap(sitemap.text);
    log(entries.length ? "pass" : "fail", "/sitemap.xml", `${entries.length} URL entries`);
  }

  const origin = explicitOrigin.replace(/\/$/, "") || (entries[0] ? new URL(entries[0].loc).origin : base);
  const toFetch = (u) => (u.startsWith(origin) ? base + u.slice(origin.length) : u);
  const toPublic = (u) => norm(u.startsWith(base) ? origin + u.slice(base.length) : u);

  const pageUrls = explicitUrls
    ? explicitUrls.split(",").map((p) => norm(origin + (p.startsWith("/") ? p : `/${p}`)))
    : entries.map((e) => e.loc);
  const sample = [...new Set(pageUrls)].slice(0, max);
  const sitemapAlternates = new Map(entries.map((e) => [e.loc, e.alternates]));

  // per page
  const pages = new Map();
  const noCookieHeaders = {};
  for (const url of sample) {
    const res = await get(toFetch(url), noCookieHeaders);
    if (res.status !== 200) {
      log("fail", url, `status ${res.status}${res.headers.get("location") ? ` → ${res.headers.get("location")}` : ""}`);
      continue;
    }
    const page = parsePage(res.text);
    page.linkHeader = parseLinkHeader(res.headers.get("link"));
    page.xRobots = (res.headers.get("x-robots-tag") ?? "").toLowerCase();
    pages.set(url, page);

    if (/noindex/.test(page.robotsMeta) || /noindex/.test(page.xRobots)) log("fail", url, "noindex present");
    if (!page.canonical) log("fail", url, "no canonical");
    else if (toPublic(page.canonical) !== url && page.canonical !== url) log("fail", url, `canonical is ${page.canonical}, not self`);
    else log("pass", url, "self-canonical");
    if (!page.lang) log("fail", url, "no <html lang>");
    if (!page.dir) log("warn", url, "no <html dir>");
    if (!page.title) log("fail", url, "no <title>");
    if (!page.description) log("warn", url, "no meta description");
    if (page.h1Count !== 1) log("warn", url, `${page.h1Count} <h1> elements`);
    for (const block of page.jsonLd) {
      try { JSON.parse(block); } catch { log("fail", url, "JSON-LD does not parse"); }
    }
    if (page.jsonLd.some((b) => /<\/script/i.test(b))) log("fail", url, "JSON-LD contains an unescaped </script");
  }

  // duplicate titles and descriptions
  for (const field of ["title", "description"]) {
    const seen = new Map();
    for (const [url, page] of pages) {
      const value = page[field];
      if (!value) continue;
      seen.set(value, [...(seen.get(value) ?? []), url]);
    }
    for (const [value, urls] of seen) {
      if (urls.length > 1) log("warn", "", `duplicate ${field} "${value.slice(0, 60)}" on ${urls.length} URLs (fine only if they are translations of one page)`);
    }
  }

  // hreflang
  const alternateSets = new Map();
  for (const [url, page] of pages) {
    const html = Object.fromEntries(Object.entries(page.alternates).map(([k, v]) => [k, v]));
    const header = page.linkHeader;
    const smap = sitemapAlternates.get(url) ?? {};
    alternateSets.set(url, html);

    for (const [code, href] of Object.entries(html)) {
      if (!validHreflang.test(code)) log("fail", url, `invalid hreflang "${code}"`);
      if (!/^https?:\/\//.test(href)) log("fail", url, `hreflang "${code}" is not absolute: ${href}`);
    }
    if (Object.keys(html).length) {
      if (!Object.values(html).some((h) => h === url || toPublic(h) === url)) log("fail", url, "alternate set has no self-reference");
      const defaults = Object.keys(html).filter((k) => k === "x-default");
      if (defaults.length > 1) log("fail", url, "more than one x-default");
    }
    if (Object.keys(header).length && Object.keys(html).length && !sameSet(header, html)) {
      log("fail", url, `Link header hreflang (${Object.keys(header).join(",")}) differs from HTML (${Object.keys(html).join(",")}); use one source`);
    } else if (Object.keys(header).length && !Object.keys(html).length) {
      log("warn", url, "hreflang only in the Link header");
    }
    if (Object.keys(smap).length && Object.keys(html).length && !sameSet(smap, html)) {
      log("fail", url, "sitemap alternates differ from HTML alternates");
    }
  }

  // reciprocity, fetching alternates that were not in the sample
  const cache = new Map([...alternateSets]);
  async function alternatesOf(url) {
    if (cache.has(url)) return cache.get(url);
    const res = await get(toFetch(url), noCookieHeaders);
    if (res.status !== 200) { cache.set(url, null); return null; }
    const set = parsePage(res.text).alternates;
    cache.set(url, set);
    return set;
  }
  let reciprocityChecked = 0;
  for (const [url, set] of alternateSets) {
    for (const [code, target] of Object.entries(set)) {
      if (!isAbsolute(target)) continue; // already reported as not absolute
      const targetPublic = toPublic(target);
      if (targetPublic === url) continue;
      const back = await alternatesOf(targetPublic);
      reciprocityChecked++;
      if (back === null) log("fail", url, `alternate ${code} → ${target} does not return 200`);
      else if (!Object.values(back).some((h) => toPublic(h) === url)) log("fail", url, `alternate ${code} → ${target} does not link back`);
    }
  }
  if (reciprocityChecked) log("pass", "", `${reciprocityChecked} alternate links checked for a 200 and a return link`);

  // language detection must not redirect
  const probe = origin + "/";
  const hints = [
    ["Accept-Language: ja", { "Accept-Language": "ja" }],
    ["Cookie: NEXT_LOCALE=ja", { Cookie: "NEXT_LOCALE=ja" }],
  ];
  for (const [label, headers] of hints) {
    const res = await get(toFetch(probe), headers);
    if (res.status >= 300 && res.status < 400) log("fail", "/", `${label} redirects to ${res.headers.get("location")}`);
    else log("pass", "/", `${label} does not redirect (${res.status})`);
  }

  console.log(`\n${results.pass} passed, ${results.warn} warnings, ${results.fail} failed across ${pages.size} pages.`);
  console.log("This proves local implementation only. Indexing and canonical selection need Search Console.");
  process.exit(results.fail ? 1 : 0);
}

main().catch((error) => {
  console.error(`verify-seo failed to run: ${error.message}`);
  process.exit(2);
});
