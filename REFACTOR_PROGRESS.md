# Frontend Refactor Progress

## Overview

Five-phase cleanup of the codebase. Each phase is independent and can be committed separately.
Run `npm run build` after each phase to verify no regressions.

---

## Phase 1 — Dependency Cleanup ✅ DONE

**Goal:** Remove dead packages, replace MUI with Tailwind, replace axios with fetch.

### Packages removed
- `zustand` — 0 imports
- `lodash` — 0 imports
- `query-string` — 0 imports
- `sharp` — 0 imports
- `react-slick` + `slick-carousel` — 0 imports
- `tailwind-scrollbar-hide` — 0 imports
- `prettier` (devDep) — no config file
- `@mui/material`, `@emotion/react`, `@emotion/styled` — replaced with Tailwind

### MUI replacements
- `CircularProgress` → `<div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />`
- `Skeleton` → `<div className="animate-pulse rounded bg-slate-200 ..." />`
- `Pagination` → custom prev/next + page number buttons in `ListingsMain.tsx`
- `Stepper` + `styled` in `propertyPlacementEdit/Styled.ts` → Tailwind step indicator

### Axios replaced
- 2 files replaced with native `fetch` following the pattern in `services/index.ts`

---

## Phase 2 — Structural Cleanup ✅ DONE

**Goal:** Remove dead files, fix naming typo, move misplaced files, organize components.

### Dead files deleted
- `app/components/RadioButton.tsx`
- `app/components/Checkbox.tsx`
- `app/components/MultiSelectRadioButton.tsx`
- `app/lib/classNamesJoin.ts`
- `app/lib/getCurrencySign.ts`
- `app/lib/redirectToSignInIfNotLoggedInSSR.ts`
- `public/Icons.tsx` (moved, see below)
- `public/GridIcon.tsx` (moved, see below)

### Folder naming fix
- `providers/SavedSearaches/` → `providers/SavedSearches/` (typo fixed)
- Updated all imports in:
  - `app/components/profilePage/SavedSearches.tsx`
  - `app/components/listingsPage/ListingsPageContent.tsx`

### Files moved
- `public/Icons.tsx` → `app/components/ui/Icons.tsx`
- `public/GridIcon.tsx` → `app/components/ui/GridIcon.tsx`
- `app/components/ListingAgentContactCard.tsx` → `app/components/listingDetailPage/ListingAgentContactCard.tsx`
- `app/components/ListingContactAgentForm.tsx` → `app/components/listingDetailPage/ListingContactAgentForm.tsx`

### Root-level components organized into `app/components/shared/`
- `Autocomplete.tsx`
- `ContactForm.tsx`
- `GoogleMap.tsx`
- `Modal.tsx`
- `PropertyTypeFilter.tsx`
- `RadioGroupCustom.tsx`

All imports updated across the codebase.

### Not-found pages fixed
- `app/not-found.tsx` — removed `"use client"` and `@tremor/react`, pure server component with Tailwind Links
- `app/listings/not-found.tsx` — same

### Commented-out code removed
- `propertyPlacementEdit/EditableConfirmationPage.tsx` — removed 5 commented Icon elements and 1 commented defaultValue

---

## Phase 3 — Type Safety ✅ DONE

**Goal:** Eliminate `any` type usages. Went from ~172 `any` usages down to 4 (all in `@ts-nocheck` file or JSDoc comments — no actual typed code).

### AuthContext
- `app/context/AuthContext.tsx` — `user: any` → `User | null` (Firebase `User` type), `// @ts-ignore` removed

### Services layer
- `services/index.ts` — fully typed `IAPArgs` interface, generic `service<T = unknown>()` function

### Zod validation schemas
- `app/lib/validations/listing.ts` — all `z.enum(X as any)` → `z.enum(X as [XType, ...XType[]])`, added `ListingSearchParams` export type
- `app/lib/validations/openAI.ts` — same pattern
- `app/lib/validations/savedFilters.ts` — same pattern

### Shared provider types
- `providers/types.ts` (created) — `export type AuthProps = { authToken?: string | null }`

