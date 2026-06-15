# Backend Refactoring Plan

Audit of `app/api/`, `app/lib/`, `providers/`, and `prisma/schema.prisma`.

---

## Phase 1 — Quick Wins ✅

### 1.1 Database Indexes ✅

**File:** `prisma/schema.prisma`

Added indexes on all hot query paths. Applied via `npm run prisma-db-push-dev`.

```prisma
model Listing        { @@index([applicationUserId]); @@index([companyId]); @@index([deleted]); @@index([applicationUserId, deleted]) }
model SavedListing   { @@index([applicationUserId]) }
model SavedSearch    { @@index([applicationUserId]) }
model ListingPrice   { @@index([listingId]) }
model Membership     { @@index([companyId]) }
model Address        { @@index([listingId]) }
```

---

### 1.2 Standardize Error Handling ✅

**Files changed:**
- `app/lib/api/handleError.ts` — added Prisma P2025 (not found) handler
- `app/api/users/[slug]/route.ts` — replaced manual catch with `handleAPIError`
- `app/api/login/route.ts` — replaced manual catch with `handleAPIError`
- `app/api/signup/route.ts` — replaced generic catch with `handleAPIError`

---

### 1.3 Use `validateParamId` and `select` in users/[slug] ✅

**File:** `app/api/users/[slug]/route.ts`

- Replaced inline `isNaN` check with `validateParamId(slug)`
- Replaced `findUnique` + post-query `delete` field stripping with a `select` clause — sensitive fields (`firebaseUID`, `providerId`, `updatedAt`) are never fetched

---

## Phase 2 — Security ✅

### 2.1 Fix Cookie Security Flags ✅

**File:** `app/api/login/_utils.ts`

Fixed three bugs:
- Added `httpOnly: true` on `authToken` cookie
- Added `sameSite: "strict"` on both cookies
- Fixed `expires` from `Date.now() + ONE_DAY` (milliseconds, ~54yr expiry) to `new Date(Date.now() + ONE_DAY_MS)` (correct Date object)

---

### 2.2 Fix Token Verification Priority ✅

**File:** `app/lib/getDecodedIdToken.ts`

Changed `cookieToken || headerAuthorizationToken` → `headerAuthorizationToken || cookieToken`. Header now takes priority over cookie.

---

### 2.3 Add Auth to `generateDescription` Endpoint ✅

**File:** `app/api/generateDescription/route.ts`

Added `await getDecodedIdToken()` as the first statement inside `try`, before the 503 guard. When the feature is re-enabled, unauthenticated requests will return 401.

---

### 2.4 Add Rate Limiting ✅

**New files:**
- `app/lib/redis/rateLimit.ts` — `checkRateLimit(key, maxRequests, windowSeconds)` backed by Redis, gracefully allows requests if Redis is unavailable
- `app/lib/redis/index.ts` — fixed: now handles missing Redis gracefully (returns `null` instead of crashing the server)

**Applied to:**
- `app/api/login/route.ts` — 10 requests/minute per IP
- `app/api/generateDescription/route.ts` — 5 requests/minute per user (for when the feature is re-enabled)

---

## Phase 3 — Performance ✅

### 3.1 Fix O(n×m) in `getPopulatedListingsSaved` ✅

**File:** `app/lib/listing/getPopulatedListingsSaved.ts`

Replaced nested `.find()` calls (O(n×m)) with a `Map<listingId, SavedListing>` for O(1) lookups.

---

### 3.2 Fix N+1 in `getAveragePriceInNeighborhood` ✅

**File:** `app/lib/listing/getAveragePriceInNeighborhood.ts`

Replaced `findMany` (fetching all listings + all price history) with a targeted query using:
- `select` to fetch only `id` and latest `ListingPrice` per listing
- `take: 1` with `orderBy: { createdAt: "desc" }` in nested relation to fetch only the most recent price per listing (one DB query instead of N+1)

---

### 3.3 Pagination for `savedListings` and `savedSearches` ✅

**Files changed:**
- `app/api/savedListings/_utils.ts` — added `page`/`pageSize` params with `skip`/`take`, parallelized count + findMany
- `app/api/savedListings/route.ts` — reads `page`/`pageSize` from query params
- `app/api/savedSearches/_utils.ts` — added `page`/`pageSize` params
- `app/api/savedSearches/route.ts` — reads `page`/`pageSize`, parallelized count + findMany

Both endpoints now return `{ page, pageSize, total, results }`.

---

## Phase 4 — Code Quality ✅

### 4.1 Extract Shared Zod Address Schema ✅

**New file:** `app/lib/validations/shared.ts` — exports `baseAddressSchema`

**Updated:**
- `app/lib/validations/listing.ts` — uses `baseAddressSchema.optional()` and `baseAddressSchema.extend({ id: z.number() }).optional()`
- `app/lib/validations/company.ts` — uses `baseAddressSchema.optional().nullable()` and `baseAddressSchema.extend({ id: z.number() }).optional().nullable()`

---

### 4.2 Type All Remaining `service()` Calls in Providers ✅

Added explicit return type annotations to provider api functions (TypeScript infers the generic from return context). Pattern follows `providers/Listing/api.tsx`.

**Files updated:**
- `providers/Companies/api.tsx` — `create(): Promise<Company>`, `update(): Promise<Company>`
- `providers/CompanyMembershipInvites/api.tsx` — all 4 functions typed
- `providers/Memberships/api.tsx` — `companyMemberships(): Promise<Membership[]>`, `create(): Promise<Membership>`
- `providers/ContactForm/api.tsx` — `create(): Promise<null>` (added `parseJSON: false`)
- `providers/ListingImages/api.tsx` — `deleteItem(): Promise<null>`

---

### 4.3 Remove Global Mutable Auth Header State ✅

**File:** `services/index.ts`

Removed `setAuthenticationHeader`, `getAuthenticationToken`, `removeAuthenticationHeader`, and the `Authorization` field from `defaultHeaders`. These functions had no callers — all providers already pass `Authorization` per-request via the `headers` option.

---

## Verification

```bash
# TypeScript — should pass with zero errors
npx tsc --noEmit

# Apply schema changes to dev DB
npm run prisma-db-push-dev

# Dev server
npm run dev
```

**Functional checks:**
- Cookie in DevTools: `HttpOnly`, `SameSite=Strict`, expiry ~24h
- Login with wrong password → 400 "Username or password is incorrect."
- Protected route with only `Authorization` header (no cookie) → 200
- `GET /api/savedListings?page=2&pageSize=5` → paginated response
- `GET /api/savedSearches?page=1&pageSize=10` → paginated response
