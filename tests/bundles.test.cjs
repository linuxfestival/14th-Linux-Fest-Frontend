const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const { configureStore } = require("@reduxjs/toolkit");

function load(file, mocks = {}) {
  const output = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname, "../src", file), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText, { exports: output, require: name => mocks[name] ?? require(name), console });
  return output;
}
const pricing = load("core/cart/cart.pricing.ts");
const errors = load("core/cart/cart.errors.ts");
const item = (id, cost, bundle_selection = null, payment_state = "PENDING") => ({
  id, bundle_selection, payment_state, presentation: { id, cost },
});
const selection = { id: 900, bundle: { id: 20, price: 120, name: "بسته" }, participation_ids: [1, 2] };

test("mixed cart charges each bundle once and excludes purchased and bundled members", () => {
  const items = [item(1, 100, 900), item(2, 100, 900), item(3, 60), item(4, 80, null, "COMPLETED")];
  assert.equal(pricing.calculateCartPrice(items, [selection], 40).totalAmount, 220);
  assert.equal(pricing.standaloneCartItems(items).length, 1);
  assert.equal(pricing.calculateCartPrice(items, [selection], 40, 50).discountedAmount, 170);
});

test("free bundles and decimal string prices work without member charges", () => {
  const items = [item(1, 100, 900), item(2, 200, 900)];
  assert.equal(pricing.calculateCartPrice(items, [{ ...selection, bundle: { price: "0.00" } }]).totalAmount, 0);
  assert.equal(pricing.calculateCartPrice([item(3, "100.00")], [{ ...selection, bundle: { price: "120.00" } }]).totalAmount, 220);
});

test("failed standalone payments remain payable; legacy nullable field stays compatible", () => {
  assert.equal(pricing.calculateCartPrice([item(1, 50, undefined, "FAILED")], []).totalAmount, 50);
});

function setup(options = {}) {
  const calls = [];
  let items = options.items ?? [item(1, 100), item(2, 100)];
  let bundles = [];
  const fail = options.fail;
  const api = {
    addItemToCart: async () => ({ data: {} }),
    removeItemFromCart: async () => ({ data: {} }),
    getCartPresentations: async () => {
      calls.push("presentations");
      if (options.refreshFailure) throw { message: "offline" };
      return { data: items };
    },
    getAccessoriesList: async () => ({ data: [] }),
    getCouponStatus: async () => ({ data: { is_valid: true, percentage: 50 } }),
  };
  const bundleApi = {
    getBundleCart: async () => { calls.push("bundles"); return { data: bundles }; },
    addBundleToCart: async (body, params) => {
      calls.push(["add", body, params.id]);
      if (fail) throw fail;
      items = [item(1, 100, 900), item(2, 100, 900)];
      bundles = [selection];
    },
    removeBundleFromCart: async (body, params) => {
      calls.push(["remove", body, params.id]);
      if (options.removeFailure) throw options.removeFailure;
      items = []; bundles = [];
    },
  };
  const thunk = load("core/cart/cart.thunk.ts", {
    "./cart.api": api, "../bundles/bundles.api": bundleApi, "./cart.errors": errors,
    "react-toastify": { toast: { info() {}, error() {}, success() {} } },
  });
  const slice = load("core/cart/cart.slice.ts", {
    "./cart.thunk": thunk, "./cart.pricing": pricing,
    "../auth/auth.slice.ts": { logout: { type: "auth/logout" } },
  });
  return { calls, thunk, slice, store: configureStore({ reducer: slice.default }) };
}

test("add converts standalone overlaps, refreshes both endpoints, and counts one product", async () => {
  const { calls, store, thunk } = setup();
  await store.dispatch(thunk.getCartThunk());
  assert.equal(store.getState().totalAmount, 200);
  await store.dispatch(thunk.addBundleToCartThunk(20)).unwrap();
  assert.equal(store.getState().totalAmount, 120);
  assert.equal(store.getState().count, 1);
  assert.equal(store.getState().items.length, 2);
  assert.deepEqual(calls.slice(-3), [["add", undefined, 20], "presentations", "bundles"]);
  await store.dispatch(thunk.removeBundleFromCartThunk(20)).unwrap();
  assert.deepEqual(calls.slice(-3), [["remove", undefined, 20], "presentations", "bundles"]);
  assert.equal(store.getState().count, 0);
  assert.equal(store.getState().totalAmount, 0);
});

test("coupon never reduces bundle charge and logout clears selections and coupons", async () => {
  const { store, thunk } = setup();
  await store.dispatch(thunk.addBundleToCartThunk(20));
  await store.dispatch(thunk.getCouponStatusThunk("HALF"));
  assert.equal(store.getState().discountedAmount, 120);
  store.dispatch(thunk.getCartThunk.pending("old"));
  store.dispatch({ type: "auth/logout" });
  store.dispatch(thunk.getCartThunk.fulfilled({ items: [item(1, 100)], bundles: [selection] }, "old"));
  assert.equal(store.getState().bundles.length, 0);
  assert.equal(store.getState().count, 0);
  assert.equal(store.getState().couponStatus, undefined);
});

test("409 overlap and 503 provider errors preserve selections and reject mutations", async () => {
  const { store, thunk } = setup({ removeFailure: { isAxiosError: true, response: { status: 503 } } });
  await store.dispatch(thunk.addBundleToCartThunk(20));
  const result = await store.dispatch(thunk.removeBundleFromCartThunk(20));
  assert.equal(result.meta.requestStatus, "rejected");
  assert.equal(store.getState().bundles.length, 1);
  assert.equal(store.getState().totalAmount, 120);
  const failed = setup({ fail: { isAxiosError: true, response: { status: 409, data: { code: "already_purchased", presentation_ids: [1] } } } });
  await failed.store.dispatch(failed.thunk.getCartThunk());
  assert.equal((await failed.store.dispatch(failed.thunk.addBundleToCartThunk(20))).meta.requestStatus, "rejected");
  assert.equal(failed.store.getState().totalAmount, 200);
});

test("a partial refresh cannot replace cart state or permit checkout", async () => {
  const { store, thunk } = setup({ refreshFailure: true });
  const result = await store.dispatch(thunk.getCartThunk());
  assert.equal(result.meta.requestStatus, "rejected");
  assert.equal(store.getState().error, true);
  assert.equal(store.getState().bundles.length, 0);
});

test("bundle_changed and bundled-member conflicts explain whole-bundle recovery", () => {
  assert.match(errors.cartErrorText({ code: "bundle_changed" }), /دوباره اضافه/);
  assert.match(errors.cartErrorText({ code: "bundle_item" }), /کل بسته/);
});
