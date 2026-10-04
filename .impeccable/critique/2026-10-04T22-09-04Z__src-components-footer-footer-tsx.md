---
target: footer
total_score: 14
max_score: 24
na_heuristics: 1,5,7,9
p0_count: 0
p1_count: 1
target_identity: "file:/home/duckwichtrust/Desktop/Projects/Uni/linux-fest/src/components/Footer/Footer.tsx"
target_fingerprint: "sha256:5694637a8e158c6ed266ab9375e1805e94703f4a770759651e1fdadd1638f260"
target_path: /home/duckwichtrust/Desktop/Projects/Uni/linux-fest/src/components/Footer/Footer.tsx
timestamp: 2026-10-04T22-09-04Z
slug: src-components-footer-footer-tsx
---
Method: dual-agent (A: /root/footer_design · B: /root/footer_evidence)

The footer is visually calm and readable, but its content weakens the page’s final impression. Correct sponsorship first, then make it a useful, compact ending for visitors deciding whether to participate.

### Design health: 14/24 — Acceptable

Scores are out of 4; inapplicable heuristics are excluded.

| Heuristic | Score | Finding |
|---|---:|---|
| System status | n/a | Static links; no stateful workflow |
| Real-world match | 2 | Beginner entry helps; sponsor identity is inaccurate |
| User control | 3 | Standard links, limited onward navigation |
| Consistency | 2 | Coherent styling; contradictory sponsor attribution |
| Error prevention | n/a | No input or destructive action |
| Recognition | 2 | Clear headings; duplicated destinations and missing utility links |
| Efficiency | n/a | No expert workflow to assess |
| Minimalist design | 3 | Clean desktop composition; excessive mobile length |
| Error recovery | n/a | No local error state |
| Help/documentation | 2 | Existing FAQ is absent from footer |

### Design specificity

Persian RTL, university identity, and technical subjects ground it in Linux Fest. The four-column composition remains conventional; clearer organizer/sponsor roles and useful participation links would give it stronger purpose.

The source detector returned **0 findings** for Footer.tsx. The browser detector logged six homepage patterns without footer attribution, so they are excluded from this critique. Neither scan invalidates the manual findings. Injection succeeded in a headless browser; no user-visible overlay remains.

### What works

- Muted text has **7.69:1 contrast** against the blue background; headings are stronger still.
- Semantic lists, descriptive image alternatives, named social links, and explicit focus styles provide a good foundation.
- «شروع لینوکس!» gives beginners an approachable entry point.

### Priority issues

1. **P1 — Incorrect sponsor attribution.** The logo, text, and link name Divar, while project context and the preceding sponsor section identify System Group. This undermines trust and blurs organizer/sponsor roles. Separate those roles and use confirmed System Group text; use approved artwork and destination when available. Never relabel the Divar logo. Suggested command: `$impeccable clarify footer`.
2. **P2 — Weak final navigation.** Seven workshop entries lead to only five destinations, with no «مشاهده ارائه‌ها» or FAQ link. A hesitant visitor lacks a clear route to compare offerings or resolve questions. Replace repeated links with a compact utility group using existing routes. Session IDs need edition-aware maintenance; their availability was not verified. Suggested command: `$impeccable shape footer`.
3. **P2 — Small touch targets.** Workshop anchors are **22px high**; Telegram and Instagram are **40×40px**. This makes tapping less forgiving. Give links padded clickable rows of at least 44px and consistently sized social wrappers. These measurements alone do not establish a WCAG failure. Suggested command: `$impeccable adapt footer`.
4. **P2 — Oversized mobile ending.** The footer measures **471px** high at desktop and **943px** at 390px mobile width, longer than an 844px viewport. It also stacks into one column at 941px. Add an intermediate two-column layout, reduce intergroup gaps, and remove duplicated content. Suggested command: `$impeccable layout footer`.
5. **P2 — Missing footer landmark.** The global footer sits inside `<main>` and lacks a contentinfo landmark in the accessibility tree. Screen-reader users cannot jump to it as the site footer. Move it outside main and verify other layouts. Suggested command: `$impeccable audit footer`.

### Persona red flags

- **Jordan, first-time visitor:** Technical groups lack an all-offerings escape or footer FAQ; conflicting sponsor names reduce confidence.
- **Sam, screen-reader user:** Accessible link names help, but the footer landmark is absent. The university mark is also visually dark against the background.
- **Casey, mobile visitor:** Small targets demand precision, and the long stacked footer requires another scroll to reach the trust seal.

### Minor observations

Social icons use inconsistent sizes and visual treatments. No individual group exceeds three choices; cognitive load comes from duplication and unclear roles, rather than excessive options. All footer assets loaded. External destinations and session availability were not validated.

### Questions to consider

1. Which should lead the next pass: accurate sponsor identity, useful navigation, or mobile compactness?
2. What scope fits: the top three findings, or all five while preserving the current visual style?
