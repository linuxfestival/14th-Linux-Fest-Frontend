import type { BundleSelectionDto } from "../bundles/bundles.types";
import type { CartItemDto } from "./cart.types";

export const standaloneCartItems = (items: CartItemDto[]) =>
  items.filter(item => item.payment_state !== "COMPLETED" && item.bundle_selection == null);

export const calculateCartPrice = (items: CartItemDto[], bundles: BundleSelectionDto[], accessoryTotal = 0, percentage = 0) => {
  const standaloneTotal = standaloneCartItems(items).reduce((total, item) => total + Number(item.presentation.cost), 0);
  const bundleTotal = bundles.reduce((total, selection) => total + Number(selection.bundle.price), 0);
  return {
    totalAmount: standaloneTotal + accessoryTotal + bundleTotal,
    // Bundle prices are never coupon eligible. Eligibility/scoping is enforced by checkout.
    discountedAmount: (standaloneTotal + accessoryTotal) * (100 - percentage) / 100 + bundleTotal,
  };
};
