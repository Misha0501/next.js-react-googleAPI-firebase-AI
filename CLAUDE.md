# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **This is NOT the Next.js you know.** This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Commands

```bash
# Development
npm run dev                           # Start Next.js dev server on localhost:3000
docker-compose up db pgadmin redis    # Start required backing services

# Build & lint
npm run build                         # prisma generate + next build
npm run lint                          # ESLint via next lint
npx tsc --noEmit                      # Type-check without building

# Database (dev)
npm run prisma-db-push-dev            # Push schema changes to dev DB
npm run prisma-db-seed-dev            # Seed dev DB
npm run prisma-db-setup-dev           # push + seed in one step

# Database (production)
npm run prisma-db-push-remote         # Push schema changes to production DB

# E2E tests
npx playwright test                   # Run all Playwright tests in __checks__/
npx playwright test __checks__/home-page.spec.ts  # Run a single test file
```

## Architecture

### Stack

- **Next.js App Router** with TypeScript — pages in `app/`, API routes in `app/api/`
- **Tailwind CSS** for styling; **MUI** only for CircularProgress and Box
- **Firebase Auth** — client SDK (`app/lib/firebase/configClient.ts`) for sign-in; Admin SDK (`configAdmin.ts`) for server-side token verification
- **Prisma 5 + PostgreSQL** as the primary database
- **Redis** (`ioredis`) — client in `app/lib/redis/index.ts`, used for rate limiting. Gracefully degrades if Redis is unavailable.
- **react-query v3** for client-side data fetching; **Zustand** for client state
- **Resend** for transactional email; **Formik + Yup** for forms
- **OpenAI** for AI-generated property descriptions (currently disabled behind 503)
- **Google Maps/Places** for location autocomplete

### Authentication flow

1. **Login**: `POST /api/login` calls Firebase Identity Toolkit, gets `idToken` + `refreshToken`, sets both as cookies (`sameSite: strict`, `secure` in prod).
2. **Client session**: `AuthContextProvider` (`app/context/AuthContext.tsx`) subscribes to `onIdTokenChanged` — fires on login, logout, and every hourly Firebase token refresh. Each time it updates both React state and the `authToken` cookie so SSR always has a fresh token.
3. **API auth**: Protected routes call `getApplicationUserServer(includeCompanyMembership?)` (`app/lib/getApplicationUserServer.ts`), which calls `getDecodedIdToken()` (`app/lib/getDecodedIdToken.ts`). That function checks the `Authorization` header first, then falls back to the `authToken` cookie, and verifies via Firebase Admin SDK.
4. **Signup**: Handled by a Firebase-triggered Google Cloud Function that calls `POST /api/signup` to upsert the user in PostgreSQL. Not called by the browser directly.
5. **Unauthenticated requests**: throw `new ResponseError("...", 401)`.

### Request data flow

**Client → API (authenticated):**

```
Component → react-query hook (providers/<Resource>/index.tsx)
         → api function (providers/<Resource>/api.tsx)
         → service({ ..., headers: { Authorization: authToken } })  ← services/index.ts
         → fetch /api/<resource>
         → getApplicationUserServer() or getDecodedIdToken()
         → Prisma query
         → NextResponse.json(result)
```

**SSR / server components**: Call Prisma directly. Use `redirectToSignInIfNotLoggedInSSR.ts` for auth guards. Auth reads from the `authToken` cookie.

### Provider layer (`providers/`)

Each subdirectory mirrors an API resource: `api.tsx` (fetch functions with explicit return types), `index.tsx` (react-query hooks), `types.ts` (payload/response types). This is the first place to look when tracing any client-side data operation.

All `api.tsx` functions must declare explicit return types (e.g. `Promise<Listing>`, `Promise<null>`). The `service<T>()` generic in `services/index.ts` infers `T` from the function's return type annotation via contextual typing — never call `service()` without the return type being determinable.

### API routes (`app/api/`)

Every route file follows the same pattern:

1. Validate params with `validateParamId(slug)` for ID routes
2. Authenticate with `getApplicationUserServer()` or `getDecodedIdToken()`
3. Validate request body with a Zod schema from `app/lib/validations/`
4. Query Prisma
5. Catch with `return handleAPIError(error)` (`app/lib/api/handleError.ts`)

Throw `new ResponseError(message, statusCode)` (`app/lib/classes/ResponseError.ts`) for expected errors — `handleAPIError` surfaces these to the client by message and status. It also handles `ZodError` (422), Firebase token errors (400), and Prisma P2025 not-found (404).

### Database

**Soft delete**: `Listing` records are never hard-deleted. `prisma.$use` middleware in `app/lib/db/client.ts` intercepts `delete`/`deleteMany` on `Listing` and sets `deleted: new Date()` instead. Always filter `where: { deleted: null }` when querying listings.

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

`checkRateLimit(key, maxRequests, windowSeconds)` — Redis-backed, returns `true` (allow) if Redis is unavailable. Applied to login (10 req/min/IP) and generateDescription (5 req/min/user).

### Key environment variables

| Variable                                           | Purpose                                                        |
| -------------------------------------------------- | -------------------------------------------------------------- |
| `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING` | Database (pooled vs direct)                                    |
| `REDIS_URL`                                        | Redis (optional; rate limiting degrades gracefully without it) |
| `NEXT_PUBLIC_FIREBASE_*`                           | Firebase client config                                         |
| `FIREBASE_ADMIN_*`                                 | Firebase Admin SDK credentials                                 |
| `OPENAI_API_KEY`                                   | OpenAI API (feature currently disabled)                        |
| `IDENTITYTOOLKIT_GOOGLE_API_BASE_URL`              | Firebase Identity Toolkit endpoint for login                   |
| `API_URL` / `VERCEL_URL`                           | Base URL used by `getFetchUrl` on the server                   |

### Disabled features

- `app/api/generateDescription/route.ts` — returns 503. Auth and rate limiting are wired but gated behind the guard. Remove the early return to re-enable.
- `app/api/cron/notifyOfMatchedListings/route.ts` — returns empty response immediately.
