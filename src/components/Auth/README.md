# Authentication UI

Login, signup, password recovery, and first-login onboarding share `AuthLayout`, `AuthField`, and
`AuthSubmit`. Their layout
inherits the existing navy/orange palette, Vazirmatn, pale blue illustration, and
rounded controls. The white form sits beside the navy illustration panel on
desktop; smaller screens show the form only. It is standalone, with home and
authentication links, rather than the main site navigation. The existing terminal
art is decorative; this extension creates or changes no raster assets.
`AuthLayout` accepts an optional description for recovery instructions; omitting
it preserves the existing login/signup prompts.

The shared field uses real labels, autocomplete, linked error/hint text, and
password visibility buttons. Forms submit through native form events, validate
all fields with the existing input handlers, and focus the first invalid field.
Fields and submission are disabled while their form's loading state is active:
login/signup use Redux auth state, and recovery uses local request state. The
submit control announces loading and prevents repeat submissions.
Signup retains the existing password rule and Persian-to-Latin phone conversion.

Recovery first requests a code for the email, then presents the six-digit code,
new password (at least eight characters), and matching password confirmation.
The second stage displays the email captured by the successful request and uses
it for resend and confirmation. Changing email clears the code, passwords, and
their errors, then returns focus to email. Entering the code stage focuses the
code field. Resend and email changes are disabled while a request is loading.
Resend also has a 90-second countdown after every successful send. It uses an
absolute deadline to stay accurate when the tab is backgrounded, and failed
resends remain retryable. Changing email clears this local cooldown.
API errors appear inline without discarding input; success returns to `/login`.

Onboarding loads existing answers before showing its form and offers retry when
that request fails. Its required native referral select preserves all eight API
values, links its inline validation error, and receives focus when unanswered.
University and partner-announcement consent are optional; consent reflects the
API prefill and remains user-controlled. Saving locks the controls, retains
answers on inline API errors, and returns home after success. Attendees who have
already completed onboarding also return home through the existing get/save API
flow. Intercepted browser checks cover prefill, referral values, validation,
consent payloads, Enter submission, request failures, loading locks, and redirects
at widths from 320–1440px.

Existing reset endpoints, Redux thunks, secure/Strict cookies, email-verification
redirects, and onboarding redirects remain. Shared legacy `Input` and `Button`
components are unchanged. Browser checks intercept authentication and recovery
POST requests; they exercise responsive layouts (320–1440px), validation,
request errors, loading locks, resend, email changes, and the successful login
redirect without creating accounts or verifying production credentials.
