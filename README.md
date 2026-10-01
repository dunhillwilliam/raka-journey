# Raka — Learning Journey

A single-page web application for documenting, monitoring, and evaluating the learning journey of a young student (Raka). It combines daily mentoring session reports, competency analytics, parent observations, a curiosity log, a portfolio gallery, and monthly growth recaps in a role-aware dashboard.

Built as a React single-page app with **no router** — navigation is state-driven via React Context.

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI | React 19, TypeScript, Vite 8, Tailwind CSS v4 |
| Icons / Motion | lucide-react, motion |
| Backend / Persistence | Supabase (PostgreSQL) |
| File / Object Storage | Cloudflare R2 (via Worker proxy) |
| AI (optional) | @google/genai (Gemini) |

> **Data is persisted exclusively to Supabase (records) and Cloudflare R2 (files).** There is **no localStorage caching, no local fallback, and no bundled demo/seed data**. Everything is read from and written to the cloud. Configuration is provided through environment variables, never the browser.

## Quick Start

```bash
bun install          # install dependencies (bun is required)
bun run dev          # start dev server on http://localhost:3000
bun run lint         # typecheck (tsc --noEmit)
bun run build       # production build (vite build → dist/)
bun run preview     # preview the production build
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `VITE_CF_R2_ACCOUNT_ID` | Cloudflare account ID |
| `VITE_CF_R2_BUCKET_NAME` | R2 bucket name (default `raka-learning-assets`) |
| `VITE_CF_R2_PUBLIC_URL` | R2 public domain (e.g. `https://pub-xxxx.r2.dev`) |
| `VITE_CF_R2_WORKER_PROXY` | Cloudflare Worker proxy URL for uploads |

Credentials are read from `VITE_*` variables at runtime. They are **not** stored in the browser.

## Roles & Access Control

The app supports three roles, switched in the UI (a client-side persona switch):

| Role | Access |
|------|--------|
| **Mentor** (Kak Sabina) | Full access — all tabs, create sessions, observations, cloud config, data refresh |
| **Parent** (Orang Tua) | Restricted — dashboard, progress, curiosity, parent corner, gallery (no settings / no session creation) |
| **Student** (Raka) | Restricted — dashboard, progress, curiosity, gallery (learning & portfolio exploration) |

Tab visibility and route guards are driven by `ROLE_TAB_ACCESS` in `src/context/AppContext.tsx`. Access is enforced on the client (UI gating only — there is no auth backend).

## Project Structure

```
src/
├── main.tsx               # React entry point
├── App.tsx                # Root provider + "router" (state-driven view switching)
├── index.css              # Tailwind CSS v4 entry
├── types/
│   └── index.ts          # All shared TypeScript interfaces + UserRole
├── lib/
│   ├── supabase.ts       # Supabase client, data access layer, SQL migration script
│   ├── cloudflareR2.ts  # R2 config + file upload (Worker proxy), Worker script
│   └── initialData.ts   # Only competency definitions (static metadata — no seed data)
├── context/
│   └── AppContext.tsx   # Global state: role, data, modals, cloud config, RBAC tab map
└── components/
    ├── layout/          # Sidebar (nav + role switch), Header
    ├── views/           # Dashboard, DailyReport, Progress, Curiosity,
    │                   # ParentCorner, MonthlyReport, Gallery, Settings
    ├── modals/          # NewSession, NewCuriosity, NewFeedback, UploadArtwork, PdfPreview
    └── illustrations/   # SVG art assets (e.g. RakaAvatar)
```

## Data Flow (Cloud-Only)

All reads/writes go through `src/lib/supabase.ts`. There is deliberately **no localStorage fallback**:

```
UI component (view/modal)
      │  reads/writes via useApp() context
      ▼
AppContext.tsx (sessions, curiosity, feedback, artworks, profile, monthly report)
      │
      ▼
lib/supabase.ts (get*/save* functions)
      │
      ▼
Supabase PostgreSQL
```

File uploads go through `src/lib/cloudflareR2.ts` → Cloudflare Worker → R2 bucket, and the object URL is recorded in Supabase's `artworks` table.

If Supabase is not configured (no valid `VITE_SUPABASE_URL`), getters return empty arrays and savers no-op.

## Supabase Schema

Run the migration script (in `src/lib/supabase.ts::SUPABASE_SQL_MIGRATION`) in the Supabase SQL editor. It creates six tables with public RLS policies:

- `sessions` — daily mentoring session reports
- `curiosity_questions` — student curiosity log
- `parent_feedbacks` — weekly parent observations
- `artworks` — portfolio entries referencing R2 objects
- `monthly_reports` — monthly growth summaries
- `user_profile` — student profile/notification preferences

## Cloudflare R2 Uploads

Artwork files are uploaded via a Cloudflare Worker proxy (`uploadFileToR2`). If `VITE_CF_R2_WORKER_PROXY` is set, files are POSTed to the Worker's `/upload` endpoint. A ready-to-deploy Worker script is exported as `CLOUDFLARE_R2_WORKER_SCRIPT` in `src/lib/cloudflareR2.ts`; bind your R2 bucket as `MY_BUCKET` (see the script's comments).

## Architecture Notes for Developers

- **Navigation**: There is no router. `App.tsx` renders the active view from `activeTab`, guarded by the role's allowed tabs.
- **State**: `AppContext` is the single source of truth for all data and UI state; no view holds its own data.
- **Forms**: All input forms start empty — no hardcoded/example prefill values. User-entered data is the only data.
- **Gemini**: The `@google/genai` SDK is available for optional AI features (server-side usage via `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`).
