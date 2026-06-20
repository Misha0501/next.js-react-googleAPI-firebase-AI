You are working in a Next.js App Router app using Firebase Auth, Firebase Admin, Prisma, and API routes.

Current auth direction:
The app is being migrated to Firebase Admin session cookies.

Expected architecture:
- Firebase Web SDK is used only for login/signup.
- Client signs in with Firebase email/password or Google.
- Client gets a Firebase ID token once.
- Client sends that ID token to /api/auth/session.
- Server verifies the ID token with Firebase Admin.
- Server creates a Firebase Admin session cookie using createSessionCookie.
- Cookie must be httpOnly, secure in production, sameSite, path=/, and have controlled maxAge.
- Client immediately signs out of Firebase client auth after session exchange.
- App state should use /api/auth/me, not Firebase client user state.
- Protected backend routes should authenticate using the httpOnly session cookie via a shared requireUser helper.
- Client API calls should use same-origin fetch with credentials: "include"; no Authorization: token headers.
- Firebase refresh tokens should not persist in browser storage.
- No authToken or refreshToken should be returned in JSON responses.
- /api/signup and /api/login legacy routes should be removed or replaced by /api/auth/session flow.

Production target:
This Firebase Admin session-cookie architecture is the recommended robust browser/user auth setup for this application. Do not switch away from Firebase as part of this migration unless a separate product/security decision is made. Finish and harden this approach first.

The auth migration should not be considered complete until:
- /api/auth/session enforces a recent Firebase auth_time before creating the session cookie.
- Origin/CSRF protection uses an explicit production allowlist such as APP_ORIGIN, not only request Host headers.
- Unsafe production requests with missing Origin are handled deliberately.
- Firebase client auth is signed out reliably after login/signup succeeds, including failure paths after Firebase has authenticated.
- Basic security headers are added without breaking Google popup login.
- Every protected API route uses the shared requireUser/session-cookie path.
- Old token auth leftovers are removed: Authorization authToken headers, browser-readable authToken/refreshToken cookies, legacy token helpers, and token-returning JSON responses.
- Cookie and privacy pages accurately document the httpOnly session cookie and realistic expiry.
- Automated checks and manual auth flows pass.

Please audit and improve the implementation.

Files to inspect first:
- app/api/auth/session/route.ts
- app/api/auth/logout/route.ts
- app/api/auth/me/route.ts
- app/lib/auth/session.ts
- app/lib/auth/requireUser.ts
- app/lib/auth/origin.ts
- app/context/AuthContext.tsx
- app/components/signInUpPage/SignInPageContent.tsx
- services/index.ts
- all provider API files under providers/
- all protected route handlers under app/api/
- next.config.js
- app/cookies/page.tsx
- app/privacy/page.tsx

What to check:

1. Token exposure
- Confirm no React context stores Firebase ID tokens.
- Confirm no provider/API call sends Authorization: authToken.
- Confirm no authToken or refreshToken is returned in JSON.
- Confirm no browser-readable auth or refresh token cookies are set.
- Confirm Firebase client auth uses inMemoryPersistence.
- Confirm Firebase client auth signs out after session exchange.
- Prefer signing out in finally after Firebase login succeeds, so temporary Firebase state is cleared even if session exchange fails.

2. Session cookie correctness
- Confirm /api/auth/session uses firebaseAdminAuth.verifyIdToken(idToken, true).
- Confirm it creates a session cookie with firebaseAdminAuth.createSessionCookie.
- Confirm backend verification uses firebaseAdminAuth.verifySessionCookie(sessionCookie, true).
- Confirm cookie is httpOnly.
- Confirm secure is true in production.
- Confirm sameSite choice is deliberate. Lax is usually okay for same-origin apps; Strict is stricter but may affect some flows.
- Confirm maxAge is reasonable, e.g. 7 days, not too long.
- Confirm logout clears the cookie correctly using the same name/path/options.

