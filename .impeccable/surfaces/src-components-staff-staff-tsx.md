---
version: 1
slug: "src-components-staff-staff-tsx"
primary_target: "src/components/Staff/Staff.tsx"
related_targets: ["src/components/Staff/StaffCard.tsx","src/components/Staff/staff.adapter.ts"]
---

Mode: Read. Scope: /staff only, a directory matching the existing presenter cards without detail actions or modals. Required content: server profile image, full name, role and available social links. Keep current team grouping and order unless the user chooses otherwise; do not hide additional team heads or duplicate directors.

The existing model declares linkedin. Live /api/staff/ currently returns 200 with an empty array, so no live field examples are available. Additional server URL/contact fields should be handled safely without fabricated profile links. Browser fixtures remain test-only. No new photos or global style changes.

## Direction contract
THESIS: A recognizable staff directory, not an interactive biography browser: each card holds exactly the requested identity and contact information.
OWN-WORLD: Inherit presenter cards' pale-blue image area, circular avatars, white bordered 12px cards, navy name, blue role and link treatments, Vazirmatn and sticky site header/footer.
STORY: Scan the team, identify someone's name and responsibility, and open an available social profile.
FIRST VIEWPORT: Compact page title; team headings followed by equal-size responsive presenter-style cards. No search, filters, quote blocks, detail buttons, modal or extra landing section.
FORM: User-pinned presenter-card extension; no seed/comp needed. Social links are native anchors with platform labels and new-window notice. Avatar fallback is shared with presenters; loading motion respects reduced motion.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Finish evidence

- User confirmed team grouping. This is a narrow presenter-style extension: root PRODUCT.md, DESIGN.md and design sidecar remain untouched/absent; local documentation lives in src/components/Staff/README.md.
- Production build and targeted ESLint pass. Source detector returned no findings. No new shipping raster assets.
- Isolated browser fixtures verified all staff records, multiple heads, safe/deduplicated contacts, photo fallback, no card buttons/modals and no horizontal overflow at 320, 390, 768, 1024, 1440 and actual-user 1718px widths. Ready, loading, empty, error and retry states passed with no page errors. Fixtures are not shipped.
- Six full-page captures were viewed and validated. Fresh finish review: disposition ship, no material fixes. Live read-only endpoint still returns HTTP 200 with an empty list; additional contact shapes are fixture-verified rather than observed live.
