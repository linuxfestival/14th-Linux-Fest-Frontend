---
version: 1
slug: "src-components-forgotpassword-forgotpassword-tsx"
primary_target: "src/components/ForgotPassword/ForgotPassword.tsx"
related_targets: ["src/components/Auth/AuthLayout.tsx"]
---

# Password recovery

Mode: Operate. Existing authentication surface extension for Persian-speaking account holders recovering access. Preserve the password-reset endpoints and login redirect; no new brand or API behavior.

## Direction contract

THESIS: Recovery belongs to the existing login/signup experience. Use a focused two-step native form instead of the old isolated dark panel.

OWN-WORLD: Inherit AuthLayout's navy/orange, white form, Vazirmatn, rounded controls and existing decorative penguin asset. No changes to login/signup defaults.

STORY: Enter email, receive a code, enter code and matching new passwords, then return to login. Keep resend and email correction explicit; show API errors without losing input.

FIRST VIEWPORT: Desktop white form on the right, navy illustration panel on the left; mobile form only. Heading, description, two-stage progress, current inputs and orange submit action. Code stage includes sent email and change-email action.

FORM: Precisely scoped, code-led extension of AuthLayout/AuthField/AuthSubmit; concept seed not applicable. Step transition focuses code input; invalid submission focuses the first invalid field. Existing rasters only.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Scope note: Global PRODUCT.md/DESIGN.md were absent before this task and remain outside this narrow extension. Existing implementation is visual authority; Auth/README documents the local behavior. No rasters created or modified.
