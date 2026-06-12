# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev                      # Start Next.js dev server on localhost:3000
docker-compose up db pgadmin redis  # Start required backing services

# Build & lint
npm run build                    # prisma generate + next build
npm run lint                     # ESLint via next lint

# Database (dev environment)
npm run prisma-db-push-dev       # Push schema changes to dev DB
npm run prisma-db-seed-dev       # Seed dev DB
npm run prisma-db-setup-dev      # push + seed in one step

# E2E tests
npx playwright test              # Run all Playwright tests in __checks__/
npx playwright test __checks__/home-page.spec.ts  # Run a single test file
```

## Architecture

### Stack
- **Next.js 13 App Router** with TypeScript — pages live in `app/`, API routes in `app/api/`
- **Tailwind CSS** for utility styling; **MUI** for select UI components (CircularProgress, Box)
- **Firebase Auth** — client SDK (`app/lib/firebase/configClient.ts`) handles sign-in/up; Admin SDK (`configAdmin.ts`) verifies tokens server-side
- **Prisma + PostgreSQL** as the primary database
- **Redis** (`ioredis`) as a caching layer via `prisma-redis-middleware`
- **react-query** for client-side data fetching; **Zustand** for client state
- **OpenAI** for AI-generated property descriptions (`app/api/generateDescription/`)
- **Google Maps/Places** for property location autocomplete
- **Nodemailer** for transactional email; **Formik + Yup** for forms

### Authentication flow
1. User signs in via Firebase client SDK → token stored in `authToken` cookie
2. `AuthContextProvider` (`app/context/AuthContext.tsx`) subscribes to `onAuthStateChanged` and exposes `user` and `authToken` via context
3. Protected API routes call `getDecodedIdToken()` (`app/lib/getDecodedIdToken.ts`), which reads the cookie and verifies via Firebase Admin SDK
4. Unauthenticated requests throw `ResponseError(401)`

### Request data flow
- **Client → API**: `services/index.ts` is a thin `fetch` wrapper that attaches the `Authorization` header and serialises query params. Call it via `setAuthenticationHeader(token)` before making authenticated requests.
- **API routes**: Live under `app/api/[resource]/route.ts`. Authenticate with `getDecodedIdToken()`, query Prisma, return JSON.
- **Server components / SSR**: Call Prisma directly; use `redirectToSignInIfNotLoggedInSSR.ts` for auth guards.

### Provider layer (`providers/`)
Each subdirectory (e.g., `providers/Listing/`, `providers/Users/`) contains the react-query hooks and `api.tsx` files used by client components to interact with the corresponding `app/api/` route. This is the layer to look in when tracing a client-side data operation.

### Prisma helpers (`app/lib/db/index.ts`)
Three utilities for building Prisma `where` clauses from URL query params:
- `prismaQueryConditionsFromMinMaxValue` — numeric range filters
- `prismaQueryConditionsFromMinMaxValidDateStringValue` — date range filters
- `prismaQueryConditionsFromArray` — multi-value enum/string filters

### Key environment variables
| Variable | Purpose |
|---|---|
| `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING` | Database (pooled vs direct) |
| `REDIS_URL` | Redis (production only; dev connects on default localhost) |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase client config |
| `FIREBASE_ADMIN_*` | Firebase Admin SDK credentials |
| `OPENAI_API_KEY` | OpenAI API |
| `API_URL` / `VERCEL_URL` | Base URL used by `getFetchUrl` on the server |

### Error handling convention
Throw `ResponseError(message, statusCode)` from `app/lib/classes/ResponseError.ts` in API routes. The service layer in `services/index.ts` surfaces the error message to the client.

### E2E tests
Tests live in `__checks__/` and use Playwright. The base URL defaults to `http://localhost:3000` or is overridden by `ENVIRONMENT_URL`. Checkly (`checkly.config.ts`) is used for cloud monitoring using the same spec files.
