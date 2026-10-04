---
target: hero section of landing page
total_score: 19
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 1
target_identity: "file:/home/duckwichtrust/Desktop/Projects/Uni/linux-fest/src/components/Home/components/HeroSection.tsx"
target_fingerprint: "sha256:46b895507ef8c7116f9fe96aecbdeb3a4736aaf8a12c30d506a39d0f37b283a8"
target_path: /home/duckwichtrust/Desktop/Projects/Uni/linux-fest/src/components/Home/components/HeroSection.tsx
timestamp: 2026-10-04T14-14-39Z
slug: src-components-home-components-herosection-tsx
---
Method: dual-agent (A: /root/design_review · B: /root/evidence_review)

The hero feels authored for Linux Fest: Tux, campus imagery, Persian typography, and navy/orange give it recognizable character. Its message is less specific than its visuals. The biggest opportunity is to explain participation as clearly as it announces the festival.

## Design health

| Heuristic | Score /4 | Finding |
|---|---:|---|
| Visibility of status | 2 | Registration wording implies readiness without availability context. |
| Match with real world | 3 | Persian reading flow works; English terminal assumes familiarity. |
| User control | 3 | Standard links; mobile menu closes and Escape works. |
| Consistency | 3 | Similar registration labels lead to different journeys. |
| Error prevention | 2 | CTA misrepresents its program-list destination. |
| Recognition | 3 | Main action visible; audience and participation context unclear. |
| Flexibility | n/a | Expert shortcuts unnecessary for a hero. |
| Aesthetic/minimalist design | 3 | Strong hierarchy; redundant terminal decoration. |
| Error recovery | n/a | No transactional input in this hero. |
| Help/documentation | n/a | Documentation is outside this surface's task. |
| Total | 19/28 | Acceptable (68%). |

## What works

- Tux and campus imagery give the event local identity.
- RTL text leads on desktop and precedes the artwork on mobile.
- Mobile CTA measured 342×52px at 390px width, visible around y=292px. Focus styling and reduced-motion cursor handling exist.

## Priority issues

1. **[P1] Registration wording obscures the next step.** Hero “شروع ثبت نام” goes to /workshops; header “ثبت نام” goes to /signup. Label the hero “مشاهده برنامه‌ها و کارگاه‌ها” and clarify account creation in the header. Command: `$impeccable clarify`.
2. **[P2] The introduction does not welcome beginners.** The subtitle describes offerings but gives little reason to attend and no reassurance about experience level. Use two short lines about learning, experimenting, and meeting the open-source community across skill levels. Command: `$impeccable clarify`.
3. **[P2] Participation context is missing.** The university/Tehran line does not distinguish organizer identity from confirmed venue; current-edition details remain unconfirmed in PRODUCT.md. Use discovery wording until availability is confirmed, then show approved timing/format/status adjacent to the CTA. Invent no event facts. Command: `$impeccable harden`.
4. **[P3] The terminal lacks terminal typography.** Global font-family !important overrides font-mono; computed font was confirmed as Vazirmatn. Scope Persian typography and preserve a monospace stack for the terminal. Hide purely decorative terminal text from assistive technology if retained. Command: `$impeccable typeset`.

## Cognitive load and emotional journey

Hero alone is simple: one CTA and clear groups. Header adds two orange registration actions with different meanings. Mobile menu has five informational links plus account actions. The illustration creates a welcoming first impression; uncertainty about eligibility and the next step weakens the transition to action. Mobile artwork delays practical context after the CTA.

## Persona red flags

- Jordan, first-timer: no explicit beginner welcome; two registration labels lead to different destinations.
- Riley, skeptical visitor: mobile header offers “مسابقه” at /contest, whose route is disabled. Separate header issue; undermines trust.
- Casey, mobile visitor: CTA is reachable, but substantial artwork occupies the remaining hero before practical event information.

## Minor observations and scan

Terminal covers campus detail on 320px mobile. Two blinking cursors divide attention, with reduced-motion handling present. Image precedes heading in DOM despite mobile visual order. Target-only detector returned [] (exit 0): zero findings, no false positives. It does not assess message accuracy or font cascade; source review and A browser inspection found both. No clipping defect inferred merely from overflow-hidden.

## Questions to consider

1. Which promise should lead: learning/community across skill levels, deep technical content, or current-edition registration?
2. Which next step should the button represent: browse programs, create an account, or direct registration when confirmed?
