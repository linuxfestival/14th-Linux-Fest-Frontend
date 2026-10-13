const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const exportsObject = {};
const calls = [];
const source = fs.readFileSync(path.join(__dirname, "../src/core/skyroom/skyroom.api.ts"), "utf8");
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, {
  exports: exportsObject, URL,
  require() { return { makeCall(...args) { calls.push(args); return () => {}; } }; },
});

test("Skyroom client opts into authenticated requests", () => {
  assert.deepEqual(calls[0], ["/api/users/skyroom/", "GET", true]);
});

test("room navigation accepts only valid web links without embedded credentials", () => {
  const { safeSkyroomUrl } = exportsObject;
  assert.equal(safeSkyroomUrl("https://www.skyroom.online/ch/example/room"), "https://www.skyroom.online/ch/example/room");
  for (const url of ["", "not a url", "javascript:alert(1)", "data:text/html,hello", "https://user:password@example.com/room"]) {
    assert.equal(safeSkyroomUrl(url), undefined);
  }
});
