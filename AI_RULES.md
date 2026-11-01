# Project Guidance

## Tech stack
- React for the user interface.
- TypeScript for all application source code.
- React Router for client-side routing; keep route definitions in `src/App.tsx`.
- Tailwind CSS for layout, spacing, colors, responsive behavior, and component styling.
- shadcn/ui for accessible, reusable interface primitives.
- Radix UI powers the underlying accessible interactions used by shadcn/ui.
- lucide-react for interface icons.
- Organize application source under `src/`, with pages in `src/pages/` and reusable components in `src/components/`.
- The default page is `src/pages/Index.tsx`; include new visible components there when appropriate.

## Library and implementation rules
- Use React and TypeScript for application features; do not introduce another UI framework.
- Use React Router for navigation and route configuration, not ad-hoc routing logic.
- Prefer existing shadcn/ui components for standard controls and patterns. Import and compose them; do not edit the library component files. Create app-owned components when customization is needed.
- Use Radix UI primitives when a needed accessible interaction is not available through the existing shadcn/ui components.
- Use Tailwind CSS utility classes for styling. Avoid adding another styling system or inline styles unless a dynamic value makes them necessary.
- Use lucide-react for icons; avoid adding another icon library.
- Keep page-level components in `src/pages/` and shared components in `src/components/`.