### All 11 providers typed
- `providers/SavedListings/` — `props: any` → `AuthProps`, `Promise<any>` → proper response types
- `providers/SavedSearches/` — same
- `providers/Companies/` — typed with `CompanyProvider` namespace types
- `providers/Memberships/` — typed with `MembershipsProvider` types
- `providers/RecentlyViewedListings/` — typed
- `providers/CompanyMembershipInvites/` — typed
- `providers/ListingImages/` — typed
- `providers/ContactForm/` — typed
- `providers/Users/` — typed with `ApplicationUserProvider.GetProps`
- `providers/Listing/` — `props: any` → `ListingProvider.DetailProps`, `ListingSearchParams`, `DeleteProps`, `ListingsResponse`; all `UseMutationResult<X, any, Y>` → `UseMutationResult<X, Error, Y>`

Added to `providers/Listing/types.ts`:
```typescript
ListingsResponse = { results: Listing[]; total: number }
DetailProps = { id: number | string }
DeleteProps = { authToken?: string | null; data: { id: number } }
CreateProps = { authToken?: string | null }
```

### Filter system typed
- `app/components/listingsPage/Filters.tsx` — exported `FilterValues` and `RangeValue` types, all callback `any` params typed
- `app/components/listingsPage/ListingsPageContent.tsx` — `useState<FilterValues | null>`
- `app/components/listingsPage/ListingsPageFilters.tsx` — `(data: FilterValues)`
- `app/components/listingsPage/ListingsMain.tsx` — `searchParams: FilterValues | null`
- `app/components/listingsPage/ListingsPageHeader.tsx` — typed `Props`, `FormEvent<HTMLFormElement>`

### Component props typed
- `app/components/shared/PropertyTypeFilter.tsx` — `onChange: (value: string[]) => void`, `selectedValues: string[]`
- `app/components/propertyPlacementEdit/StepsTopInfo.tsx` — `step?: number`
- `app/components/propertyPlacementEdit/SingleSelectRadioButton.tsx` — `onChange?: (item: string) => void`, `value?: string`, `onBlur?: FocusEventHandler`
- `app/components/propertyPlacementEdit/PropertyPlacementRadioButtons.tsx` — same `onChange` and `value`
- `app/components/propertyPlacementEdit/Confirmation.tsx` — `payload: ListingProvider.CreateMutationPayload`
- `app/components/editProperty/EditForm.tsx` — `values: Record<string, unknown>`, cast to `Listing` at `mutateAsync`
- `app/listings/[id]/page.tsx` — `listing: Listing | null`

### Google Maps typed
- `types/global.d.ts` — `google: any` → `google?: typeof google`, `initGoogleServices` typed
- `app/lib/hooks/useGoogleServices.ts` — `window as Window & { google?: typeof google; ... }`
- `app/components/shared/GoogleMap.tsx` — same inline window cast
- `app/components/shared/Autocomplete.tsx` — `suggestion: google.maps.places.AutocompleteSuggestion`
- `app/components/propertyPlacementEdit/AddressAutocomplete.tsx` — same

### Error handlers typed
- `app/lib/api/handleError.ts` — `error: any` → `unknown` with instanceof + `in` narrowing for Firebase errors
- `app/api/users/_utils.ts` — `handleUserAPIUpdateError` same pattern

### Prisma layer typed
- `app/lib/db/index.ts` — all `any` → `Record<string, unknown>`, `(string | number)[]`
- `app/api/listings/_utils.ts` — `ListingSearchParams` param type, `Record<string, unknown>` for WHERE builder, `Partial<ListingImage>[]` for images, `Partial<Address>` for address, `Listing` for listing
- `app/api/images/[slug]/_utils.ts` — `ListingImage | null` return type
- `app/api/savedListings/_utils.ts` — `{ applicationUserId: number }` for savedListing param
- `app/api/generateDescription/_utils.ts` — `parsedValues: Record<string, unknown>`
- `app/api/companies/route.ts` — `Prisma.PrismaPromise<unknown>[]`

### Acceptable remaining `any` (4 total, not worth fixing)
- `app/lib/db/client.ts:17` — inside `// @ts-nocheck` file (Prisma middleware setup)
- `app/api/images/[slug]/_utils.ts:11` — stale JSDoc comment only
- `app/api/savedListings/_utils.ts:8` — stale JSDoc comment only
- `app/api/recentlyViewedListings/_utils.ts:7` — stale JSDoc comment only

---

## Phase 4 — Pattern Consolidation ✅ DONE

**Goal:** Remove duplicated UI patterns, consolidate Dialog/Modal, remove remaining Tremor components.

