---
version: 1
slug: "src-components-onboarding-onboarding-tsx"
primary_target: "src/components/Onboarding/Onboarding.tsx"
related_targets: []
---

# Onboarding

Mode: Operate. A scoped extension of the existing auth flow for first-login attendees, not a new visual identity. Preserve the eight referral values, optional university, optional partner-notification consent, existing get/save API and home redirect.

## Direction contract

THESIS: Finish account setup in one understandable form; replace the isolated dark panel with the established auth shell.

OWN-WORLD: Inherit AuthLayout's navy/orange, white form, Persian Vazirmatn and existing decorative penguin. Reuse fields and submit controls without changing other auth pages.

STORY: Load existing answers, choose referral source, optionally enter university and opt into partner announcements, then save and continue. Keep consent explicit and user-controlled.

FIRST VIEWPORT: Form right and decorative navy panel left on desktop; form only on mobile. A clear completion heading and description, required referral select, optional university input, distinct opt-in area and orange submit. Initial loading and retryable fetch error replace the form until data is ready.

FORM: Precisely specified, code-led local extension; no concept seed or approved comp. Native labelled select/checkbox/form, focus on invalid source, fields locked during save, retained input on server error.

FINISH: Scoped finish review, verdict and local documentation. Global PRODUCT/DESIGN absence is pre-existing and outside this auth extension; existing implementation is authority. No new or modified rasters.
