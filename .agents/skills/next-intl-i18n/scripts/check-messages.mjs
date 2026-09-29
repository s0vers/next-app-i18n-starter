#!/usr/bin/env node
// Checks that every dictionary file mirrors the source locale.
// Usage: node check-messages.mjs [--dir dictionary] [--source en]
// Exits 1 on any finding. Reads files only. No dependencies.

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const dir = opt("dir", "dictionary");
const source = opt("source", "en");

const findings = [];
const report = (file, key, message) => findings.push(`${file} ${key}: ${message}`);

function load(file) {
  try {
    return JSON.parse(readFileSync(join(dir, file), "utf8"));
  } catch (error) {
    report(file, "-", `invalid JSON (${error.message})`);
    return null;
  }
}

function flatten(node, prefix = "", out = {}) {
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) flatten(value, path, out);
    else out[path] = value;
  }
  return out;
}

// Reads an ICU message and returns its argument names, plural and select
// branches, and rich-text tags. Quote-escaped text ('{') is skipped.
function parseIcu(message) {
  const args = new Set();
  const tags = new Set();
  const problems = [];

  function readBlock(start) {
    // start points just after '{'. Returns the index after the matching '}'.
    let i = start;
    let head = "";
    while (i < message.length && message[i] !== "}" && message[i] !== ",") head += message[i++];
    const name = head.trim();
    if (name) args.add(name);
    if (message[i] === "}") return i + 1;
    i++; // skip ','
    let type = "";
    while (i < message.length && message[i] !== "}" && message[i] !== ",") type += message[i++];
    type = type.trim();
    if (message[i] === "}") return i + 1;
    i++; // skip ','
    if (type === "plural" || type === "select" || type === "selectordinal") {
      const branches = new Set();
      while (i < message.length && message[i] !== "}") {
        while (/\s/.test(message[i] ?? "")) i++;
        if (message[i] === "}") break;
        let selector = "";
        while (i < message.length && message[i] !== "{" && message[i] !== "}") selector += message[i++];
        selector = selector.trim();
        if (message[i] !== "{") break;
        if (selector) branches.add(selector.replace(/^offset:\d+\s*/, ""));
        i = readText(i + 1, true) + 1; // readText stops on the branch's closing brace
      }
      if (!branches.has("other")) problems.push(`${name} ${type} has no "other" branch`);
      return i + 1; // closing brace of the whole argument
    }
    let depth = 0;
    while (i < message.length && !(message[i] === "}" && depth === 0)) {
      if (message[i] === "{") depth++;
      if (message[i] === "}") depth--;
      i++;
    }
    return i + 1;
  }

  function readText(start, nested) {
    let i = start;
    while (i < message.length) {
      const c = message[i];
      if (c === "'") {
        if (message[i + 1] === "'") { i += 2; continue; }
        if (message[i + 1] === "{" || message[i + 1] === "}" || message[i + 1] === "<") {
          const close = message.indexOf("'", i + 2);
          i = close === -1 ? message.length : close + 1;
          continue;
        }
        i++;
        continue;
      }
      if (c === "{") { i = readBlock(i + 1); continue; }
      if (c === "}") { if (nested) return i; i++; continue; }
      if (c === "<") {
        const tag = /^<\/?([A-Za-z][\w-]*)\s*\/?>/.exec(message.slice(i));
        if (tag) { tags.add(tag[1]); i += tag[0].length; continue; }
      }
      i++;
    }
    return i;
  }

  readText(0, false);
  return { args, tags, problems };
}

const same = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));
const list = (set) => (set.size ? [...set].sort().join(", ") : "none");

const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
const sourceFile = `${source}.json`;
if (!files.includes(sourceFile)) {
  console.error(`Source file ${join(dir, sourceFile)} not found.`);
  process.exit(2);
}

const sourceTree = load(sourceFile);
if (!sourceTree) {
  console.error(findings.join("\n"));
  process.exit(1);
}
const sourceFlat = flatten(sourceTree);

for (const [key, value] of Object.entries(sourceFlat)) {
  if (typeof value === "string") {
    for (const p of parseIcu(value).problems) report(sourceFile, key, p);
  }
}

for (const file of files) {
  if (file === sourceFile) continue;
  const tree = load(file);
  if (!tree) continue;
  const flat = flatten(tree);

  for (const key of Object.keys(sourceFlat)) {
    if (!(key in flat)) report(file, key, "missing (present in source)");
  }
  for (const key of Object.keys(flat)) {
    if (!(key in sourceFlat)) report(file, key, "extra (absent from source)");
  }

  for (const [key, value] of Object.entries(flat)) {
    if (!(key in sourceFlat)) continue;
    if (typeof value !== "string") {
      if (typeof sourceFlat[key] !== typeof value) report(file, key, "type differs from source");
      continue;
    }
    if (value.trim() === "" && String(sourceFlat[key]).trim() !== "") report(file, key, "empty string");
    if (typeof sourceFlat[key] !== "string") continue;
    const s = parseIcu(sourceFlat[key]);
    const t = parseIcu(value);
    for (const p of t.problems) report(file, key, p);
    if (!same(s.args, t.args)) report(file, key, `ICU arguments differ (source: ${list(s.args)}; here: ${list(t.args)})`);
    if (!same(s.tags, t.tags)) report(file, key, `rich-text tags differ (source: ${list(s.tags)}; here: ${list(t.tags)})`);
  }
}

if (findings.length) {
  console.error(findings.join("\n"));
  console.error(`\n${findings.length} finding(s) across ${files.length} file(s).`);
  process.exit(1);
}
console.log(`OK: ${files.length} dictionaries match ${sourceFile} (${Object.keys(sourceFlat).length} keys).`);
