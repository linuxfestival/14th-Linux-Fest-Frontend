# Bundle integration

These are the frontend's expected backend contracts, defined in
`bundles.types.ts` and `bundles.api.ts`. Bundles are separate from the existing
`PresentationService.PACKAGE` offering type.

Bundle members are presentation records and may be `TALK`, `WORKSHOP`, or a
mixture. Use «بسته‌ها» for the collection and «بسته‌ها» in compact
navigation; label individual `TALK` members «ارائه» and `WORKSHOP` members
«کارگاه». Do not infer workshop-only membership from the bundle API.

The public `/bundles` page owns catalog discovery through `BundlesList`.
`/workshops` links to it through `BundlesBanner` above the individual filters
and does not fetch the bundle catalog. Catalog loading, retry, and empty states
are handled on `/bundles`; an empty response links back to individual offerings.
The shared header navigation, landing hero, landing bundle section, and Footer
also expose `/bundles`. These entry points link to discovery without loading
the bundle catalog themselves.

| Operation | Endpoint | Authentication |
| --- | --- | --- |
| List bundles | `GET /api/bundles/` | Public |
| Bundle detail | `GET /api/bundles/:id/` | Public |
| Cart selections | `GET /api/bundles/cart/` | Required |
| Add whole bundle | `POST /api/bundles/:id/add_to_cart/` | Required |
| Remove whole bundle | `DELETE /api/bundles/:id/remove_from_cart/` | Required |

A bundle supplies its name, optional description, tags, member presentation
records, fixed `price`, separate-purchase `original_price`, remaining capacity,
and backend-calculated availability. Supported unavailable reasons are
`inactive`, `insufficient_presentations`, `started`, `registration_closed`, and
`sold_out`. The frontend translates these reasons rather than deriving bundle
availability from individual members.

Cards show start and end times from the member records and link each whole row
to its offering details. A savings comparison appears only when
`original_price - price` is positive; the fixed `price` remains the payable
bundle subtotal. UI structure is documented in
[the bundles route handoff](../../components/Bundles/README.md).

A cart selection contains its own `id`, the bundle record, and
`participation_ids`. Presentation cart rows belonging to that selection must
carry its numeric `bundle_selection`; standalone rows carry `null` (omission is
also accepted for older responses). The backend must apply whole-bundle add and
remove operations atomically and enforce membership, availability, and purchase
constraints.

## Refresh and pricing

`getCartThunk` requests presentation rows and bundle selections together and
commits them as one Redux update only when both succeed. The latest refresh
request wins. Failure retains the previous data, marks the cart unreadable for
checkout, and offers retry. Bundle mutations await this refresh before reporting
success; no member rows are assembled optimistically.

`cart.pricing.ts` counts each bundle selection once at its fixed price, plus
unpaid standalone rows and selected accessories. Bundle member rows and completed
payments are excluded from the standalone subtotal. Coupons affect the eligible
standalone/accessory subtotal; bundle prices remain unchanged. Refresh clears the
previous coupon result so checkout must validate it against the current cart.

Receipts read optional `PaymentDto.bundle_snapshot` entries containing
`bundle_id`, `name`, `price`, and `presentation_ids`. The receipt displays the
stored bundle name and price alongside payment participations, without fetching
the current bundle catalog. Older payments without snapshots remain supported.
