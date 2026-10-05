const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const axios = require("axios");

function loadApi() {
  const events = { errors: [], toasts: [] };
  const source = fs.readFileSync(path.join(__dirname, "../src/utils/makeCall.ts"), "utf8")
    .replaceAll("import.meta.env.VITE_BASE_URL", '""');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    window: { __RUNTIME_CONFIG__: { API_BASE_URL: "https://test.invalid" } },
    require(name) {
      if (name === "./logger") return { logger: { debug() {}, error(value) { events.errors.push(value); } } };
      if (name === "react-toastify") return { toast: { info(value) { events.toasts.push(value); }, error(value) { events.toasts.push(value); } } };
      if (name === "./locales/locales") return { errors: { connectionError: "Connection failed" } };
      if (name === "js-cookie") return { get() {}, set() {} };
      return require(name);
    },
  });
  return { ...exports, events };
}

function failingResponse(config) {
  return new axios.AxiosError("Server unavailable", "ERR_BAD_RESPONSE", config, {}, {
    status: 503, statusText: "Service Unavailable", headers: {}, config, data: {},
  });
}

test("a retried request stays pending and silent until it succeeds", async () => {
  const { default: api, makeCall, events } = loadApi();
  let attempts = 0;
  let release;
  let atLastAttempt;
  const lastAttempt = new Promise(resolve => { atLastAttempt = resolve; });
  api.defaults.adapter = async config => {
    attempts++;
    if (attempts < 3) throw failingResponse(config);
    atLastAttempt();
    await new Promise(resolve => { release = resolve; });
    return { status: 200, statusText: "OK", headers: {}, config, data: "recovered" };
  };
  let settled = false;
  const request = makeCall("/retry")().finally(() => { settled = true; });
  await lastAttempt;
  assert.equal(settled, false);
  assert.equal(events.errors.length, 0);
  assert.equal(events.toasts.length, 0);
  release();
  assert.equal((await request).data, "recovered");
  assert.equal(attempts, 3);
  assert.equal(events.errors.length, 0);
});

test("exhausted retries surface one final error and one caller toast", async () => {
  const { default: api, makeCall, getErrorCode, events } = loadApi();
  let attempts = 0;
  api.defaults.adapter = async config => {
    attempts++;
    throw failingResponse(config);
  };
  await assert.rejects(makeCall("/retry")().catch(error => {
    assert.equal(attempts, 3);
    getErrorCode(error);
    throw error;
  }), /Server unavailable/);
  assert.equal(events.errors.length, 1, "terminal handling must not repeat as retry promises unwind");
  assert.equal(events.toasts.length, 1);
});

test("network failure reaches the caller only after retries and can show its final toast", async () => {
  const { default: api, makeCall, getErrorCode, events } = loadApi();
  let attempts = 0;
  api.defaults.adapter = async config => {
    attempts++;
    throw new axios.AxiosError("Network unavailable", "ERR_NETWORK", config);
  };
  await assert.rejects(makeCall("/retry")().catch(error => {
    assert.equal(attempts, 3);
    assert.equal(getErrorCode(error), -1);
    throw error;
  }), /Network unavailable/);
  assert.equal(events.errors.length, 1);
  assert.equal(events.toasts.length, 1);
});

test("independent failed requests each surface their own final error", async () => {
  const { default: api, makeCall, events } = loadApi();
  let attempts = 0;
  api.defaults.adapter = async config => {
    attempts++;
    throw failingResponse(config);
  };
  const results = await Promise.allSettled([makeCall("/first")(), makeCall("/second")()]);
  assert.equal(attempts, 6);
  assert.ok(results.every(result => result.status === "rejected"));
  assert.equal(events.errors.length, 2);
});

test("non-retryable responses still reject immediately", async () => {
  const { default: api, makeCall, events } = loadApi();
  let attempts = 0;
  api.defaults.adapter = async config => {
    attempts++;
    const error = failingResponse(config);
    error.response.status = 400;
    throw error;
  };
  await assert.rejects(makeCall("/invalid")(), /Server unavailable/);
  assert.equal(attempts, 1);
  assert.equal(events.errors.length, 1);
});
