# AGENTS.md

This file provides guidance to AI coding agents working in this repository.

## Project Overview

Personal portfolio and blog website for Preetam Raj (preetamraj.dev). Built with Next.js 16 (App Router), Sanity (content + embedded Studio), shadcn/ui (new-york style), and Tailwind CSS. Uses dark mode via next-themes with class strategy.

## Commands

```bash
bun install       # Install dependencies
bun run dev       # Start dev server
bun run build     # Production build
bun run lint      # ESLint (next/core-web-vitals)
bun run prettier  # Format all files with Prettier
bun test          # Run unit tests (Bun's built-in test runner)
```

### Testing

Unit tests use Bun's built-in runner (`bun test`, imports from `bun:test`). Tests live in a
`__tests__/` folder colocated with the module under test and are named `<module>.test.ts`
(e.g. `src/lib/__tests__/ranking.test.ts` tests `src/lib/ranking.ts`). Keep tests
deterministic - pass time in explicitly (e.g. a fixed `NOW`) rather than reading the clock.
Pure logic (the ranking module) is unit-tested; GROQ queries and React Server Components that
need live Sanity data are verified end-to-end via the running app.

## Architecture

### Routing (App Router with a Route Group)

- `src/app/(site)/` - Every public page (home, about, contact, portfolio, portfolio/[slug], blog, blog/[slug], categories, categories/[slug], tags, tags/[slug]); its layout wraps them in `SiteShell`
- `src/app/studio/` - Embedded Sanity Studio (content authoring/admin, uses Sanity's own auth)

The root layout wraps everything in next-themes' ThemeProvider and mounts the sonner Toaster.

### Data Flow

**Sanity is the single source of truth.** Content is authored in the embedded Studio at `/studio` and read on the public site via the GROQ query layer in `src/sanity/`.

- `src/sanity/lib/client.ts` / `write-client.ts` - read client (CDN) and server-only write client (write token)
- `src/sanity/lib/queries/` - GROQ queries + types (posts, projects, categories, tags, search, comments) with a `sanityFetch<T>()` wrapper
- `src/sanity/schemaTypes/` - Sanity document schemas (post, project, category, tag, comment, blockContent)
- `src/actions/` - the three Server Actions, all Sanity-backed: `sanity-comment.ts` (public comment read/write with honeypot + IP rate limiting), `search.ts` (navbar search), and `post-view.ts` (view counting, deduped per day by salted IP hash)

### Content authoring (markdown import)

Blog posts are drafted as local markdown files in the git-ignored `content/` workspace and pushed into Sanity as Studio drafts via `scripts/import-post.ts` (`bun run import:post <file>`). The script parses frontmatter, converts the body to Portable Text, and resolves the post's `category` + `tags` against existing documents (reusing by slug, creating any that are missing). The markdown file contract (required frontmatter, how slugs and category/tag names are derived) is documented in `content/README.md` - read it before changing the importer or the frontmatter format.

### Ranking / recommendation algorithm

`src/lib/ranking.ts` is the single source of truth for how content is scored and ordered
(home-page post recommendations, trending categories). GROQ queries only gather raw signals
(views, dates, counts); all scoring formulas and tunable weights live in the module's
`RANKING` object. The module is pure - time is passed in as a `nowMs` argument - so it is
directly unit-testable. Consumers: `src/app/(site)/page.tsx` (`rankPosts`, plus
`rankCategories` fed by `TRENDING_CATEGORY_STATS_QUERY` for the home Topics),
`src/app/(site)/blog/page.tsx` (`rankPosts`, "Top ranking" sort),
`src/app/(site)/blog/[slug]/page.tsx` (`rankRelated`) and `src/components/layout/Rail.tsx`
(`rankPosts`, to keep the featured post out of Most Read).

### State Management

No global store. `src/components/layout/SiteShell.tsx` (client) owns the only shared UI state
with `useState`: the mobile menu toggle (passed to Navbar and Sidebar) and the current
page's breadcrumb title, which detail pages report by rendering `<BreadcrumbTitle title=... />`.
The page scrolls the window (no scroll container), so scroll listeners use `window`.

### UI Layer

- `src/components/ui/` - shadcn/ui primitives (new-york style, zinc base color, CSS variables for theming)
- `src/components/layout/` - Layout primitives (SiteShell, PageLayout, Section, Stack, Text, Card, ListRow, Meta, Rail...) and the site chrome (`layout/chrome/`: Navbar, Sidebar, Breadcrumb, search)
- `src/components/` - Domain components (blog, portfolio, comments, forms, global)
- `src/components/forms/` - React Hook Form + Zod validation (e.g. the public comment form)
- Path alias: `@/*` maps to `./src/*`

### Auth

There is no app-level auth. Content administration happens inside the embedded Sanity Studio at `/studio`, which uses Sanity's own authentication. Remote images allowed from: cdn.sanity.io, res.cloudinary.com.

### Environment Variables

Requires the `NEXT_PUBLIC_SANITY_*` keys (project id, dataset, API version) and `SANITY_API_WRITE_TOKEN` in `.env`.