### 4a — Modal consolidated ✅
Rewrote `app/components/shared/Modal.tsx` with a generic API:
- `title`, `description`, `children` for content
- `confirmLabel` + `onConfirm` + `confirmDanger` for action buttons
- `onCancelClick` + `cancelLabel` for cancel button
- `onSubmitClick` kept for backward compat; auth redirects now use `confirmLabel` + `onConfirm`

Replaced all 4 inline `Dialog + Transition` blocks:
- `app/components/listingsPage/ListingsPageContent.tsx` — Dialog → Modal (save search confirmation)
- `app/components/profilePage/ProfilePageOwnListings.tsx` — Dialog → Modal (delete listing)
- `app/components/profilePage/SavedSearches.tsx` — Dialog → Modal (delete saved search)
- `app/components/profilePage/InvitesTab.tsx` — Dialog → Modal (decline/delete invite)

### 4b — Yup schema centralization ⏳ SKIPPED
Deferred — low risk, low urgency. Each form's schema is still inline. Can do as part of Phase 5 or standalone.

### 4c — Formik binding fixed in InvitesTab ✅ (partial)
`InvitesTab.tsx` now uses `formik.getFieldProps("fieldName")` for email input and role select.
Remaining files still use manual onChange — deferred:
- `app/components/shared/ContactForm.tsx`
- `app/components/profilePage/PersonalDetailsTab.tsx`
- `app/components/profilePage/CompanyTab.tsx`

### 4d — Date utility extracted ✅
Created `app/lib/formatDate.ts` with shared `formatDate()`.
Removed duplicate local `formatDate` functions from:
- `app/components/profilePage/SavedSearches.tsx`
- `app/components/profilePage/InvitesTab.tsx`

### Tremor removal (bonus) ✅
Removed all `@tremor/react` imports from touched files:
- `app/components/listingsPage/ListingsPageContent.tsx` — `Button` → Tailwind `<button>`
- `app/components/profilePage/InvitesTab.tsx` — `Button`, `Select`, `SelectItem`, `TextInput` → Tailwind equivalents

**Remaining Tremor usage to remove (Phase 5 or standalone):**
- Check if any other files still import from `@tremor/react` — run `grep -r "from \"@tremor"` to find them before removing the package

---

## Phase 5 — Component Refactoring ⏳ TODO

**Goal:** Break up oversized components. Highest risk — do last.

### 5a — Split `app/components/ListingItem.tsx` (~698 lines) ✅ DONE
Extracted into:
- `app/components/ListingItem.tsx` — public orchestrator only (data wiring, route navigation, lazy render)
- `app/components/listingItem/ListingItemCard.tsx` — visual layout (image, price, address, owner actions)
- `app/components/listingItem/ListingItemSaveButton.tsx` — saved/unsaved toggle with auth modal and mutation state
- `app/components/listingItem/ListingItemFeatures.tsx` — feature chip row
- `app/components/listingItem/ListingItemData.tsx` — labels, icons, and feature derivation helpers

### 5b — Split `app/components/editProperty/EditForm.tsx` (~848 lines)
Check whether sub-step components in `app/components/propertyPlacementEdit/` can be shared between the property placement flow and the edit flow. The two flows (place + edit) share the same sub-step data but differ only in the submit mutation. If shared, `EditForm.tsx` shrinks to a thin orchestrator.

---

## Key conventions established during refactor

- **Tailwind only** — no MUI, no @tremor/react
- **`app/components/shared/`** — shared UI primitives (Autocomplete, Modal, GoogleMap, ContactForm, PropertyTypeFilter, RadioGroupCustom)
- **`app/components/ui/`** — icon files (Icons.tsx, GridIcon.tsx)
- **`providers/types.ts`** — shared `AuthProps = { authToken?: string | null }`
- **Provider pattern** — each provider defines local compound types using `AuthProps & { data: PayloadType }`
- **Zod enums** — cast with `CONSTANT as [Type, ...Type[]]` not `as any`
- **Google Maps window** — inline cast `window as Window & { google?: typeof google }`, never `window as any`
- **Error handlers** — `error: unknown` + `instanceof` + `'key' in error` narrowing, never `error: any`
- **`FilterValues`** — exported from `Filters.tsx`, used by `ListingsMain`, `ListingsPageContent`, `ListingsPageFilters`
- **`ListingSearchParams`** — exported from `app/lib/validations/listing.ts`, used by API utils
