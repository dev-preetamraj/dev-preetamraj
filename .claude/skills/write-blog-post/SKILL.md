---
name: write-blog-post
description: >
  Write a new blog post for preetamraj.dev end-to-end: gather existing coverage,
  brainstorm a trending topic, finalise the idea, draft it in Preetam's voice and
  the repo's markdown contract, audit it (human / plagiarism-free / SEO), generate
  a matching thumbnail, and import it into Sanity as a draft with its featured
  image. Use when the user wants to write, draft, or publish a new blog post /
  article for this site, or asks to "write a blog e2e", start a new post, or take a
  post topic from idea to Sanity draft. The user drives it - they can supply the
  topic, or ask to brainstorm one; skip or reorder steps on request.
---

# Write a blog post (end to end)

Takes a blog post from nothing to a review-ready Sanity draft for **preetamraj.dev**.
Seven steps. Do them in order, but let the user redirect, skip, or jump in with their
own topic. Confirm the idea (Step 3) and let the user review the draft and thumbnail
before importing (Step 7).

**The single source of truth is Sanity**; posts are drafted as local markdown in the
git-ignored `content/` workspace, then pushed in via `scripts/import-post.ts`. Read
`content/README.md` (the markdown contract) and the root `CLAUDE.md` before writing.

Prereqs: `bun`, and the `.env` keys (`NEXT_PUBLIC_SANITY_*`, `SANITY_API_WRITE_TOKEN`)
already present in the repo. Run everything from the repo root.

## Step 1 - Gather existing coverage

Know what already exists so the new topic doesn't duplicate one, and so improvable
posts are visible.

```bash
bun run .claude/skills/write-blog-post/scripts/list-titles.ts
```

Prints every post (published + drafts) as `title [category]` + description. Summarise
the coverage landscape by category before moving on.

## Step 2 - Brainstorm a trending topic

Find a topic people actively search/discuss that fits this blog and fills a gap.

- Fan out a few `WebSearch` queries. **Anchor on fundamentals developers search and
  struggle with** (SOLID, DI, closures, async, immutability, error handling, testing),
  NOT "industry trend" roundups - those return hype (AI, cloud-native, low-code) that
  does not match this blog's evergreen-craft voice.
- Filter every candidate through three tests:
  1. Actively searched / discussed on the internet.
  2. Fits the blog's voice (focused, practical, evergreen - like *Pure Functions*,
     *Guard Clauses*, *Strategy Pattern*).
  3. Fills a gap vs Step 1 (do not duplicate an existing post).
- Deliver a ranked shortlist (≈5) + one recommendation with rationale. Cite sources.

## Step 3 - Finalise the idea

Pick ONE focused single idea, not a broad listicle (every existing post is one tight
concept). Confirm the choice with the user before drafting.

## Step 4 - Write the draft (voice + format)

Write into `content/drafts/DD-MM-YYYY-<keyword-slug>.md` (date = today, DD-MM-YYYY).

**Before writing**, read `content/README.md` for the frontmatter contract AND read 2
existing posts in `content/published/` to internalise the voice.

Frontmatter (see contract; `title`/`description`/`category` are required by Sanity):

```yaml
---
title: "Human readable title"
date: DD-MM-YYYY
status: draft
thumbnail: content/thumbnails/DD-MM-YYYY-<keyword-slug>.webp   # add in Step 6
category: Design Patterns          # SINGLE value
tags: [Design Patterns, SOLID, ...]
description: "One-sentence excerpt / meta description."
---
```

**Voice signature to match (Preetam's):**
- Opinionated first-person hook.
- Structure: naive "it always starts clean" version → the exact moment it breaks →
  the fix → **bold lead-in** benefit bullets → an honest "when you DON'T need it" →
  a `## The takeaway` closer.
- One focused idea. Python examples, kept minimal. British spelling (behaviour,
  modelling, favour). *Italics* for key contrasts, inline `code` for identifiers.
- **No em-dashes anywhere** (repo + user rule) - use " - ". Match the comment density
  of the code in sibling posts.

**Rules that avoid the mistakes we hit:**
- Use a FRESH example domain so code doesn't echo existing posts (taken: shipping
  strategies, game-character abilities, OrderService+email). Pick a new one.
