# Workshop detail handoff

`Workshop.tsx` owns `/workshop/:id`, Redux loading/cart actions, metadata, and the shared Header/Footer. `WorkshopDetails.tsx` renders a `PresentationDto` with `inCart`, `authenticated`, `pending`, and `onUpdateCart` props; it owns only the description-language selection.

## Data and states

- The route accepts positive numeric IDs and fetches `GET /api/presentations/:id` through `getPresentationByIDThunk`. It displays only a presentation whose ID matches the route, so the previous program is not shown while another loads.
- Loading uses an announced skeleton with reduced-motion support. Invalid IDs show a return-to-catalog state; rejected requests offer retry. Missing descriptions and presenters have explicit placeholders.
- `toWorkshopItem` supplies the same title, tags, service label, capacity, price, illustration, and fallback assets as the catalog. Start/end values are formatted in `Asia/Tehran`; costs are shown in thousands of toman, with zero shown as free. Existing schedule notes for IDs 15 and 17 remain.

## Layout and identity

The page extends the catalog/Home identity: global Vazirmatn, navy title region, orange add action, pale-blue illustration field, white reading surfaces, and 12px cards. It reuses the existing illustration assets and API image URLs; no new raster assets or global tokens were introduced.

At the `lg` breakpoint, the RTL grid places the title/description/presenters on the right and a 22rem registration panel on the left, sticky below the shared header. Smaller screens stack title, registration, description, and presenters in that order. Rich text wraps and allows code/table overflow within its reading surface.

## Registration and languages

Authenticated users load the existing cart. The update handler guards unauthenticated users with an informational toast and ignores missing-current/pending calls. It adds using the presentation ID, removes using the cart-item ID, and refreshes the cart after a fulfilled mutation. The button disables repeated pending actions and additions when capacity is exhausted or registration is closed; an existing item can still be removed. In-cart state links to `/profile/cart/list`, and eligible signed-out users receive a `/login` link.

Descriptions initially choose Persian when available, otherwise English. When both exist, native buttons expose `aria-pressed` and switch the content's `lang` and RTL/LTR direction. Description and presenter biography HTML comes directly from the existing API via `dangerouslySetInnerHTML`; this component does not sanitize it. Presenter avatars fall back to the person icon on missing/failed images, and LinkedIn links announce their new window.

## Presenter compatibility and review

`PresenterCard` remains re-exported from `Workshop.tsx`, with its implementation extracted to `PresenterCard.tsx`. The `/presenters` route continues to use that export and its existing card/modal behavior; the detail page uses inline biographies instead.

Compared with `WorkshopCard.tsx`, Home's program/pathway components, `src/index.css`, Header, and Footer, the implementation agrees with the existing visual identity. The desktop and mobile captures in `.impeccable/review/workshop-1440.png` and `workshop-390.png` confirm the intended column/stack order for a loaded, signed-out program. Browser review also confirmed loading → failure → retry recovery and the shared card on `/presenters`. Finish review: ship, 8/10, no material findings. Authenticated cart mutations were not submitted during review; verify those against a suitable test account when changing their logic.
