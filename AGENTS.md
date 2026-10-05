# AGENTS.md

Guidance for AI agents and contributors working on the Raka Learning Journey codebase.

## Commands

- Dev server: `bun run dev` (bun is the package manager — do not use npm)
- Typecheck: `bun run lint` (tsc --noEmit)
- Build: `bun run build` (vite build)
- Run `bun run lint` after any code change.

## Critical Conventions

1. **Cloud-only persistence.** All data comes **only** from Supabase (records) and Cloudflare R2 (files). **NEVER use localStorage** for data, caching, fallbacks, or seed/demo records. Do not reintroduce local fallbacks when editing `src/lib/supabase.ts` or `src/lib/cloudflareR2.ts`.

2. **Configuration via env vars only.** Supabase/R2 credentials come from `VITE_*` env variables. Never persist credentials to the browser. In `src/lib/supabase.ts`, `setCustomSupabaseCredentials`/`clearCustomSupabaseCredentials` only reset the cached client instance; they must not write config to storage.

3. **No placeholder/prefill data in forms.** All input forms start empty (empty strings/arrays, `0`, first-option or blank selects). Do not add example/prefill/default values to `useState` initializers or submit-fallback strings. Keep `placeholder="..."` attributes (they are UX hints, not data) but never use them as stored values.

4. **No hardcoded demo/default records.** `src/lib/initialData.ts` must only contain static metadata (e.g. `INITIAL_COMPETENCIES`). Collection records come strictly from Supabase. Monthly report views should derive options from real data, not hardcoded month lists.

5. **No router.** Navigation is state-driven via `activeTab` in `AppContext`. The main app is mentor-only. Two separate standalone pages are served via URL params:
   - `?view=parent` → ParentPage (read-only reports, feedback, progress, curiosity, gallery)
   - `?view=raka` → RakaPage (add curiosity questions + upload artwork)

## Architecture

- **Three entry points in `App.tsx`** routed by `?view=` URL param:
  - No param → mentor-only main app with `AppProvider` + `MainLayout`
  - `?view=parent` → standalone `ParentPage` (reads Supabase directly, no role-gating)
  - `?view=raka` → standalone `RakaPage` (reads/writes Supabase directly, no role-gating)
- Single source of truth (mentor app): `src/context/AppContext.tsx` (data, modals, cloud config). Views/modals consume only via `useApp()`; they never hold their own data.
- Data layer: `src/lib/supabase.ts` (`get*`/`save*` functions). File uploads: `src/lib/cloudflareR2.ts` (`uploadFileToR2`).
- Standalone pages import data functions directly from `src/lib/supabase.ts`.

## Access Model

- The main app is **mentor-only** — no role switching, no RBAC.
- Parent and Raka pages are completely separate standalone pages with their own UI and data access.

## Modify Before You Build

When editing forms, data access, or navigation, preserve cloud-only behavior and empty-form defaults described above, then verify with `bun run lint` and `bun run build`.

When adding features to the parent or raka pages, modify the corresponding page in `src/pages/` — not the main mentor app.