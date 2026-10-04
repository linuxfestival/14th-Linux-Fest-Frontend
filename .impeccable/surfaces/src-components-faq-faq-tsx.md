---
version: 1
slug: "src-components-faq-faq-tsx"
primary_target: "src/components/FAQ/FAQ.tsx"
related_targets: []
---

Mode: Read. Scope: /faq only. User rejected search, sidebar and accordion complexity and requested a simple page with about six or seven questions and their answers. Keep the existing API content source; invent no factual answers and add no production mocks.

## Direction contract
THESIS: Only the questions and answers, always visible, in one quiet reading column.
OWN-WORLD: Existing navy/orange/Vazirmatn, pale ground and white answer surface, 12px corners and subtle separators. Existing sticky header and footer remain unchanged.
STORY: Read each question and its answer without searching, expanding or choosing a category.
FIRST VIEWPORT: Compact page heading and short introduction beneath the sticky header, followed immediately by a single column of visible question-answer articles. No sidebars, search, disclosure buttons, illustrations or extra navigation.
FORM: User-pinned simple static reading structure, direct existing-world extension; no concept seed or comp. Motion limited to reduced-motion-safe loading skeleton. API errors and empty content use concise inline states.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Finish evidence

Fresh independent review of the simplified implementation: ship, no required fixes. Build and target lint passed; detector returned no findings. Intercepted browser QA verified seven always-visible answers at 320–1714px, no extra controls or overflow, and error/retry/empty states. Real FAQ publication remains a content dependency: the existing endpoint returns an empty array. Fixture answers were not shipped. Local notes live in src/components/FAQ/README.md; no global design or raster asset changes.
