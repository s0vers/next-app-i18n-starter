#!/usr/bin/env node
// Checks the structure of the repository skills. Read-only. No dependencies.
// Usage: node .github/scripts/check-skills.mjs [--dir .agents/skills]
//
// For every skill folder that has a SKILL.md:
//   - frontmatter has name and description, and name equals the folder name
//   - description is one line, at most 1024 characters, has no < or >, and is
//     safe as an unquoted YAML value (no ": " or " #", which GitHub rejects)
//   - SKILL.md stays under 500 lines
//   - every relative markdown link resolves to a file, and every #anchor to a heading
//   - no link leaves the skill folder, because an installed skill is copied alone
//   - evals/evals.json parses and has at least MIN_TRIGGERS should_trigger and
//     should_not_trigger prompts, so a description change can be tested
//   - every file in references/ and scripts/ is named in SKILL.md, so none is orphaned

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const args = process.argv.slice(2);
const dirArg = args.indexOf("--dir");
const root = resolve(dirArg >= 0 && args[dirArg + 1] ? args[dirArg + 1] : ".agents/skills");

const MIN_TRIGGERS = 8;

const problems = [];
const fail = (file, message) => problems.push(`${relative(process.cwd(), file)}: ${message}`);

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const slug = (heading) =>
  heading
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const anchorCache = new Map();
const anchorsOf = (file) => {
  if (!anchorCache.has(file)) {
    const text = readFileSync(file, "utf8");
    anchorCache.set(file, new Set([...text.matchAll(/^#{1,6}\s+(.+)$/gm)].map((m) => slug(m[1]))));
  }
  return anchorCache.get(file);
};

if (!existsSync(root)) {
  console.error(`Skills folder not found: ${root}`);
  process.exit(2);
}

const skillDirs = readdirSync(root).filter((d) => existsSync(join(root, d, "SKILL.md")));
if (!skillDirs.length) {
  console.error(`No SKILL.md found under ${root}`);
  process.exit(2);
}

for (const dirName of skillDirs) {
  const skillFile = join(root, dirName, "SKILL.md");
  const text = readFileSync(skillFile, "utf8").replace(/\r\n/g, "\n");
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!match) {
    fail(skillFile, "missing frontmatter block");
  } else {
    const fields = Object.fromEntries(
      [...match[1].matchAll(/^([a-z-]+):\s*(.*)$/gm)].map((m) => [m[1], m[2]]),
    );
    if (fields.name !== dirName) fail(skillFile, `name "${fields.name}" must equal the folder name "${dirName}"`);
    const description = fields.description;
    if (!description) {
      fail(skillFile, "missing description");
    } else {
      if (description.length > 1024) fail(skillFile, `description is ${description.length} characters, the limit is 1024`);
      if (/[<>]/.test(description)) fail(skillFile, "description contains < or >");
      const quoted = /^["']/.test(description);
      if (!quoted && (/:\s/.test(description) || /\s#/.test(description))) {
        fail(skillFile, 'unquoted description contains ": " or " #", which YAML parsers reject. Reword it or quote it');
      }
    }
  }
  if (text.split("\n").length > 500) fail(skillFile, "SKILL.md is over 500 lines. Move detail into references/");

  for (const file of walk(join(root, dirName)).filter((f) => f.endsWith(".md"))) {
    const body = readFileSync(file, "utf8");
    for (const m of body.matchAll(/\]\(([^)\s]+)\)/g)) {
      const link = m[1];
      if (/^(https?:|mailto:)/.test(link)) continue;
      const [path, anchor] = link.split("#");
      const target = path ? resolve(dirname(file), path) : file;
      if (relative(join(root, dirName), target).startsWith("..")) {
        fail(file, `link ${link} leaves the skill folder. Name the other skill in backticks instead`);
        continue;
      }
      if (!existsSync(target)) {
        fail(file, `broken link ${link}`);
      } else if (anchor && target.endsWith(".md") && !anchorsOf(target).has(anchor)) {
        fail(file, `broken anchor ${link}`);
      }
    }
  }

  for (const file of walk(join(root, dirName))) {
    const rel = relative(join(root, dirName), file).replace(/\\/g, "/");
    if (/^(references|scripts)\//.test(rel) && !text.includes(rel.split("/").pop())) {
      fail(file, "is not named in SKILL.md, so nothing points an agent at it");
    }
  }

  const evalsFile = join(root, dirName, "evals", "evals.json");
  if (!existsSync(evalsFile)) {
    fail(evalsFile, "missing. Add evals with trigger and near-miss prompts");
  } else {
    try {
      const evals = JSON.parse(readFileSync(evalsFile, "utf8"));
      if (evals.skill !== dirName) fail(evalsFile, `skill "${evals.skill}" must equal "${dirName}"`);
      for (const key of ["should_trigger", "should_not_trigger"]) {
        const count = Array.isArray(evals[key]) ? evals[key].length : 0;
        if (count < MIN_TRIGGERS) fail(evalsFile, `${key} has ${count} prompts, the minimum is ${MIN_TRIGGERS}`);
      }
    } catch (error) {
      fail(evalsFile, `invalid JSON: ${error.message}`);
    }
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  console.error(`\n${problems.length} problem(s) in ${skillDirs.length} skill(s).`);
  process.exit(1);
}
console.log(`OK: ${skillDirs.length} skills checked (${skillDirs.join(", ")}).`);
