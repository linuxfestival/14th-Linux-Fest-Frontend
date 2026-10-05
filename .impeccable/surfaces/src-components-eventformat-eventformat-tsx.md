---
version: 1
slug: "src-components-eventformat-eventformat-tsx"
primary_target: "src/components/EventFormat/EventFormat.tsx"
related_targets: []
---

Mode: Read. Scope: /event-format only. Explain the festival's three days in conversational Persian, helping visitors understand each format and preparation needs before choosing an offering.

## Direction contract

THESIS: A quiet editorial guide, organized by day, with the whole explanation available for reading.
OWN-WORLD: Extend the incumbent FAQ surface: pale ground, navy headings, blue body text, Vazirmatn, generous reading line-height and restrained orange links. Use the shared Header and Footer; inherit tokens from src/index.css without changing the visual system.
STORY: Wednesday introduces online presentations and Install Fest; Thursday distinguishes technical presentations from hands-on workshops; Friday explains a gathering for Linux and open-source enthusiasts. Do not mention booths or use «جامعه» in user-facing Persian copy.
FIRST VIEWPORT: A clear page title and short introduction beneath the fixed header, followed by day navigation and the first day's explanation.
FORM: Persian RTL reading sections with semantic heading hierarchy, subtle day separators and a limited preparation callout. At desktop widths, day anchors form a sticky sidebar; below the large breakpoint they become a wrapping horizontal row above one reading column. Anchor offsets keep section headings clear of the shared fixed header. Links expose visible keyboard focus and comfortable touch targets.
FINISH: Compare the shipped surface with src/components/FAQ/FAQ.tsx, src/components/Header/StickyHeader.tsx and src/index.css; record review and validation evidence without expanding this scoped extension into a global design-documentation task.

## Content and implementation constraints

Follow PRODUCT.md and CONTENT.md for audience, conversational Persian, RTL and the collective term «ارائه‌ها». Keep beginner preparation understandable while acknowledging that prerequisites depend on each offering. Distinguish listening in a presentation from doing exercises in a workshop. Keep the offering link connected to /workshops. Isolate the English Install Fest name with bidirectional markup.

Day structure comes from the task's confirmed event-format direction. Do not extrapolate dates, venue, prices, availability, registration status or sponsor claims. Refer preparation details to the relevant guide or offering; do not invent a guide destination or unconfirmed requirements.

Implementation references: src/components/EventFormat/EventFormat.tsx owns this surface; src/components/FAQ/FAQ.tsx supplies the inherited reading typography, spacing and palette; src/index.css owns global colors, Vazirmatn, RTL and scrolling defaults; src/components/Header/StickyHeader.tsx supplies the shared fixed navigation behavior; src/components/Footer/Footer.tsx supplies the shared footer.

## Documentation evidence

PRODUCT.md, CONTENT.md, the incumbent FAQ surface brief and the implementation references above were inspected. Root DESIGN.md and .impeccable/design.json were already absent. This change adds only this surface brief and preserves existing design files. The independent finish reviewer returned Ship with no blocking findings and required no page changes. Build and browser evidence belong to the implementation finish review.
