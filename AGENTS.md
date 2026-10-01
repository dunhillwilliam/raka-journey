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

5. **No router.** Navigation is state-driven via `activeTab` in `AppContext` and guarded by `ROLE_TAB_ACCESS` (role → allowed tabs). When adding tabs, update `NavTab`, `ROLE_TAB_ACCESS` in `src/context/AppContext.tsx`, the sidebar `NAV_ITEMS`, and `App.tsx` rendering.

## Architecture

- Single source of truth: `src/context/AppContext.tsx` (role, data, modals, cloud config, RBAC tab map). Views/modals consume only via `useApp()`; they never hold their own data.
- Data layer: `src/lib/supabase.ts` (`get*`/`save*` functions). File uploads: `src/lib/cloudflareR2.ts` (`uploadFileToR2`).

## Access Model

- `mentor` = full access; `parent` & `student` = restricted (see `ROLE_TAB_ACCESS`). Role switching is client-side UI gating — there is no auth backend.

## Modify Before You Build

When editing forms, data access, or navigation, preserve cloud-only behavior and empty-form defaults described above, then verify with `bun run lint` and `bun run build`.
