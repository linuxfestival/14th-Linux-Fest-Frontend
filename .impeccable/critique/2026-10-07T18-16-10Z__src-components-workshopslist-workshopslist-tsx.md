---
target: workshops page
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/home/duckwichtrust/Desktop/Projects/Uni/linux-fest/src/components/WorkshopsList/WorkshopsList.tsx"
target_fingerprint: "sha256:046c29b6b97eac30a86aa07f5bc25f8aa1f32a623dcc49f74291a78ecf5b7da3"
target_path: /home/duckwichtrust/Desktop/Projects/Uni/linux-fest/src/components/WorkshopsList/WorkshopsList.tsx
timestamp: 2026-10-07T18-16-10Z
slug: src-components-workshopslist-workshopslist-tsx
---
Method: dual-agent (A: /root/design_review · B: /root/detector_evidence)

The workshops page feels like a course marketplace. The underlying browsing tools are useful, but its composition gives filters, repeated format artwork, and transactions more prominence than subjects, presenters, and learning together.

## Design health

| Heuristic | Score /4 | Finding |
|---|---:|---|
| System status | 3 | Loading and cart states exist; no result count. |
| Real-world match | 3 | Useful Persian logistics; English tags weaken fit. |
| User control | 2 | Reset omits search, format, and day changes. |
| Consistency | 3 | Shared visual tokens; inconsistent voice and half-spaces. |
| Error prevention | 3 | Disabled unavailable/pending actions; guests encounter avoidable rejection. |
| Recognition | 3 | Logistics visible; clamped descriptions may hide suitability. |
| Efficiency | 2 | Useful combined search/filters; context is not persistent. |
| Aesthetic/minimalist design | 2 | Repeated artwork and control-first framing waste attention. |
| Error recovery | 2 | Catalog retry works; guest cart action lacks direct login continuation. |
| Help | 2 | Shared FAQ; little contextual suitability/account guidance. |
| Total | 25/40 | Acceptable usability; weak design specificity. |

## Design specificity and overall impression

Navy, orange, blue, Vazirmatn, RTL, and the Linux identity are coherent with the existing site. The structure is interchangeable with a course marketplace: identical cards, repeated microphone imagery, search/sort first, learning and people later. A stronger entrance and less repetitive space allocation offer more value than adding decoration.

## Strengths

- Dates, times, presenter avatars, price, and availability support actual participation decisions.
- Loading, unavailable, pending, purchased, error, and empty states exist.
- RTL, mixed-language direction, Persian digits/dates, and visible focus states receive explicit attention.

## Priority issues

1. **P2 — No authored entrance.** The page starts with a filter panel, without a heading or invitation. Add a compact «ارائه‌ها» heading and natural invitation consistent with CONTENT.md, then show offerings promptly. Source: WorkshopsList.tsx, WorkshopsFilter.tsx. Suggested command: $impeccable shape.
2. **P2 — Repeated artwork overwhelms meaningful differences.** The first three desktop talks repeat the same large microphone illustration. Reduce fallback illustration height; let titles, presenters, and topics lead. Reserve prominent artwork for genuine session-specific images. Source: WorkshopCard.tsx, workshops.adapter.ts. Suggested command: $impeccable bolder / $impeccable layout.
3. **P1 — Mobile browsing delays choice.** At 390×844, header and controls consume roughly 430px, followed by a 176px illustration. The first card's price/actions fall below the viewport. Keep search and format visible; collect secondary filters under one mobile filter control and compress fallback artwork. Source: WorkshopsFilter.tsx, WorkshopsList.tsx, WorkshopCard.tsx. Suggested command: $impeccable adapt.
4. **P1 — Guest participation stalls.** Add-to-cart gives guests a login-required toast without a direct continuation. Explain the requirement and provide a login action preserving the chosen offering. Source: WorkshopCartAction.tsx. Suggested command: $impeccable clarify.
5. **P2 — Filter reset is incomplete.** Toolbar reset appears for sort/availability only, despite active search/day/format filters. Use complete filter state and show a concise result count. Source: WorkshopsList.tsx:129, WorkshopsFilter.tsx. Suggested command: $impeccable polish.

## Cognitive load and emotional journey

Moderate cognitive load: hierarchy, sequencing decisions, and progressive disclosure fail; basic grouping and logistics work. The global desktop navigation has six destinations; observed format/day/sort groups each have three options, so they are not a single overloaded choice group.

Arrival is calm but impersonal. Repeated artwork flattens exploration. Logistics reassure at the decision point. Guest login rejection interrupts momentum. Authenticated purchase completion was not exercised.

## Persona red flags

- First-time Linux visitor: unclear entrance, untranslated level tags, limited suitability guidance, and an undisclosed login requirement.
- Distracted mobile visitor: no complete session decision within the initial 844px viewport; repeated illustration panels prolong scrolling.
- Filter-heavy visitor: toolbar reset is absent for search/day/format alone; route navigation does not preserve locally held filter state.

## Minor observations

Online attendance is repeated in tags and logistics. One visible description is a literal hyphen. Format labels omit Persian half-spaces. Cards use h3 without a catalog heading. Non-online cards infer an Amirkabir venue without independent current-edition confirmation; preserve actual data rather than assuming it. Decorative fallback image alt repeats adjacent title. Do not invent levels absent from API evidence.

## Questions to consider

Could subjects and presenters carry the page's character while format illustrations become supporting cues? What would help a beginner choose an offering confidently within ten seconds?

## Detector evidence

One CLI scan of src/components/WorkshopsList returned exit 0 and an empty findings array: zero mechanical findings and zero false positives. Independent populated headless Chromium captures at 1440×1000 and 390×844 corroborated repeated artwork and the control-heavy opening. Native browser transport failed for the assessment agents; mutable injection preflight failed with ECONNREFUSED at 127.0.0.1:9234. No detector overlay was shown. A clean mechanical scan does not establish visual quality or accessibility.
