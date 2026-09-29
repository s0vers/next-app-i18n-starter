#!/usr/bin/env node
// Reports which skill references are due for a re-check and whether the pinned
// dependencies have drifted from the latest releases. Read-only, no dependencies.
//
// Usage: node .github/scripts/skill-freshness.mjs [--max-age 90] [--today YYYY-MM-DD] [--offline] [--count]
//   --max-age   days before a reference counts as due (default 90)
//   --today     override today's date, to test the report
//   --offline   skip the npm registry lookup
//   --count     print only the number of items that need attention
//
// A reference's date is the oldest "checked YYYY-MM-DD" it carries, the last
// time someone re-read its sources. A reference that cites no external sources
// has no date and is listed separately.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const maxAge = Number(opt("max-age", "90"));
const today = new Date(`${opt("today", new Date().toISOString().slice(0, 10))}T00:00:00Z`);
const offline = args.includes("--offline");
const countOnly = args.includes("--count");

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const days = (from) => Math.floor((today - new Date(`${from}T00:00:00Z`)) / 86400000);

const rows = [];
for (const file of walk(".agents/skills").filter((f) => f.endsWith(".md") && f.includes("references"))) {
  const text = readFileSync(file, "utf8");
  const dates = [...text.matchAll(/checked (\d{4}-\d{2}-\d{2})/gi)].map((m) => m[1]).sort();
  const checked = dates[0];
  rows.push({ file: relative(process.cwd(), file).replace(/\\/g, "/"), checked, age: checked ? days(checked) : null });
}
// A reference with no "checked YYYY-MM-DD" date cites no external sources, so it cannot go stale by date.
const undated = rows.filter((r) => r.age === null);
const due = rows.filter((r) => r.age !== null && r.age > maxAge).sort((a, b) => b.age - a.age);

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const installed = (name) => (pkg.dependencies?.[name] ?? pkg.devDependencies?.[name] ?? "").replace(/^[\^~]/, "");
const drift = [];
if (!offline) {
  for (const name of ["next", "next-intl"]) {
    try {
      const response = await fetch(`https://registry.npmjs.org/${name}/latest`, { headers: { accept: "application/json" } });
      const latest = (await response.json()).version;
      const have = installed(name);
      if (have && latest && have !== latest) drift.push({ name, have, latest });
    } catch (error) {
      drift.push({ name, have: installed(name), latest: `lookup failed (${error.message})` });
    }
  }
}

const attention = due.length + drift.length;
if (countOnly) {
  console.log(attention);
  process.exit(0);
}

const lines = [];
lines.push(`# Monthly skill review`, "");
lines.push(`Date: ${today.toISOString().slice(0, 10)}. A reference is due after ${maxAge} days.`, "");
lines.push(`## Dependency drift`, "");
if (offline) lines.push("Skipped (offline).");
else if (!drift.length) lines.push("None. Pinned versions match the latest releases.");
else {
  lines.push("| Package | Pinned | Latest |", "| --- | --- | --- |");
  for (const d of drift) lines.push(`| ${d.name} | ${d.have} | ${d.latest} |`);
  lines.push("", "Read the release notes for anything that changes an API the skills describe (routing, request config, deprecations), then update the affected reference and its checked date.");
}
lines.push("", `## References due for a re-check (${due.length} of ${rows.length - undated.length} dated)`, "");
if (!due.length) lines.push("None.");
else {
  lines.push("| Reference | Last checked | Age (days) |", "| --- | --- | --- |");
  for (const r of due) lines.push(`| ${r.file} | ${r.checked} | ${r.age} |`);
  lines.push("", "Re-read each reference's sources, fix what changed, and update its \"checked\" date. Start with the fastest-moving files: AI crawler reference, AI and agentic discovery, structured data, measurement.");
}
lines.push("", `${undated.length} reference(s) cite no external sources and are not tracked by date: ${undated.map((r) => r.file.split("/").pop()).join(", ") || "none"}.`);
lines.push("", "## Then", "", "- Run `bun run i18n:check`, `node .github/scripts/check-skills.mjs`, and the SEO verifier against a production build.");
console.log(lines.join("\n"));
process.exit(0);
