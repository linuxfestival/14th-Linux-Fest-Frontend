# Private Skyroom page

The authenticated dashboard has one **اسکای‌روم** entry at `/profile/skyroom`,
also linked from **کارگاه‌های من**. It displays the logged-in user's saved
Skyroom username/password once and lists all their purchased Skyroom room links.
The same account is used across that user's rooms; different users do not share
a global password.

Data comes from authenticated `GET /api/users/skyroom/`. The frontend uses the
stored backend values rather than calculating credentials from email or phone,
so usernames with collision suffixes and previously saved passwords stay valid.

The password is masked by default, can be revealed or copied, and is hidden when
the browser tab goes into the background. Links open in a new tab with
`noopener noreferrer`. Blank/unsafe links remain disabled. The refresh button
reloads room links without resetting credentials. Loading, 404 (no access), 503
(not configured), authorization, and general error states have distinct UI.

Credentials live only in component state and are cleared when leaving/logout or
refreshing. Skyroom responses and failures are excluded from API debug logging;
no credentials are placed in Redux, localStorage, URLs, or user-visible error
messages. The backend is responsible for per-user authorization and no-store
response headers.

Backend setup: enable **Is Skyroom** and configure **Skyroom room URL** for each
online presentation in the admin. Only completed registrations grant access.
The backend feature and its encryption key must be deployed. Skyroom accounts
must separately be created/imported using the admin's Excel export.

Checks: `pnpm build`, `pnpm test:api`, `pnpm test:skyroom`, `pnpm test:purchase`.
Browser checks also cover desktop/mobile, reveal/copy, room-link safety, 404/503/
server-error recovery, authenticated requests, and logout/anonymous redirect.
