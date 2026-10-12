import { makeCall } from "../../utils/makeCall";
import type { BundleDto, BundleSelectionDto } from "./bundles.types";

export const getBundles = makeCall<void, BundleDto[]>("/api/bundles/", "GET");
export const getBundle = makeCall<void, BundleDto>((params) => `/api/bundles/${params.id}/`, "GET");
export const getBundleCart = makeCall<void, BundleSelectionDto[]>("/api/bundles/cart/", "GET", true);
export const addBundleToCart = makeCall<void, unknown>((params) => `/api/bundles/${params.id}/add_to_cart/`, "POST", true);
export const removeBundleFromCart = makeCall<void, void>((params) => `/api/bundles/${params.id}/remove_from_cart/`, "DELETE", true);
