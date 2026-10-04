# Staff directory

`/staff` renders the server's staff directory inside the shared header and footer. Each card shows a profile photo, full name, role and available contact links. Team sections are retained; cards have no detail action, biography, quote or modal.

## Components and data

- `Staff.tsx` fetches `GET /api/staff/` through `makeCall`, manages loading/ready/error states and renders team sections.
- `StaffCard.tsx` renders one semantic article with a named heading, role and optional contact group. It shares `PresenterAvatar` with presenters: photos load lazily, have name-based alternative text and fall back to a person icon when absent or broken.
- `staff.adapter.ts` owns grouping, translated role labels and contact extraction. `StaffModel` declares the core fields and optional `linkedin`, while permitting additional server fields.

Groups appear in this order: directors, scientific, technical, graphics, marketing, executive, media and decoration. Directors are assigned to the directors group regardless of their supplied team. Missing teams appear under “سایر همکاران”; unknown teams retain their server label after known groups. Heads appear first within each team, preserving every head and all other members. Directors read “دبیر جشنواره”; heads and staff read the translated team responsibility. Unknown roles retain their value, with a missing-role fallback.

Contact extraction accepts non-image string fields and social/link/contact collections, including nested arrays or objects up to three levels. Objects can supply `url`, `href` or `link` and a platform/type hint. Valid email contacts use `mailto:`; web contacts accept HTTP(S), protocol-relative URLs and ordinary domains normalized to HTTPS. Script schemes, credential-bearing URLs and malformed values are rejected; normalized destinations are deduplicated. Known social hosts receive platform names and icons, other web hosts receive a website label. Web links open a new window with `noopener noreferrer` and an accessible notice; email links do not. Contact controls have visible keyboard focus and at least 44px height. Links are derived only from server values.

## Incumbent visual system

The card shell, photo area and name styling directly match `Presenters/PresenterCard.tsx`: white cards, 12px rounded corners, a navy border at 15% opacity, a 192px pale-blue photo area, circular 112px avatars increasing to 128px from 640px, a 4px white avatar ring and 24px body padding. Names use 20px extra-bold type with 32px line height; roles use 14px type with 28px line height. Depth comes from the border and color areas rather than shadows.

The existing Tailwind theme in `src/index.css` supplies navy (`#0B0D31`), blue (`#0A3D77`), pale blue (`#7EC8F3`, used at 20% opacity), page background (`#F3F6F8`), orange (`#F7941D`) and link-hover orange (`#A84D00`). The global font is Vazirmatn with a sans-serif fallback. This surface extends the presenter design; it does not establish a new global identity.

## Layout and states

The RTL page uses a centered container up to 1280px. Cards form one column below 640px, two from 640px and three from 1024px, with 24px gaps and 48px between team sections. Horizontal page padding is 20px, increasing to 32px from 640px and 40px from 1024px. Names, roles and contacts wrap; mixed-direction content uses automatic text direction.

Loading renders three skeleton cards in an announced status region; pulse animation respects reduced motion. An empty response shows the unpublished-information message. A failed request shows an alert and retry button; retry returns to loading and makes a fresh request. Unmounted requests cannot update state.

## Verification and data limits

Production build and targeted lint passed. Browser checks covered 320, 390, 768, 1024, 1440 and 1718px widths, including ready, loading, empty, error and retry states, with no horizontal overflow or page errors. Test-only fixtures checked all seven staff records exactly once, multiple heads, safe/deduplicated contacts and photo fallback. Six desktop/mobile/state captures were reviewed with a ship verdict and no material fixes; source detection reported no findings.

The live endpoint returned HTTP 200 with an empty array during verification. Additional contact shapes were verified using isolated fixtures, not observed live. No fixture data, fabricated profile links or new raster assets ship. Root `PRODUCT.md`, `DESIGN.md` and the design sidecar remain absent or untouched; this component document records the narrow presenter extension.
