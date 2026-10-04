---
version: 1
slug: "src-components-paymentstatus-paymentstatus-tsx"
primary_target: "src/components/PaymentStatus/PaymentStatus.tsx"
related_targets: []
---

Mode: Operate. Scope: /payment/perhaps and its callback states only. Festival attendees returning from the gateway need to understand the verified outcome, retain a transaction identifier, and safely continue to their cart or registered workshops.

Keep the established navy/orange, Vazirmatn, pale ground and native controls. Do not initiate purchases in QA, invent totals or financial guarantees, or equate Status=OK with verified success. Use ارائه for festival offerings. This is a code-led, narrowly scoped extension of the established transactional UI; no new raster assets or global design-system changes.

## Direction contract
THESIS: A trustworthy result and its next action lead; the transaction record stays adjacent instead of hiding below an animated error tile.
OWN-WORLD: Navy transaction rail, white reading surface, pale background, orange recovery action, inherited typography and 12px corners. Semantic green/red only identify outcome.
STORY: Read the outcome, understand verification uncertainty, copy the gateway identifier, and continue without an automatic new charge.
FIRST VIEWPORT: Compact festival masthead; a centered two-column result panel with status, explanatory text and action on the right, transaction details on the left. Mobile stacks result before details without clipping.
FORM: Direct extension of the established transactional shell; seed key not applicable to this narrowly specified inherited-world task. Signature interaction: transaction copy confirmation and a stable verification state that never flashes premature success. Motion only on pending-state spinner, respecting reduced motion.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Finish evidence

User confirmed the direction. Build and target ESLint passed. Intercepted browser tests covered NOK, pending, verified success/failure, uncertainty/retry, HTTP errors, malformed links, clipboard feedback, and widths 320–1718px. No real payment verification or purchases occurred. The source detector returned no findings. Independent finish review: ship, no material issues. This inherited-world extension documents its behavior locally in src/components/PaymentStatus/README.md; global design-system files remain unchanged and no raster assets were produced.
