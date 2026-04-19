# TODOs

## Sanity Migration

- **Comment schema in Sanity**: Consider adding a `comment` Sanity schema if comment management moves from MongoDB/dashboard to Sanity Studio. Currently comments are user-generated content managed via Mongoose + Clerk in the app layer, which is the right default. Revisit if you want editors to moderate comments directly in Studio instead of the Next.js dashboard. Pros: single data store, Studio-based moderation, no MongoDB dependency. Cons: Sanity isn't designed for user-generated content at scale, requires write token in the app, changes auth flow. Depends on: Sanity migration complete.

- **Sanity preview mode (draft viewing)**: Add app-side draft preview using `@sanity/preview-url-secret` so draft blog/portfolio posts can be viewed with real site layout before publishing. Currently only Studio's built-in preview is available. Depends on: Sanity migration complete. Start: check `next-sanity` docs for `draftMode()` integration.

- **SEO sitemap generation from Sanity**: Add `src/app/sitemap.ts` using Next.js built-in sitemap support. Single GROQ query to list all published blog slugs, portfolio slugs, category/tag pages. Quick win (~20 lines). Depends on: Sanity migration complete.
