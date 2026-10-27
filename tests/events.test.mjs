// Path containment checks for lib/events.ts (audit item W-V1).
//
// Run: node --test tests/events.test.mjs
// (Node 23.6+ strips TypeScript types natively, so lib/events.ts is imported
// as is. No extra dependencies.)
//
// Runs against an isolated fixture directory, never the real content folder:
// content/events holds two valid events, and next to it sit a sibling
// Markdown file, a sibling folder whose name shares the "events" prefix, and
// a symlink inside events/ pointing out of it. Every hostile slug must come
// back null, and no file outside content/events may be opened.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "nw-events-"));
const eventsDir = path.join(fixture, "content", "events");

const EVENT = (no) => `---
no: "${no}"
title: "Walk ${no}"
date: 2025-01-${no}
time: "12:00"
course: "Test course"
meetingPoint: "Test point"
---
Report ${no}
`;
const SECRET = `---
no: "999"
title: "SECRET-SIBLING"
date: 2025-01-01
time: "12:00"
course: "x"
meetingPoint: "x"
---
SECRET-SIBLING-BODY
`;

let events;
let originalCwd;
const opened = [];
const realReadFileSync = fs.readFileSync;

before(async () => {
  fs.mkdirSync(eventsDir, { recursive: true });
  fs.mkdirSync(path.join(fixture, "content", "events-private"), { recursive: true });
  fs.mkdirSync(path.join(fixture, "public", "events"), { recursive: true });
  fs.writeFileSync(path.join(eventsDir, "netwalking-001.md"), EVENT("01"));
  fs.writeFileSync(path.join(eventsDir, "nitewalking-002.md"), EVENT("02"));
  fs.writeFileSync(path.join(fixture, "content", "secret.md"), SECRET);
  fs.writeFileSync(path.join(fixture, "content", "events-private", "leak.md"), SECRET);
  fs.writeFileSync(path.join(fixture, "secret.md"), SECRET);
  fs.symlinkSync(path.join(fixture, "content", "secret.md"), path.join(eventsDir, "linked.md"));

  originalCwd = process.cwd();
  process.chdir(fixture);
  // Record every read of a fixture file (module loading also uses
  // readFileSync, so reads outside the fixture are ignored here).
  const fixtureReal = fs.realpathSync(fixture);
  fs.readFileSync = (file, ...rest) => {
    const resolved = path.resolve(String(file));
    if (resolved.startsWith(fixture) || resolved.startsWith(fixtureReal)) opened.push(resolved);
    return realReadFileSync(file, ...rest);
  };
  events = await import(path.join(repoRoot, "lib", "events.ts"));
});

after(() => {
  fs.readFileSync = realReadFileSync;
  process.chdir(originalCwd);
  fs.rmSync(fixture, { recursive: true, force: true });
});

test("known slugs still resolve", () => {
  assert.equal(events.getEventBySlug("netwalking-001")?.title, "Walk 01");
  assert.equal(events.getEventBySlug("nitewalking-002")?.title, "Walk 02");
});

test("listing contains only the real event files", () => {
  assert.deepEqual(events.getAllEventSlugs().sort(), ["netwalking-001", "nitewalking-002"]);
  assert.deepEqual(events.getAllEvents().map((e) => e.slug).sort(), ["netwalking-001", "nitewalking-002"]);
});

const hostile = [
  // unknown but well-formed
  "netwalking-999",
  "secret",
  // sibling markdown and prefix-sharing sibling folder
  "../secret",
  "../../secret",
  "../events-private/leak",
  "..%2Fsecret",
  "..%2fsecret",
  "%2e%2e%2Fsecret",
  "%2E%2E/secret",
  "%2e%2e",
  "..",
  ".",
  "./netwalking-001",
  "netwalking-001/../../secret",
  "netwalking-001%2F..%2F..%2Fsecret",
  // backslash and absolute forms
  "..\\secret",
  "..%5Csecret",
  path.join(fixture, "content", "secret"),
  "/etc/passwd",
  // encodings, case, separators, junk
  "NetWalking-001",
  "netwalking-001.md",
  "netwalking-001%00",
  "netwalking-001\u0000",
  "netwalking--001",
  "-netwalking-001",
  "netwalking-001-",
  "",
  "a".repeat(101),
  // grammar-valid symlink escaping the directory
  "linked",
];

for (const slug of hostile) {
  test(`rejects slug ${JSON.stringify(slug.length > 40 ? slug.slice(0, 40) + "..." : slug)}`, () => {
    const before = opened.length;
    assert.equal(events.getEventBySlug(slug), null);
    const reads = opened.slice(before);
    assert.deepEqual(reads, [], `unexpected reads: ${reads.join(", ")}`);
  });
}

test("non-string input is rejected", () => {
  for (const v of [undefined, null, 1, ["netwalking-001"], { toString: () => "netwalking-001" }]) {
    assert.equal(events.getEventBySlug(v), null);
  }
});

test("slug grammar", () => {
  assert.equal(events.isValidEventSlug("netwalking-023"), true);
  assert.equal(events.isValidEventSlug("netwalking-023/"), false);
  assert.equal(events.isValidEventSlug("netwalking.023"), false);
});

test("no file outside content/events was ever opened", () => {
  const root = fs.realpathSync(eventsDir);
  const outside = opened.filter((f) => !fs.realpathSync(f).startsWith(root + path.sep));
  assert.deepEqual(outside, []);
});
