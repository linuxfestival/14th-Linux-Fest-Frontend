# Bundles route handoff

The public `/bundles` route presents «بسته‌ها»: presentations,
workshops, or mixed selections purchased together. It preserves Persian RTL,
Vazirmatn, shared navy/orange tokens, rounded controls, Header and Footer, and
the existing content width. The enlarged heading and short introduction lead
to `BundlesList`; a back link returns to individual offerings at `/workshops`.

Discovery is available through the orange «بسته‌ها» link in shared desktop and
mobile navigation, the landing hero's secondary link, an orange landing section
after the ticker, the workshop banner above individual filters, and the Footer.
Desktop navigation starts at 1280px so the seven links fit; narrower screens use
the existing mobile menu.

`BundleCard` separates readable white member content from a navy price/action
panel with orange emphasis. They sit side by side on large screens and stack
below that breakpoint. Whole member rows link to details, identify their format,
and show start/end schedules. Pricing includes the fixed total and a
separate-purchase comparison only when the API values show positive savings.
The same card serves the cart, retaining whole-bundle add/remove, login,
availability, pending, and retry behavior.

`BundlesList` owns catalog loading, failure retry, and an empty state linking
back to individual offerings. API, cart refresh, coupon, and receipt assumptions
remain in [bundle integration notes](../../core/bundles/README.md).
