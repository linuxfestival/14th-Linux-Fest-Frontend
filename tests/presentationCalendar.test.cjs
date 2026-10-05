const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const exported = {};
vm.runInNewContext(ts.transpileModule(
  fs.readFileSync(path.join(__dirname, "../src/utils/presentationCalendar.ts"), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } },
).outputText, { exports: exported, URL, URLSearchParams });
const { createGoogleCalendarUrl } = exported;
const presentation = {
  id: 7,
  title: "آشنایی با لینوکس",
  start: new Date("2026-10-10T09:30:00+03:30"),
  end: new Date("2026-10-10T11:00:00+03:30"),
};
test("opens Google Calendar's event editor with the actual schedule and Tehran timezone", () => {
  const url = new URL(createGoogleCalendarUrl(presentation));
  assert.equal(url.origin, "https://calendar.google.com");
  assert.equal(url.pathname, "/calendar/render");
  assert.equal(url.searchParams.get("action"), "TEMPLATE");
  assert.equal(url.searchParams.get("dates"), "20261010T060000Z/20261010T073000Z");
  assert.equal(url.searchParams.get("ctz"), "Asia/Tehran");
  assert.equal(url.searchParams.get("text"), presentation.title);
  assert.ok(url.searchParams.get("details").includes("https://linux-fest.ir/workshop/7"));
});

test("preserves Persian and special characters without injecting URL parameters", () => {
  const title = "کارگاه لینوکس 🐧 & dates=wrong + # ; \nعنوان دوم";
  const url = new URL(createGoogleCalendarUrl({ ...presentation, title }));
  assert.equal(url.searchParams.get("text"), title);
  assert.equal(url.searchParams.getAll("dates").length, 1);
  assert.equal(url.searchParams.get("dates"), "20261010T060000Z/20261010T073000Z");
  assert.equal(url.hash, "");
});

test("rejects missing, reversed, or zero-duration schedules", () => {
  for (const changes of [
    { start: new Date("invalid") },
    { end: new Date("invalid") },
    { end: presentation.start },
    { end: new Date("2026-10-09T10:00:00Z") },
  ]) assert.throws(() => createGoogleCalendarUrl({ ...presentation, ...changes }), /valid start and end/);
});
