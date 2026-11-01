# AI_RULES.md

## Tech stack
- **Framework:** Next.js 16 using the App Router; routes and pages live under `src/app/`.
- **UI:** React 19 with TypeScript; keep application source code in `src/`.
- **Styling:** Tailwind CSS v4; prefer utility classes and the existing global stylesheet for shared base styles.
- **Database:** SQLite through `better-sqlite3`, accessed by server-side code only.
- **Icons:** `lucide-react` for interface icons.
- **Utilities:** `clsx` and `tailwind-merge` (via the existing utility in `src/lib/utils.ts`) for conditional and conflict-resolved Tailwind classes.
- **API:** Next.js Route Handlers under `src/app/api/` for server endpoints.
- **Linting:** ESLint 9 with the Next.js configuration; use the existing project scripts and conventions.

## Library and implementation rules
- Use **Next.js App Router** conventions for routing, layouts, pages, and API endpoints. Do not add React Router or create a separate routing system.
- Use **React** for interactive UI. Keep components in `src/components/`, shared state in `src/context/`, and page-specific route UI alongside its route in `src/app/`.
- Use **TypeScript** for application code and shared definitions; place shared domain types in `src/types/` when appropriate.
- Use **Tailwind CSS** for styling. Avoid adding another CSS framework or styling library; put only global/reset-level styles in `src/app/globals.css`.
- Use **lucide-react** for icons; avoid adding another icon package.
- Use **`clsx` and `tailwind-merge`** through `src/lib/utils.ts` when composing conditional Tailwind classes; do not duplicate their behavior with new dependencies.
- Use **`better-sqlite3` only in server-side modules and Route Handlers**. Never import database code into client components or expose database access to the browser.
- Use built-in **Next.js Route Handlers** for server APIs rather than adding a separate backend framework or HTTP server.
- Prefer existing dependencies and project patterns. Add a new library only when the task requires functionality that the existing stack cannot reasonably provide.
- Before changing Next.js APIs or conventions, consult the matching documentation included with the installed Next.js version; this project may use APIs that differ from older versions.
