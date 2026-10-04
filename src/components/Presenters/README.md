# Presenters page

`Presenters.tsx` loads real presenters from the existing Redux thunk and displays
a responsive RTL grid in the Home/catalog palette. Local request state keeps
loading, failure/retry, and empty states separate from other presentation requests.

`PresenterCard.tsx` displays the name, plain-text biography excerpt, API portrait,
and a native button for the full biography. `PresenterAvatar.tsx` provides a person
icon while a portrait is unavailable or fails. No fixtures or new image assets
are used.

`PresenterModal.tsx` uses a portal and native modal dialog. It restores focus and
prior body/root overflow on close, supports Escape and backdrop dismissal, wraps
keyboard focus within its controls, and keeps its header/close button visible
while long biographies scroll. The biography region is keyboard-scrollable.
Email and LinkedIn are shown on cards and in the dialog when supplied. Email
uses `mailto:` and preserves readable LTR addresses; LinkedIn opens with
`noopener noreferrer` and announces the new window. Missing contacts are omitted.
Biography HTML follows the existing trusted-API rendering path; no client-side
sanitizer is introduced.

`Workshop/PresenterCard.tsx` remains a compatibility export. Workshop details
continue to use their own inline presenter biographies.
