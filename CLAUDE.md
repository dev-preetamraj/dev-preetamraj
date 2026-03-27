# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio and blog website for Preetam Raj (preetamraj.dev). Built with Next.js 14 (App Router), MongoDB/Mongoose, Clerk auth, Redux Toolkit, shadcn/ui (new-york style), and Tailwind CSS. Uses dark mode via next-themes with class strategy.

## Commands

```bash
yarn dev          # Start dev server
yarn build        # Production build
yarn lint         # ESLint (next/core-web-vitals)
yarn prettier     # Format all files with Prettier
```

No test framework is configured.

## Architecture

### Routing (App Router with Route Groups)

- `src/app/(portfolio)/` — Public portfolio pages (home, about, contact, portfolio/[slug])
- `src/app/(blog)/` — Public blog pages (blog/[slug], categories/[slug], tags/[slug])
- `src/app/dashboard/` — Admin dashboard (blog, category, tags, comments, projects, media, courses)
- `src/app/auth/` — Clerk sign-in/sign-up pages

Each route group has its own layout. The root layout wraps everything in ClerkProvider > ThemeProvider > ReduxProvider.

### Data Flow

**No API routes.** All data access uses Next.js Server Actions in `src/actions/`. Each action file corresponds to a Mongoose model and follows the pattern: connect to DB, perform operation, return typed `IResponse<T>`.

- `src/actions/` — Server actions (blog, categories, tags, comments, portfolio, user)
- `src/models/` — Mongoose schemas and TypeScript interfaces (Blog, Category, Tag, Comment, Portfolio, User)
- `src/lib/dbConnect.ts` — Cached MongoDB connection using global singleton pattern

### State Management

Redux Toolkit (`src/features/store.ts`) with a single `navbar` slice. The store is provided via `src/providers/Provider.tsx` (client component).

### UI Layer

- `src/components/ui/` — shadcn/ui primitives (new-york style, zinc base color, CSS variables for theming)
- `src/components/` — Domain components (blog, portfolio, comments, forms, global)
- `src/components/forms/` — React Hook Form + Zod validation for dashboard CRUD forms
- Path alias: `@/*` maps to `./src/*`

### Auth

Clerk handles authentication via `clerkMiddleware()` in `src/middleware.ts`. Dashboard routes are protected. Remote images allowed from: cdn.sanity.io, res.cloudinary.com, images.unsplash.com, img.clerk.com.

### Environment Variables

Requires `MONGODB_URI` and Clerk keys in `.env.local`.
