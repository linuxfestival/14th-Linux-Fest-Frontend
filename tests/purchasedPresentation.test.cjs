const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const React = require("react");

const presentation = {
  id: 7, service_type: "WORKSHOP", fa_title: "ارائه", en_title: "Talk",
  fa_description: "", en_description: "", tags: [], presenters: [],
  start: "2026-10-05T09:00:00Z", end: "2026-10-05T10:00:00Z",
  capacity: 10, remained_capacity: 5, cost: 100, is_registration_active: true,
};
let state;
let dispatched;
const empty = () => null;
const cache = new Map();

// Load the actual selectors and both UI paths with only framework boundaries mocked.
function load(relative) {
  const file = path.resolve(__dirname, "../src", relative);
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const mockRequire = (name) => {
    if (name === "react") return {
      ...React, useState: value => [value, () => {}], useEffect: () => {},
    };
    if (name === "react-redux") return { useSelector: selector => selector(state) };
    if (name === "react-router-dom") return { useParams: () => ({ id: "7" }), Link: empty };
    if (name === "react-helmet-async") return { Helmet: empty };
    if (name === "react-toastify") return { toast: { info: () => {} } };
    if (name.startsWith("react-icons/")) return new Proxy({}, { get: () => empty });
    if (name.endsWith("/store")) return { useAppDispatch: () => action => dispatched.push(action) };
    if (name.endsWith("auth.selector")) return { selectIsAuthenticated: () => true };
    if (name.endsWith("presentations.selector")) return { selectCurrentPresentation: () => presentation };
    if (name.endsWith("cart.thunk") || name.endsWith("presentations.thunk")) return new Proxy({}, { get: (_, key) => id => ({ type: key, id }) });
    if (name.endsWith("Header") || name.endsWith("Footer")) return { default: empty };
    if (name.endsWith("PresenterCard")) return { PresenterCard: empty };
    if (name.endsWith("workshops.adapter")) return { toWorkshopItem: p => ({
      title: p.fa_title, service: p.service_type, remaining: p.remained_capacity,
      registrationActive: p.is_registration_active, price: p.cost, tags: [],
    }) };
    if (!name.startsWith(".")) return require(name);
    const target = path.resolve(path.dirname(file), name);
    const resolved = [target, `${target}.ts`, `${target}.tsx`].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
    return load(path.relative(path.resolve(__dirname, "../src"), resolved));
  };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, { exports, require: mockRequire });
  return exports;
}

function nodes(element) {
  if (!element || typeof element !== "object") return [];
  if (Array.isArray(element)) return element.flatMap(nodes);
  if (typeof element.type === "function") return nodes(element.type(element.props));
  return [element, ...nodes(element.props?.children)];
}
function text(element) {
  if (Array.isArray(element)) return element.map(text).join("");
  if (typeof element === "string") return element;
  return element && typeof element === "object" ? text(element.props?.children) : "";
}

for (const [name, file, props] of [
  ["card", "components/WorkshopsList/components/WorkshopCartAction.tsx", { id: 7, unavailable: false, featured: false }],
  ["detail page", "components/Workshop/Workshop.tsx", {}],
]) {
  for (const payment of ["COMPLETED", "PENDING", "FAILED", null]) {
    test(`${name}: ${payment || "new item"} has the correct purchase action`, async () => {
      dispatched = [];
      state = { cart: { items: payment ? [{ id: 70, presentation, payment_state: payment }] : [] } };
      const rendered = nodes(React.createElement(load(file).default, props));
      const button = rendered.find(node => node.type === "button" && node.props.onClick);
      assert.ok(button);
      if (payment === "COMPLETED") {
        assert.equal(text(button), "خریداری شده");
        assert.equal(button.props.disabled, true);
        await button.props.onClick();
        assert.equal(dispatched.length, 0, "Purchased items must not be modified");
        assert.ok(!rendered.some(node => text(node) === "این ارائه در سبد خرید توست."));
      } else {
        assert.equal(text(button), payment ? "حذف از سبد خرید" : "اضافه به سبد خرید");
        assert.equal(Boolean(button.props.disabled), false);
      }
    });
  }
}
