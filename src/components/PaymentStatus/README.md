# Payment status

`PaymentStatus.tsx` serves `/payment/perhaps`, the gateway return page. It explains the payment outcome, retains the gateway identifier for follow-up, and offers an appropriate next action. Festival offerings use «ارائه» in user-facing copy.

## Callback states

A valid callback has a nonempty, trimmed `Authority` and a case-sensitive `Status` of `OK` or `NOK`. `Status=OK` alone never means the payment succeeded.

| Callback / verification result | Visible state | Verification request |
| --- | --- | --- |
| Valid `NOK` | Payment incomplete | None |
| Valid `OK`, awaiting the server | Checking | One request |
| Server status `success` | Confirmed success | Completed |
| Server status `failed` | Payment incomplete | Completed |
| Unexpected server status or rejected verification | Outcome unknown | Completed; explicit retry available |
| Missing authority or missing/invalid status | Invalid return link | None |

The request ref reuses the same authority/attempt promise during React StrictMode effect replay. Cleanup ignores stale responses, and displayed verification must match the current query and attempt. Retry increments the attempt, returns to checking, and starts one additional verification. A server reference (`ref_id`) appears only after verified success.

## Actions and feedback

- Success: registered workshops at `/profile/workshops`; receipt at `/profile/billing`.
- Incomplete payment: cart at `/profile/cart/list`; payment history at `/profile/billing`.
- Unknown outcome: explicit verification retry, payment history, and a cart link. Copy asks visitors to check the transaction before paying again.
- Invalid return link: payment history. Checking shows a wait message without a purchase action.
- Masthead links return to `/`. Copying the gateway authority confirms «شناسه کپی شد» and announces clipboard success; clipboard rejection gives manual-copy guidance. Query changes reset that feedback.

The result uses a polite live region, the checking section exposes `aria-busy`, controls have visible keyboard focus, and only the pending spinner animates with reduced-motion support. Gateway identifiers remain left-to-right and wrap inside the RTL page.

## Inherited visual system

This page extends the existing transactional UI. `src/index.css` supplies Vazirmatn and the navy (`primary`), orange (`secondary`), pale ground (`text-white`), blue text and muted blue tokens. `Auth/AuthLayout.tsx` establishes the compact festival masthead, white reading panel, navy companion panel, subtle border and 12px outer corners. `Dashboard/dashboard.styles.ts` supplies the shared orange primary action and bordered secondary action directly. Green and red identify the payment outcome.

The panel is two columns from 1024px: the result on the right, transaction details on the left. Below that breakpoint, the result stacks before transaction details; the latter stays available on mobile. Long identifiers wrap without horizontal overflow. The existing logo is reused, icons come from `react-icons`, and no new raster assets were introduced.

Root `PRODUCT.md` and `DESIGN.md` remain absent. This component documentation records the observed local extension; no global design-system or drift repair was performed.

## Verification

Start Vite at `http://localhost:5173`, then run:

```sh
node tests/browser/payment-status.cjs
```

The fixture requires Playwright and Chromium. Optional `PLAYWRIGHT_MODULE` selects the Playwright module, `CHROMIUM_PATH` selects Chromium (default `/usr/bin/chromium`), and `CAPTURE_DIR` saves screenshots to an existing directory. All API traffic is intercepted; the fixture permits only synthetic verification requests and performs no live verification or purchases.

The completed handoff passed build and targeted lint, browser checks for callback states, retry, clipboard success/failure, malformed queries, StrictMode request reuse, and widths 320/390/768/1024/1440/1718px. The source detector returned `[]`; an independent finish review concluded **ship** with no material findings.
