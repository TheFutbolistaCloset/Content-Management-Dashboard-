# Content Management Dashboard

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components inspired by shadcn/ui patterns
- **Icons**: Lucide React

## Commands

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Folder Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with sidebar
│   ├── page.tsx            # Dashboard home
│   ├── globals.css         # Global styles and theme variables
│   ├── instagram/page.tsx  # Instagram Manager
│   ├── analytics/page.tsx  # Analytics
│   ├── calendar/page.tsx   # Content Calendar
│   ├── competitors/page.tsx # Competitor Tracker
│   └── news/page.tsx       # News Consolidator
├── components/
│   ├── sidebar.tsx         # Shared sidebar navigation
│   └── ui/                 # Reusable UI primitives
│       └── card.tsx        # Card component variants
└── lib/
    └── utils.ts            # Utility functions (cn helper)
```

## Sections

| Section              | Route          | Purpose                                    |
| -------------------- | -------------- | ------------------------------------------ |
| Dashboard            | `/`            | Overview with links to all sections         |
| Instagram Manager    | `/instagram`   | Post scheduling, stories, engagement        |
| Analytics            | `/analytics`   | Performance metrics across channels         |
| Content Calendar     | `/calendar`    | Content pipeline planning                   |
| Competitor Tracker   | `/competitors` | Monitor competitor activity                 |
| News Consolidator    | `/news`        | Aggregate industry news and trends          |

## Component Conventions

- **UI primitives** live in `src/components/ui/` and are composable (Card, CardHeader, CardTitle, etc.)
- **Feature components** live in `src/components/`
- All components use the `cn()` utility from `src/lib/utils.ts` for conditional class merging
- Tailwind CSS v4 is used with `@theme` directive for design tokens in `globals.css`
- Dark theme is the default and only theme — all colors are defined as CSS custom properties

## Design Decisions

- **Dark theme only**: The dashboard uses a dark color scheme globally. All theme colors are defined in `globals.css` using the `@theme` directive.
- **Tailwind CSS v4**: Uses the new `@import "tailwindcss"` syntax and `@theme` for design tokens instead of `tailwind.config.js`.
- **PostCSS with `@tailwindcss/postcss`**: Tailwind v4 uses its own PostCSS plugin instead of the legacy `tailwindcss` PostCSS plugin.
- **No `tailwind.config.js`**: Tailwind v4 uses CSS-first configuration via `@theme` in `globals.css`.
- **Custom Card components**: Built from scratch following shadcn/ui patterns rather than using the shadcn CLI, to keep dependencies minimal.
- **Fixed sidebar layout**: 256px (`w-64`) fixed sidebar with `ml-64` offset on the main content area.
- **Purple accent (`#7c3aed`)**: Used as the primary color throughout the UI for active states, highlights, and accents.
