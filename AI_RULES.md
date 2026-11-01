# AI_RULES.md

## Tech stack
- **Framework:** Next.js 16 with the App Router; routes and API handlers live under `src/app/`.
- **UI:** React 19 with TypeScript; keep application code in `src/`.
- **Styling:** Tailwind CSS v4, with global styles and theme setup in `src/app/globals.css`.
- **Database:** SQLite via `better-sqlite3`, used by server-side code through `src/lib/db.ts`.
- **Icons:** `lucide-react` for interface icons.
- **Class utilities:** `clsx` for conditional classes and `tailwind-merge` for resolving conflicting Tailwind classes; use the existing `src/lib/utils.ts` helper when appropriate.
- **Runtime:** Node.js server runtime for database-backed API routes; SQLite access must remain server-side.
- **Quality tools:** TypeScript for static typing and ESLint using the Next.js configuration.

## Library and implementation rules
- Use **Next.js App Router** conventions: pages/layouts in `src/app/` and HTTP endpoints in `src/app/api/**/route.ts`. Do not introduce React Router or a separate server framework.
- Use **React and TypeScript** for UI and application logic. Add explicit types for API data and shared models in `src/types/` where they are reused.
- Use **Tailwind CSS** for component styling. Put truly global rules and design tokens in `src/app/globals.css`; avoid adding another styling system or component library without a clear need.
- Use **lucide-react** for icons; do not add a competing icon package.
- Use **clsx** for conditional class composition and **tailwind-merge** (prefer the existing helper in `src/lib/utils.ts`) when conditional Tailwind classes may conflict. Do not hand-roll class-merging logic.
- Use **better-sqlite3** only in server-side modules and API routes. Keep database queries and schema concerns in `src/lib/db.ts`; never import SQLite code into client components or expose credentials/secrets to the browser.
- Use the built-in **Fetch API** from client components for this app's own API routes. Avoid adding a request library for ordinary endpoint calls.
- Prefer native browser and platform APIs for simple needs. Add a dependency only when it provides necessary functionality that the existing stack does not cover.
- Keep client components limited to interactive/browser-dependent UI; prefer server components for rendering and data access unless client-side state or browser APIs are required.
- Follow the existing component boundaries under `src/components/`, shared state under `src/context/`, and shared helpers under `src/lib/`. Avoid unrelated refactors when implementing a focused change.
- Before changing Next.js APIs or conventions, consult the installed Next.js documentation as instructed in `AGENTS.md`; this project uses Next.js 16 and conventions may differ from older versions.
- Preserve the Snoopy menu's Portuguese copy and established dark, red, and yellow brand styling when modifying customer-facing screens.
