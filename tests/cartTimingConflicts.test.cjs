const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.resolve(__dirname, "../src/core/cart/cart.conflicts.ts"), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports: exportsObject });
const { findCartTimingConflicts } = exportsObject;

const item = (id, start, end, payment_state = "PENDING") => ({
  id, payment_state, presentation: { id, start, end },
});
const at = time => `2026-10-06T${time}:00Z`;

test("reports overlapping selections with the actual shared interval", () => {
  const result = findCartTimingConflicts([item(1, at("09:00"), at("11:00")), item(2, at("10:00"), at("12:00"))]);
  assert.equal(result.length, 1);
  assert.equal(result[0].start.toISOString(), at("10:00").replace("Z", ".000Z"));
  assert.equal(result[0].end.toISOString(), at("11:00").replace("Z", ".000Z"));
});

test("checks completed purchases regardless of their position in the response", () => {
  const bought = item(1, at("09:00"), at("12:00"), "COMPLETED");
  const selected = item(2, at("10:00"), at("11:00"));
  for (const items of [[bought, selected], [selected, bought]]) {
    const [conflict] = findCartTimingConflicts(items);
    assert.equal(conflict.selected, selected);
    assert.equal(conflict.other, bought);
  }
});

test("does not report conflicts between two purchases", () => {
  assert.equal(findCartTimingConflicts([item(1, at("09:00"), at("11:00"), "COMPLETED"), item(2, at("09:00"), at("11:00"), "COMPLETED")]).length, 0);
});

test("back-to-back sessions and separate days do not overlap", () => {
  assert.equal(findCartTimingConflicts([
    item(1, at("09:00"), at("10:00")), item(2, at("10:00"), at("11:00")),
    item(3, "2026-10-07T09:00:00Z", "2026-10-07T10:00:00Z"),
  ]).length, 0);
});

test("compares time instants across timezone offsets", () => {
  assert.equal(findCartTimingConflicts([item(1, at("09:00"), at("10:00")), item(2, "2026-10-06T12:30:00+03:30", "2026-10-06T13:30:00+03:30")]).length, 1);
});

test("ignores missing, malformed, zero-length, and reversed schedules", () => {
  assert.equal(findCartTimingConflicts([
    item(1, at("09:00"), at("11:00")), item(2, undefined, undefined),
    item(3, "invalid", at("10:00")), item(4, at("10:00"), at("10:00")),
    item(5, at("11:00"), at("09:00")),
    item(6, null, at("12:00")),
  ]).length, 0);
});

test("deduplicates pairs and never compares a presentation with itself", () => {
  const first = item(1, at("09:00"), at("11:00"));
  assert.equal(findCartTimingConflicts([first, first, item(2, at("09:00"), at("11:00"))]).length, 1);
});

test("includes failed-payment selections and recalculates after removal", () => {
  const items = [item(1, at("09:00"), at("11:00"), "FAILED"), item(2, at("09:00"), at("11:00"))];
  assert.equal(findCartTimingConflicts(items).length, 1);
  assert.equal(findCartTimingConflicts(items.slice(1)).length, 0);
  assert.equal(findCartTimingConflicts([]).length, 0);
});

test("cart page renders the red alert for selected and purchased conflicts and clears it after removal", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  let items = [
    item(1, at("09:00"), at("11:00")),
    item(2, at("10:00"), at("12:00"), "COMPLETED"),
    item(3, at("10:30"), at("11:30")),
  ].map(entry => ({ ...entry, presentation: { ...entry.presentation, fa_title: `ارائه ${entry.id}`, presenters: [] } }));
  const pageExports = {};
  const empty = () => null;
  const mockRequire = name => {
    if (name === "react-redux") return { useSelector: () => ({ items, totalAmount: 0, loading: false }) };
    if (name === "react-router-dom") return { Link: ({ to, children }) => React.createElement("a", { href: to }, children) };
    if (name === "react-icons/hi2") return { HiArrowLeft: empty, HiExclamationTriangle: empty };
    if (name.endsWith("/store")) return { useAppDispatch: () => () => {} };
    if (name.endsWith("cart.slice")) return { cartActions: {}, CartPage: {} };
    if (name.endsWith("cart.selector")) return { selectCartState: () => {} };
    if (name.endsWith("cart.conflicts")) return { findCartTimingConflicts };
    if (name.endsWith("CartItem")) return { default: empty };
    if (name.endsWith("DashboardUI")) return {
      DashboardPage: ({ children }) => React.createElement("main", null, children),
      DashboardPanel: ({ children }) => React.createElement("section", null, children),
      DashboardEmpty: empty,
    };
    if (name.endsWith("dashboard.styles")) return {
      actionClass: "", dateText: value => new Date(value).toISOString(), priceText: String,
    };
    return require(name);
  };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.resolve(__dirname, "../src/components/Dashboard/Cart/pages/CartsList.tsx"), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, { exports: pageExports, require: mockRequire });
  const render = () => renderToStaticMarkup(React.createElement(pageExports.default));
  const html = render();
  assert.match(html, /role="alert"/);
  assert.match(html, /bg-red-50/);
  assert.match(html, /خریداری‌شده/);
  assert.match(html, /در سبد خرید/);
  assert.match(html, /2026-10-06T10:00:00.000Z/);
  assert.match(html, /href="\/profile\/cart\/checkout"/);
  items = items.filter(entry => entry.payment_state === "COMPLETED");
  assert.doesNotMatch(render(), /role="alert"/);
});
