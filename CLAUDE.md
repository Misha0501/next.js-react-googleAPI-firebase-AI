# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **This is NOT the Next.js you know.** This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Commands

```bash
# Development
npm run dev                           # Start Next.js dev server on localhost:3000
docker compose up db pgadmin          # Start local database services
docker compose up redis serverless-redis-http  # Optional: local Upstash-compatible Redis for rate limiting

# Build & lint
npm run build                         # prisma generate + next build
npm run lint                          # ESLint (flat config, eslint.config.mjs)
npx tsc --noEmit                      # Type-check without building

# Database (dev)
npm run prisma-db-push-dev            # Push schema changes to dev DB
npm run prisma-db-seed-dev            # Seed dev DB
npm run prisma-db-setup-dev           # push + seed in one step

# Database (production)
npm run prisma-db-push-remote         # Push schema changes to production DB
```

## Architecture

### Stack

- **Next.js App Router** with TypeScript — pages in `app/`, API routes in `app/api/`
- **Tailwind CSS v4** for styling (CSS-first config, no `tailwind.config.js`)
- **Firebase Auth** — client SDK (`app/lib/firebase/configClient.ts`) for sign-in; Admin SDK (`configAdmin.ts`) for server-side token verification
- **Prisma 7 + PostgreSQL** as the primary database, using driver adapters (`@prisma/adapter-pg`) rather than Prisma's built-in connection handling
- **Upstash Redis** (`@upstash/redis` + `@upstash/ratelimit`) — REST-based client in `app/lib/redis/index.ts`, used for rate limiting. Gracefully degrades to a process-local in-memory limiter if Redis is unavailable or the request errors. For local dev, `docker compose up redis serverless-redis-http` runs a local proxy ([hiett/serverless-redis-http](https://github.com/hiett/serverless-redis-http)) that emulates Upstash's REST API in front of a plain `redis` container, so the same REST client works in dev and production.
- **@tanstack/react-query v5** for client-side data fetching; **Zustand** for client state
- **Resend** for transactional email; **Formik + Yup** for forms
- **Gemini** (`@google/genai`) for AI-generated property descriptions, streamed back as plain text
- **Google Maps/Places** for location autocomplete

### Authentication flow

Firebase Auth is the identity provider; the browser never holds a long-lived Firebase token. The Firebase Client SDK is only used for the login/signup moment itself.

1. **Login/signup**: `SignInPageContent.tsx` signs the user in with the Firebase Client SDK (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, or `signInWithPopup` for Google) using `inMemoryPersistence`, gets a short-lived Firebase ID token, and POSTs it to `POST /api/auth/session`.
2. **Session creation**: `POST /api/auth/session` (`app/api/auth/session/route.ts`) verifies the ID token with `firebaseAdminAuth.verifyIdToken()`, upserts the `ApplicationUser` row from the verified token claims only (never from the request body), creates a Firebase Admin session cookie via `firebaseAdminAuth.createSessionCookie()`, and sets it as `__session` — `httpOnly`, `secure` in prod, `sameSite: lax`, 7-day expiry. The client then immediately calls `signOut()` on the Firebase Client SDK — the session cookie is the only thing that persists.
3. **Client session state**: `AuthContextProvider` (`app/context/AuthContext.tsx`) calls `GET /api/auth/me` on mount to populate `{ user, isLoading, isAuthenticated }`. It holds no tokens, only a safe user DTO. `logout()` calls `POST /api/auth/logout` to clear the cookie.
4. **API auth**: Protected routes call `requireUser()` (`app/lib/auth/requireUser.ts`), which reads the `__session` cookie, verifies it with `firebaseAdminAuth.verifySessionCookie(cookie, true)` (the `true` checks for revocation), and loads the matching `ApplicationUser` (with `Membership`/`company`) by the token's verified email. `configAdmin.ts` exports `firebaseAdminAuth`, a ready `firebase-admin/auth` instance built from the modular `firebase-admin/app` API (not the legacy `admin.auth()` namespace).
5. **Unauthenticated requests**: `requireUser()` throws `new ResponseError("...", 401)`.
6. **SSR auth guards** (e.g. `app/profile/[tab]/page.tsx`, `app/placeproperties/page.tsx`): call `getSessionUser()` (`app/lib/auth/session.ts`) directly and `redirect("/signin")` if it returns `null`. `getSessionUser()` is the non-throwing counterpart `requireUser()` is built on.
7. **Authorization** (company role checks): `app/api/companyMembershipInvites/_utils.ts` exports `getActiveMembership`/`isAdminMembership`/`ensureActiveCompanyAdmin` — membership is one-to-one (`Membership.applicationUserId` is `@unique`), so a user belongs to at most one company.

Firebase ID tokens from the browser are only ever accepted at `POST /api/auth/session`. Every other protected route trusts only the `__session` cookie.

### Request data flow

**Client → API (authenticated):**

```
Component → react-query hook (providers/<Resource>/index.tsx)
         → api function (providers/<Resource>/api.tsx)
         → service({ ... })  ← services/index.ts, sends credentials: "include"
         → fetch /api/<resource>           (browser attaches the __session cookie automatically)
         → requireUser()
         → Prisma query
         → NextResponse.json(result)
```

Provider hooks no longer take an `authToken` prop. Query hooks that should wait until we know whether the user is logged in take an `enabled?: boolean` prop — pass `isAuthenticated` from `useAuthContext()`.

**SSR / server components**: Call Prisma directly, or `getSessionUser()` from `app/lib/auth/session.ts` for auth guards.

### Provider layer (`providers/`)

Each subdirectory mirrors an API resource: `api.tsx` (fetch functions with explicit return types), `index.tsx` (react-query hooks), `types.ts` (payload/response types). This is the first place to look when tracing any client-side data operation.

All `api.tsx` functions must declare explicit return types (e.g. `Promise<Listing>`, `Promise<null>`). The `service<T>()` generic in `services/index.ts` infers `T` from the function's return type annotation via contextual typing — never call `service()` without the return type being determinable.

### API routes (`app/api/`)

Every route file follows the same pattern:

1. Validate params with `validateParamId(slug)` for ID routes
2. Authenticate with `requireUser()` (`app/lib/auth/requireUser.ts`)
3. Validate request body with a Zod schema from `app/lib/validations/`
4. Query Prisma
5. Catch with `return handleAPIError(error)` (`app/lib/api/handleError.ts`)

Throw `new ResponseError(message, statusCode)` (`app/lib/classes/ResponseError.ts`) for expected errors — `handleAPIError` surfaces these to the client by message and status. It also handles `ZodError` (422), Firebase Admin errors (400 — matched by `error.code` starting with `"auth/"`, the firebase-admin v14 shape; not `error.errorInfo.code`, which was the pre-v14 shape), and Prisma P2025 not-found (404).

### Database

**Generated client**: `prisma generate` outputs to `generated/prisma` (gitignored), not the default location — import the client from `@/generated/prisma/client`. The schema's `datasource` block has no `url`; connections are supplied at runtime via a driver adapter (`new PrismaPg(process.env.DATABASE_URL!)` from `@prisma/adapter-pg`) passed into `new PrismaClient({ adapter })`. Any new script that needs its own Prisma client (see `prisma/seed.ts`, `scripts/print-sitemap.ts`) must follow this same adapter pattern rather than calling `new PrismaClient()` directly.

**Soft delete**: `Listing` records are never hard-deleted. `app/lib/db/client.ts` uses a `$extends` client extension (Prisma's replacement for the old `$use` middleware API) to intercept `listing.delete`/`listing.deleteMany` and turn them into `update`/`updateMany` calls that set `deleted: new Date()`. Always filter `where: { deleted: null }` when querying listings.

**Schema changes**: This project uses `prisma db push` (no migration files). Run `npm run prisma-db-push-dev` for dev and `npm run prisma-db-push-remote` for production.

**Query helpers** (`app/lib/db/index.ts`): Three utilities for building `where` clauses from URL search params:

- `prismaQueryConditionsFromMinMaxValue` — numeric range
- `prismaQueryConditionsFromMinMaxValidDateStringValue` — date range
- `prismaQueryConditionsFromArray` — multi-value enum/string (IN filter)

**Listing helpers** (`app/lib/listing/`):

- `getPopulatedListingsSaved` — merges saved-listing state onto listing results using a Map (O(1) lookup)
- `getAveragePriceInNeighborhood` — fetches only the latest price per listing using `take: 1` on nested `ListingPrice`
- `getApplicationUserCompanyId` — extracts company ID from user's `Membership`

### Validation (`app/lib/validations/`)

Each resource has its own schema file. `shared.ts` exports `baseAddressSchema` — use this (with `.extend()` or `.optional().nullable()`) instead of redefining address fields. Zod schemas are the single source of truth for request shapes; don't duplicate them in TypeScript types.

### Rate limiting (`app/lib/redis/rateLimit.ts`)

`checkRateLimit(key, maxRequests, windowSeconds)` — backed by `@upstash/ratelimit`'s sliding-window algorithm; falls back to a bounded in-memory map if Redis is unreachable or errors. `Ratelimit` instances are cached per distinct `(maxRequests, windowSeconds)` pair. Applied to `/api/auth/session` (10 req/min/IP), `/api/contactForm` (5 req/min/IP), and `generateDescription` (5 req/min/user, keyed by Firebase UID from the verified session).

### Styling pipeline

Tailwind's entry point is `styles/tailwind.css` (`@import "tailwindcss"` + an `@theme` block), kept separate from `styles/globals.scss` (custom Sass rules) and imported first in `app/layout.tsx`. They can't be merged: Sass natively resolves `@import "..."` as a stylesheet import, so putting Tailwind's import directly inside a `.scss` file makes Sass try to (and fail to) resolve `"tailwindcss"` as a local partial before PostCSS ever processes it.

### Key environment variables

| Variable                              | Purpose                                                                                   |
| ------------------------------------- | ----------------------------------------------------------------------------------------- |
| `DATABASE_URL`                        | Postgres connection string, passed to the `@prisma/adapter-pg` driver adapter             |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN`   | Upstash Redis REST credentials (optional; rate limiting degrades gracefully without them) |
| `NEXT_PUBLIC_FIREBASE_*`              | Firebase client config                                                                    |
| `FIREBASE_ADMIN_*`                    | Firebase Admin SDK credentials                                                            |
| `GEMINI_AI_API_KEY`                   | Gemini API key for `generateDescription`                                                  |
| `SITE_URL`                            | Canonical public origin for metadata and sitemaps; fallback for server-side absolute URLs |

### Disabled features

- `app/api/cron/notifyOfMatchedListings/route.ts` — returns an empty response immediately, before reaching the real matching/email logic below it.