- Add 2-4 **internal links** to sibling posts whose themes this echoes. Fetch their
  REAL slugs from Sanity (`*[_type=="post" && title in $t]{ "slug": slug.current }`)
  and use **ABSOLUTE** URLs: `https://preetamraj.dev/blog/<slug>`. NEVER relative
  `/blog/<slug>` - they import fine but fail Sanity Studio's link validation ("Not a
  valid URL") when editing.

**Validate after writing:** `grep -c '—'` must be 0; required frontmatter present;
code fences balanced (even count); ~1000-1300 words to match siblings.

## Step 5 - Audit the draft

Three axes. Measure, then fix.

- **Human-sounding:** editorial read. Flag AI tells (em-dashes, "in today's world",
  "it's important to note", bland summaries) and any borrowed idioms; confirm the
  cadence matches the user's real posts.
- **Plagiarism-free:** `WebSearch` the post's most distinctive sentences *verbatim*
  (quoted), incl. the title. Concept-only matches are fine (ideas are universal);
  verbatim passage matches are a problem. Replace any borrowed idiom.
- **SEO:** title ≤60 chars (else Google truncates); meta description 150-160 chars,
  PLAIN TEXT (no backticks/markdown - they render literally in the SERP); 2-4 internal
  links present; primary keyword appears a few× + variants. Set expectations: a
  personal blog won't win a head term - target the long-tail the title leans into.

## Step 6 - Generate the thumbnail

Invoke the **`blog-thumbnail`** skill, pointed at the draft file. It must join the
existing set:

- First read 1-2 `content/thumbnails/*.webp` to learn the house style: two-column -
  eyebrow (warm skewed-bars mark + `CATEGORY · X`) / heavy grotesque title with ONE
  word highlighted in the accent / gradient rule / bold-word subtitle /
  `preetamraj.dev · tagline` footer, beside a tilted macOS code window with real
  syntax-highlighted code.
- Keep the layout identical; give the post its OWN accent hue (taken: composition
  =emerald, strategy=amber, DI=cyan). The code panel tells the post's story in ~6
  lines.
- Save the final WebP into `content/thumbnails/<same-basename-as-the-draft>.webp` -
  the basename match is how the post links to its image. Placing it in the project is
  also how the USER sees it (reading it back only shows Claude). Then set the
  `thumbnail:` frontmatter key (Step 4) to that path.

## Step 7 - Import into Sanity as a draft

```bash
bun run import:post content/drafts/DD-MM-YYYY-<keyword-slug>.md
```

`scripts/import-post.ts` converts the markdown to Portable Text, resolves/creates the
category + tags, and - when `thumbnail:` is set - uploads that image and attaches it
as `featuredImage` (alt defaults to the title; override with an `alt:` key). Sanity
dedupes assets by content hash, so re-imports reuse the asset. The post is saved as
`drafts.<slug>` with `isPublished: false`.

**Verify** by fetching the draft: `featuredImage.asset->url` resolves (cdn.sanity.io),
`featuredImage.alt` is set, and every `content[].markDefs[_type=="link"].href` is an
absolute `https://preetamraj.dev/...` URL.

**Then (manual, by the user):** review at `/studio/structure/post;<slug>` and publish.
Optionally move the md file to `content/published/` and flip `status: published`.

## Notes

- Typecheck the importer with `tsc --noEmit -p tsconfig.json` (project config), never
  `tsc` on a single file - standalone tsc drops the `@/*` alias + `skipLibCheck` and
  throws false positives (Buffer/Uint8Array, missing modules).
- Format touched files with `bunx prettier --write <files>`.
- Do throwaway scripting in the session scratchpad, not `/tmp` and not the repo.
