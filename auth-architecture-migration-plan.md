# Auth Architecture Migration Plan

## Migration Progress (implemented 2026-06-19)

Phases 1–8 below are implemented and verified (build + lint + tsc clean, plus
live testing against the real Firebase project with disposable test accounts:
session create/me/logout, a protected route, password-change reauth +
session revocation, and image upload/delete). Two things were not
machine-verified: Google sign-in (needs a real OAuth popup) and the
production-only CSRF origin check (logic reviewed, not exercised under
`NODE_ENV=production`).

**Done:**

- New routes: `POST /api/auth/session`, `POST /api/auth/logout`, `GET /api/auth/me` (`app/api/auth/`).
- `AuthContext` rewritten around `{ user, isLoading, isAuthenticated, refreshUser, logout }` — no tokens in React state. `SignInPageContent.tsx` uses `inMemoryPersistence`, exchanges the ID token for a session cookie, then signs the Firebase client SDK out immediately.
- `app/lib/auth/session.ts` (`getSessionUser`, `toCurrentUserDto`, `isRecentlyAuthenticated`) and `app/lib/auth/requireUser.ts` — every previously-protected API route now calls `requireUser()` instead of `getApplicationUserServer`/`getDecodedIdToken` (both deleted). SSR guards (`app/profile/[tab]/page.tsx`, `app/placeproperties/page.tsx`) use `getSessionUser()` directly.
- Removed `authToken`/`refreshToken` cookies, `/api/login`, `cookies-next` dependency, and the unauthenticated `/api/signup` endpoint (its job is now done by `/api/auth/session`'s verified-token upsert). Updated `/privacy` and `/cookies` policy copy to describe `__session` instead.
- Provider layer (`providers/*`) no longer threads an `authToken` prop; query hooks that should wait for auth take `enabled?: boolean` — pass `isAuthenticated`. `services/index.ts` sends `credentials: "include"` on every request instead of an `Authorization` header.
- `app/lib/auth/origin.ts` (`assertSameOrigin`) wired into `requireUser()` plus the session/logout routes directly — rejects mismatched `Origin` vs `Host` for any request, production-only.
- Session duration fixed at 7 days (`SESSION_DURATION_MS`). `PUT /api/users` requires `auth_time` within 15 minutes (`isRecentlyAuthenticated`) when changing the password, and calls `revokeRefreshTokens` afterward so other sessions are invalidated too — verified live that the change-maker's own session is also killed by the revocation.
- Fixed a latent firebase-admin v14 bug found along the way: `handleAPIError`/`handleUserAPIUpdateError` were checking `error.errorInfo.code` (the pre-v14 shape) instead of `error.code`, so invalid/expired-token responses were silently falling through to generic 500s.
- Image uploads (`PlacingPropertyImagesHandler.tsx`) moved off direct client→Firebase-Storage calls to a new `POST/DELETE /api/images/upload` route using the Admin SDK — direct client uploads relied on an active Firebase Auth session, which no longer exists once the client signs out right after session-cookie exchange. `DELETE /api/images/[slug]` now also deletes the underlying Storage object. No Firestore/Realtime Database usage exists in this app, so Phase 8's broader "review direct client access" only applied to Storage.

**Deliberately not done (judgment calls, revisit if needed):**

- No double-submit CSRF token system (`/api/auth/csrf`) — the plan frames this as the "better protection" tier on top of the "minimum protection" baseline (SameSite=Lax + Origin check + no mutating GETs), which is what's implemented. Add it if the threat model changes.
- No "remember me" 14-day session variant — there's no UI for it; the fixed 7-day default covers the only flow that exists.
- The recent-auth requirement only guards password change (the one sensitive, already-implemented action in this app). There's no email change, account deletion, billing, or API-key system yet to extend it to.
- `/api/contactForm` (public, unauthenticated, already rate-limited + honeypotted) wasn't given an Origin check — it has no cookie/session to protect, so it isn't a CSRF target in the same sense as the rest of Phase 6.
- B2B API key system (Phase 11 in "Recommended Implementation Order") — not started.

---

## Goal

Migrate the current Next.js App Router authentication setup from JS-readable Firebase tokens to a production-ready server-session model using Firebase Admin session cookies.

The target architecture:

```txt
Firebase Auth = identity provider
Prisma/database = authorization and app user/team/company source of truth
Browser session = httpOnly Firebase Admin session cookie
Client API calls = same-origin fetch with credentials included
B2B API access = separate API key system, not Firebase browser tokens
```

---

## Current Problems to Fix

The current setup exposes too much authentication material to browser JavaScript.

Current issues:

- Firebase ID token is stored in React state as `authToken`.
- `authToken` is written into a JS-readable cookie.
- `refreshToken` is written into a JS-readable cookie.
- Client API calls send `Authorization: authToken`.
- `/api/login` returns `authToken` and `refreshToken` in JSON.
- `/api/signup` trusts request body fields like:
  - `email`
  - `providerId`
  - `firebaseUID`
- Cookies are not `httpOnly` because client JavaScript currently reads them.
- There is redundant token handling because Firebase Client SDK already manages client tokens.
- Browser login and future B2B API credentials are not clearly separated.

---

## Final Target Architecture

### Browser Login Flow

```txt
1. User signs in using Firebase Web SDK:
   - email/password
   - Google sign-in

2. Client gets Firebase ID token once.

3. Client sends ID token to:
   POST /api/auth/session

4. Backend verifies ID token using Firebase Admin.

5. Backend creates a Firebase Admin session cookie.

6. Backend sets session cookie as:
   - httpOnly
   - Secure
   - SameSite=Lax
   - Path=/
   - Max-Age based on selected session duration

7. Client immediately calls signOut(auth) from Firebase Client SDK.

8. Frontend uses /api/auth/me to fetch the current app user.

9. All protected backend APIs verify the httpOnly session cookie.
```

### Important Security Rule

Only this endpoint should accept a Firebase ID token from the browser:

```txt
POST /api/auth/session
```

All other protected browser APIs should reject Firebase ID tokens and require the session cookie.

---

# Phase 1 — Remove JS-Readable Token Storage

## Objective

Stop storing Firebase ID tokens and refresh tokens in places readable by browser JavaScript.

## Tasks

### Remove client-side token cookies

Remove code that writes these cookies:

```txt
authToken
refreshToken
```

Remove usages of libraries such as `cookies-next` for storing auth tokens.

### Remove auth token from React auth state

The `AuthContext` should no longer expose or store a long-lived `authToken`.

Bad:

```ts
const [authToken, setAuthToken] = useState<string | null>(null);
```

The app should instead use a server-backed `/api/auth/me` request to know whether the user is authenticated.

### Stop sending Authorization headers for browser requests

Remove this pattern from client API calls:

```ts
headers: {
  Authorization: authToken
}
```

Replace with:

```ts
fetch("/api/some-protected-route", {
  credentials: "include"
});
```

### Remove refresh token from API responses

`/api/login` must no longer return:

```json
{
  "authToken": "...",
  "refreshToken": "..."
}
```

If `/api/login` remains temporarily, it should be deprecated and later removed or redirected to the new session flow.

## Acceptance Criteria

- No Firebase ID token is stored in React state after login.
- No Firebase ID token is stored in a JS-readable cookie.
- No Firebase refresh token is stored in a JS-readable cookie.
- Client components no longer send `Authorization: authToken` to app APIs.
- Searching the codebase for `refreshToken` should show no browser-storage usage.

---

# Phase 2 — Add Server Session Cookie Flow

## Objective

Create a secure server session using Firebase Admin session cookies.

## New Routes

Create:

```txt
POST /api/auth/session
POST /api/auth/logout
GET  /api/auth/me
```

Optional but recommended:

```txt
GET /api/auth/csrf
```

---

## 2.1 `POST /api/auth/session`

### Purpose

Exchange a short-lived Firebase ID token for an httpOnly Firebase Admin session cookie.

### Request Body

```json
{
  "idToken": "firebase-id-token"
}
```

### Server Responsibilities

1. Validate method is `POST`.
2. Apply CSRF/origin protection.
3. Read `idToken` from request body.
4. Verify ID token using Firebase Admin:

```ts
const decoded = await adminAuth.verifyIdToken(idToken);
```

5. Read trusted identity fields only from the decoded token:

```ts
const firebaseUid = decoded.uid;
const email = decoded.email;
const emailVerified = decoded.email_verified ?? false;
const provider = decoded.firebase?.sign_in_provider;
```

6. Create or update the Prisma user.

Example:

```ts
const user = await prisma.user.upsert({
  where: { firebaseUid },
  update: {
    email,
    emailVerified,
    lastLoginAt: new Date()
  },
  create: {
    firebaseUid,
    email,
    emailVerified
  }
});
```

7. Create Firebase Admin session cookie:

```ts
const expiresIn = 7 * 24 * 60 * 60 * 1000;

const sessionCookie = await adminAuth.createSessionCookie(idToken, {
  expiresIn
});
```

8. Set cookie:

```ts
response.cookies.set("__session", sessionCookie, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: expiresIn / 1000
});
```

9. Return only a safe user DTO.

Example response:

```json
{
  "user": {
    "id": "app-user-id",
    "email": "user@example.com",
    "emailVerified": true
  }
}
```

### Must Not Do

Do not trust these fields from the request body:

```txt
email
providerId
firebaseUID
role
companyId
permissions
```

Only trust the decoded Firebase token and then your own database.

---

## 2.2 `POST /api/auth/logout`

### Purpose

Clear the server session cookie.

### Server Responsibilities

1. Apply CSRF/origin protection.
2. Clear the session cookie:

```ts
response.cookies.set("__session", "", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 0
});
```

3. Return success.

### Optional

For “logout all devices” or security events, revoke Firebase refresh tokens:

```ts
await adminAuth.revokeRefreshTokens(firebaseUid);
```

Normal logout does not need to revoke all sessions.

---

## 2.3 `GET /api/auth/me`

### Purpose

Return the currently authenticated app user based on the httpOnly session cookie.

### Server Responsibilities

1. Read the `__session` cookie.
2. Verify with Firebase Admin:

```ts
const decoded = await adminAuth.verifySessionCookie(sessionCookie);
```

3. Load the app user from Prisma by `firebaseUid`.
4. Include memberships/companies/roles if needed.
5. Return a safe user DTO.

Example response:

```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "companies": [
      {
        "id": "company-id",
        "name": "Company Name",
        "role": "OWNER"
      }
    ]
  }
}
```

## Acceptance Criteria

- Login creates an `httpOnly` session cookie.
- JavaScript cannot read the session cookie.
- `/api/auth/me` works after page refresh.
- Firebase Client SDK is signed out after session creation.
- Protected APIs can authenticate using only the session cookie.

---

# Phase 3 — Update Client Login Flows

## Objective

Keep Firebase Web SDK only for the login moment, then switch to server session auth.

---

## 3.1 Email/Password Login

Use Firebase Client SDK with in-memory persistence.

Example:

```ts
import {
  signInWithEmailAndPassword,
  setPersistence,
  inMemoryPersistence,
  signOut
} from "firebase/auth";

await setPersistence(auth, inMemoryPersistence);

const credential = await signInWithEmailAndPassword(auth, email, password);
const idToken = await credential.user.getIdToken();

await fetch("/api/auth/session", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken
  },
  body: JSON.stringify({ idToken }),
  credentials: "include"
});

await signOut(auth);

router.replace("/dashboard");
```

---

## 3.2 Google Sign-In

Example:

```ts
import {
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  inMemoryPersistence,
  signOut
} from "firebase/auth";

await setPersistence(auth, inMemoryPersistence);

const provider = new GoogleAuthProvider();
const credential = await signInWithPopup(auth, provider);
const idToken = await credential.user.getIdToken();

await fetch("/api/auth/session", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken
  },
  body: JSON.stringify({ idToken }),
  credentials: "include"
});

await signOut(auth);

router.replace("/dashboard");
```

---

## 3.3 Auth Context Changes

The `AuthContext` should no longer be based on `onIdTokenChanged` as the source of truth for logged-in app state.

Instead:

- On app load, call `/api/auth/me`.
- Store only safe user data in React state.
- Do not store Firebase ID tokens.
- Do not store refresh tokens.
- Provide methods:
  - `loginWithEmailPassword`
  - `loginWithGoogle`
  - `logout`
  - `refreshUser`
  - `user`
  - `isLoading`
  - `isAuthenticated`

Example state:

```ts
type AuthState = {
  user: CurrentUserDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};
```

## Acceptance Criteria

- Email/password login works.
- Google sign-in works.
- After successful login, Firebase Client SDK is signed out.
- Refreshing the page keeps the user logged in through the session cookie.
- React state contains safe user profile data only, not tokens.

---

# Phase 4 — Centralize Backend Authentication

## Objective

All protected route handlers should use one shared auth helper.

## Create Server Auth Helper

Example file:

```txt
src/server/auth/require-user.ts
```

Example implementation shape:

```ts
export async function requireUser(request: NextRequest) {
  const sessionCookie = request.cookies.get("__session")?.value;

  if (!sessionCookie) {
    throw new UnauthorizedError();
  }

  const decoded = await adminAuth.verifySessionCookie(sessionCookie);

  const user = await prisma.user.findUnique({
    where: { firebaseUid: decoded.uid },
    include: {
      memberships: {
        include: {
          company: true
        }
      }
    }
  });

  if (!user) {
    throw new UnauthorizedError();
  }

  return {
    user,
    firebase: decoded
  };
}
```

## Create Authorization Helpers

Examples:

```ts
requireCompanyMember(userId, companyId)
requireCompanyRole(userId, companyId, ["OWNER", "ADMIN"])
requirePermission(userId, companyId, "PROJECT_WRITE")
```

## Update Existing Protected APIs

Every protected API route should call `requireUser()` or a stricter authorization helper.

Example:

```ts
export async function GET(request: NextRequest) {
  const { user } = await requireUser(request);

  // continue with business logic
}
```

## Acceptance Criteria

- No protected route manually parses or trusts request body identity fields.
- All protected APIs use shared server auth helpers.
- Authorization is based on Prisma user/company/team membership data.
- Firebase is used for identity, not app permissions.

---

# Phase 5 — Fix Signup and Onboarding

## Objective

Signup should trust Firebase token claims and database rules, not request body identity fields.

## New Signup/Onboarding Flow

Possible simple flow:

```txt
1. User signs up with Firebase Client SDK.
2. Client gets ID token.
3. Client sends ID token to /api/auth/session.
4. Server verifies ID token.
5. Server creates Prisma user if missing.
6. Server creates initial company/team if this is a new signup.
7. Server creates OWNER membership for the user.
8. Server creates session cookie.
9. Client signs out from Firebase Client SDK.
10. Client redirects to onboarding/dashboard.
```

## Rules

Do not accept these as trusted input:

```txt
firebaseUID
email
providerId
emailVerified
role
companyId
```

Only use them if they come from verified Firebase Admin decoding or your own database.

## Optional Separate Endpoint

If onboarding needs extra fields, add:

```txt
POST /api/onboarding
```

This endpoint should:

- require session cookie auth
- use the authenticated user from `requireUser()`
- accept only app-specific fields, for example:
  - company name
  - display name
  - preferences

## Acceptance Criteria

- A user cannot spoof another `firebaseUID`.
- A user cannot assign themselves admin/owner role through request body fields.
- New users get a valid Prisma user record.
- New company/team creation is controlled server-side.

---

# Phase 6 — Add CSRF and Origin Protection

## Objective

Protect cookie-authenticated mutation routes from CSRF.

Cookie-based auth means the browser automatically sends cookies, so unsafe methods need protection.

## Unsafe Methods

Apply protection to:

```txt
POST
PUT
PATCH
DELETE
```

## Minimum Protection

### 1. Cookie settings

Session cookie should use:

```ts
{
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/"
}
```

### 2. Origin/Host check

For unsafe methods, verify the request comes from your own origin.

Example shape:

```ts
function assertSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  const expectedOrigin = `https://${host}`;

  if (process.env.NODE_ENV === "production" && origin !== expectedOrigin) {
    throw new ForbiddenError();
  }
}
```

In production deployments, handle:

```txt
X-Forwarded-Host
X-Forwarded-Proto
allowed origins
preview deployment URLs if needed
```

### 3. No state changes in GET

GET routes must not create, update, or delete data.

---

## Better Protection: CSRF Token

Add a double-submit CSRF token.

### `GET /api/auth/csrf`

Server creates random CSRF token.

Set readable cookie:

```txt
csrfToken=<random>
```

Return same token in response:

```json
{
  "csrfToken": "random-token"
}
```

### Client sends token on unsafe requests

```ts
headers: {
  "X-CSRF-Token": csrfToken
}
```

### Server validates

For unsafe methods:

```txt
csrf cookie value must match X-CSRF-Token header value
```

Apply this especially to:

```txt
POST /api/auth/session
POST /api/auth/logout
POST /api/company/*
POST /api/team/*
POST /api/billing/*
POST /api/api-keys/*
PATCH/DELETE mutation routes
```

## Acceptance Criteria

- Unsafe routes reject cross-origin requests.
- Unsafe routes require CSRF token where implemented.
- GET routes do not mutate state.
- Session cookie uses secure cookie flags in production.

---

# Phase 7 — Session Expiration and Revocation

## Objective

Define predictable session lifetime and revocation behavior.

## Recommended Defaults

```txt
Normal session: 7 days
Remember me session: 14 days
Admin/sensitive areas: require recent login
```

Firebase Admin session cookies support limited expiration; keep within supported limits.

## Sensitive Actions

For sensitive actions, verify the user recently authenticated.

Examples:

```txt
change email
change password
delete account
create API key
change billing settings
invite admin user
change company owner
```

Check `auth_time` from the decoded Firebase token/session.

Example policy:

```txt
Require auth_time within last 10–15 minutes for sensitive actions.
```

If not recent enough:

```txt
Return 401/403 with "reauthentication required"
Client asks user to log in again
Server creates a new session cookie
```

## Logout Types

### Normal logout

- Clear session cookie only.

### Logout all devices / security event

- Clear current session cookie.
- Call Firebase Admin refresh token revocation:

```ts
await adminAuth.revokeRefreshTokens(firebaseUid);
```

- For sensitive routes, use session revocation checks where appropriate.

## Acceptance Criteria

- Session expiration is predictable.
- Expired sessions redirect to login.
- Normal logout clears the session cookie.
- Logout-all-devices revokes Firebase refresh tokens.
- Sensitive actions require recent authentication.

---

# Phase 8 — Lock Down Direct Firebase Client Access

## Objective

Make sure a leaked short-lived Firebase ID token cannot access sensitive Firebase resources directly.

## Tasks

Review Firebase products used by the app:

```txt
Firestore
Realtime Database
Cloud Storage
Cloud Functions
```

If sensitive data is stored there, update rules so direct client access is not overly permissive.

Preferred architecture for sensitive app data:

```txt
Client -> Next.js API route -> Prisma/database/server SDK
```

Avoid allowing the browser to directly read/write sensitive data only because it has a Firebase ID token.

## Acceptance Criteria

- Firestore/Storage rules are reviewed.
- Sensitive app data is not exposed directly to any signed-in Firebase user.
- App authorization remains enforced by the backend/Prisma layer.

---



# Phase 10 — Cleanup and Verification

## Objective

Remove old auth paths and verify the new model end to end.

## Codebase Cleanup

Remove or refactor:

```txt
/api/login returning Firebase tokens
/api/signup trusting identity fields
authToken state
refreshToken cookie usage
Authorization: authToken usage
cookies-next auth token storage
onIdTokenChanged as app auth source of truth
```

## Security Checks

Search codebase for:

```txt
authToken
refreshToken
getIdToken
Authorization
cookies-next
firebaseUID
providerId
onIdTokenChanged
```

Make sure remaining usages are intentional.

`getIdToken()` should normally only exist in login/session-creation logic.

## Test Cases

### Login

- Email/password login works.
- Google sign-in works.
- Session survives page refresh.
- JS cannot read `__session`.
- `/api/auth/me` returns the user.
- Firebase Client SDK is signed out after session creation.

### Logout

- Logout clears session cookie.
- `/api/auth/me` returns unauthenticated after logout.
- Protected APIs reject after logout.

### Protected APIs

- Unauthenticated requests return 401.
- Authenticated requests work.
- Users cannot access another company’s data.
- Role checks work.

### CSRF

- Cross-origin mutation requests are rejected.
- Missing CSRF token is rejected where required.
- Invalid CSRF token is rejected.
- GET routes do not mutate data.

### Signup/Onboarding

- New email/password user gets Prisma user.
- New Google user gets Prisma user.
- User cannot spoof `firebaseUID`.
- User cannot assign themselves privileged roles.

### Session Expiration

- Expired session is rejected.
- User is redirected to login.
- Sensitive actions require recent login.

## Acceptance Criteria

- No long-lived auth tokens are readable by browser JavaScript.
- Browser APIs use cookie-based session auth.
- App authorization is database-backed.
- CSRF/origin protection exists for unsafe routes.
- Old token-based browser auth is removed.
- Future API key auth is clearly separate from browser auth.

---

# Recommended Implementation Order

Use this order to minimize risk:

```txt
1. Add /api/auth/session, /api/auth/logout, /api/auth/me.
2. Update login UI to create session cookie.
3. Update AuthContext to use /api/auth/me.
4. Update API calls to use credentials: "include".
5. Add requireUser() server helper.
6. Migrate protected APIs one by one.
7. Remove authToken/refreshToken cookies.
8. Fix signup/onboarding.
9. Add CSRF/origin protection.
10. Add session expiration/recent-login rules.
11. Review Firebase direct access rules.
12. Add B2B API key system later.
```

---

# Non-Negotiable Rules for the AI Agent

1. Do not store Firebase ID tokens in JS-readable cookies.
2. Do not store Firebase refresh tokens in JS-readable cookies.
3. Do not return Firebase refresh tokens from backend APIs.
4. Do not trust `firebaseUID`, `email`, `providerId`, `role`, or `companyId` from request bodies.
5. Only `/api/auth/session` may accept a Firebase ID token from the browser.
6. Protected browser APIs must use the httpOnly session cookie.
7. Authorization must be based on Prisma/database data.
8. State-changing routes must have CSRF/origin protection.
9. B2B API credentials must be separate from browser sessions.
10. API keys must be hashed, scoped, revocable, and auditable.

---

# Final Expected Result

After migration, the app should work like this:

```txt
User logs in with email/password or Google
   ↓
Firebase Client SDK creates temporary ID token
   ↓
Client sends ID token once to backend
   ↓
Backend verifies ID token
   ↓
Backend creates httpOnly Firebase Admin session cookie
   ↓
Client signs out from Firebase Client SDK
   ↓
Frontend loads current user from /api/auth/me
   ↓
Client components call backend APIs with credentials: "include"
   ↓
Backend verifies session cookie and authorizes via Prisma
```

This gives a practical production-ready setup without fully rebuilding authentication from scratch.
