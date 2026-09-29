#!/usr/bin/env node
// Keeps the shared "working method and report" block identical in every nextjs-seo-* skill.
// Each skill is installed and read on its own, so the block is copied into each SKILL.md
// between <!-- shared:start --> and <!-- shared:end --> markers.
//
// Usage: node .github/scripts/sync-shared.mjs          rewrite the blocks from .github/shared/seo-shared.md
//        node .github/scripts/sync-shared.mjs --check  fail when any block differs

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const check = process.argv.includes("--check");
const skillsDir = ".agents/skills";
const shared = readFileSync(".github/shared/seo-shared.md", "utf8").replace(/\r\n/g, "\n").trim();
const START = "<!-- shared:start -->";
const END = "<!-- shared:end -->";

const stale = [];
let updated = 0;
for (const name of readdirSync(skillsDir).filter((d) => d.startsWith("nextjs-seo-"))) {
  const file = join(skillsDir, name, "SKILL.md");
  if (!existsSync(file)) continue;
  const text = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const a = text.indexOf(START);
  const b = text.indexOf(END);
  if (a < 0 || b < a) {
    stale.push(`${file}: missing ${START} / ${END} markers`);
    continue;
  }
  const next = `${text.slice(0, a + START.length)}\n${shared}\n${text.slice(b)}`;
  if (next === text) continue;
  if (check) stale.push(`${file}: shared block is out of date`);
  else {
    writeFileSync(file, next);
    updated++;
  }
}

if (stale.length) {
  console.error(stale.join("\n"));
  console.error("\nRun: node .github/scripts/sync-shared.mjs");
  process.exit(1);
}
console.log(check ? "OK: shared SEO blocks are in sync." : `Synced ${updated} skill(s).`);
