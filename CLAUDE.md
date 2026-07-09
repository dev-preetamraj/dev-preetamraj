# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio and blog website for Preetam Raj (preetamraj.dev). Built with Next.js 14 (App Router), Sanity (content + embedded Studio), Redux Toolkit, shadcn/ui (new-york style), and Tailwind CSS. Uses dark mode via next-themes with class strategy.

## Commands

```bash
bun install       # Install dependencies
bun run dev       # Start dev server
bun run build     # Production build
bun run lint      # ESLint (next/core-web-vitals)
bun run prettier  # Format all files with Prettier
```

No test framework is configured.

## Architecture

### Routing (App Router with Route Groups)

- `src/app/(portfolio)/` — Public portfolio pages (home, about, contact, portfolio/[slug])
- `src/app/(blog)/` — Public blog pages (blog/[slug], categories/[slug], tags/[slug])
- `src/app/studio/` — Embedded Sanity Studio (content authoring/admin, uses Sanity's own auth)

Each route group has its own layout. The root layout wraps everything in ThemeProvider > ReduxProvider.

### Data Flow

**Sanity is the single source of truth.** Content is authored in the embedded Studio at `/studio` and read on the public site via the GROQ query layer in `src/sanity/`.

- `src/sanity/lib/client.ts` / `write-client.ts` — read client (CDN) and server-only write client (write token)
- `src/sanity/lib/queries/` — GROQ queries + types (posts, projects, categories, tags, search, comments) with a `sanityFetch<T>()` wrapper
- `src/sanity/schemaTypes/` — Sanity document schemas (post, project, category, tag, comment, blockContent)
- `src/actions/` — the two remaining Server Actions, both Sanity-backed: `sanity-comment.ts` (public comment read/write with honeypot + IP rate limiting) and `search.ts` (navbar search)

### State Management

Redux Toolkit (`src/features/store.ts`) with a single `navbar` slice. The store is provided via `src/providers/Provider.tsx` (client component).

### UI Layer

- `src/components/ui/` — shadcn/ui primitives (new-york style, zinc base color, CSS variables for theming)
- `src/components/` — Domain components (blog, portfolio, comments, forms, global)
- `src/components/forms/` — React Hook Form + Zod validation (e.g. the public comment form)
- Path alias: `@/*` maps to `./src/*`

### Auth

There is no app-level auth. Content administration happens inside the embedded Sanity Studio at `/studio`, which uses Sanity's own authentication. Remote images allowed from: cdn.sanity.io, res.cloudinary.com, images.unsplash.com.

### Environment Variables

Requires the `NEXT_PUBLIC_SANITY_*` keys (project id, dataset, API version) and `SANITY_API_WRITE_TOKEN` in `.env`.