3. Recent-login check
- If RECENT_AUTH_WINDOW_MS exists, ensure /api/auth/session enforces it using decoded.auth_time.
- Reject old ID tokens when creating the session cookie.
- This prevents a stale Firebase token from being exchanged into a fresh server session.

4. CSRF/origin protection
- Because cookie auth is automatic, every state-changing route must have CSRF protection.
- Check requireUser calls assertSameOrigin or equivalent.
- Improve assertSameOrigin to compare against explicit allowed origins from env, not just the Host header.
- Suggested env vars:
  - APP_ORIGIN=https://example.com
  - ADDITIONAL_ALLOWED_ORIGINS=...
- For production, reject unsafe methods if Origin is missing unless there is a clear reason to allow it.
- Consider adding a double-submit CSRF token for sensitive mutations if needed.

5. Protected API consistency
- Every protected GET/POST/PUT/PATCH/DELETE route should use requireUser.
- Public routes should be intentionally public.
- Search for old helpers:
  - getDecodedIdToken
  - getApplicationUserServer
  - Authorization
  - authToken
  - refreshToken
- Remove dead auth code.
- Provider hooks/types should use isAuthenticated or enabled flags, not authToken strings.

6. Signup/user creation integrity
- /api/auth/session should create or update applicationUser only from verified Firebase token claims.
- Do not trust email, providerId, or firebaseUID from request body.
- If an existing applicationUser has a different firebaseUID for the same email, handle safely.
- Do not overwrite user-edited displayName blindly.
- Consider requiring decoded.email_verified for Google/email accounts if product policy requires verified email.

7. Client auth state
- AuthContext should call /api/auth/me and store only user DTO + loading state.
- Logout should POST /api/auth/logout and clear user state.
- On 401/expired sessions, client should clear local user state and redirect only when appropriate.
- Avoid redirect loops.

8. Security headers
   Inspect next.config.js.
   Current COOP header may be needed for Firebase Google popup:
- Cross-Origin-Opener-Policy: same-origin-allow-popups

Add or evaluate:
- Content-Security-Policy, carefully allowing Firebase/Google domains needed for auth.
- X-Content-Type-Options: nosniff
- Referrer-Policy
- Permissions-Policy
- frame-ancestors via CSP or X-Frame-Options
- Strict-Transport-Security in production
  Do not break Firebase Google sign-in popup.

9. Legal/cookie pages
   Update app/cookies/page.tsx and app/privacy/page.tsx:
- Remove references to browser-readable authToken/refreshToken cookies if no longer true.
- Document the httpOnly session cookie.
- State realistic expiry.
- Do not claim JS can read refreshToken if it no longer can.

10. Testing and verification
    Run:
- npm run lint
- npm run build
- npm audit --audit-level=moderate

Manual test:
- Email/password signup.
- Email/password login.
- Google login popup.
- Logout.
- Refresh page while logged in.
- Protected API call from client component.
- Protected server-rendered page.
- Expired/invalid session behavior.
- Cross-origin POST should be rejected in production-like mode.
- Session cookie should be httpOnly and not readable from document.cookie.
- Firebase local/session storage should not retain refresh tokens after login exchange.

Recommended improvements to implement:
1. Enforce recent auth_time in /api/auth/session.
2. Make signOut(firebaseClientAuth) run reliably after Firebase login/signup attempt succeeds.
3. Replace Host-derived origin trust with explicit APP_ORIGIN allowlist.
4. Ensure all mutating routes are protected by same-origin/CSRF checks.
5. Remove all old token auth leftovers.
6. Update cookie/privacy docs.
7. Add basic security headers without breaking Firebase popup auth.

Expected final result:
A production-sensible Firebase Admin session-cookie auth setup:
- no long-lived browser-readable auth tokens,
- no Authorization token headers,
- httpOnly server session cookie,
- server-side API auth via requireUser,
- client state from /api/auth/me,
- Firebase Web SDK used only as a temporary credential exchange mechanism.
