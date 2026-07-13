/**
 * Step 1 of the write-blog-post skill: list every existing post (published +
 * drafts) so a new topic doesn't duplicate one and improvable posts are visible.
 *
 * Usage: bun run .claude/skills/write-blog-post/scripts/list-titles.ts
 */
import { createClient } from '@sanity/client';

function env(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    console.error(`Missing environment variable: ${name} (is it set in .env?)`);
    process.exit(1);
  }
  return value;
}

const client = createClient({
  projectId: env('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: env('NEXT_PUBLIC_SANITY_DATASET'),
  apiVersion: env('NEXT_PUBLIC_SANITY_API_VERSION', '2024-10-01'),
  token: env('SANITY_API_WRITE_TOKEN'),
  useCdn: false,
});

type Row = {
  title: string;
  slug: string | null;
  description: string | null;
  isPublished: boolean;
  category: string | null;
};

const rows = await client.fetch<Row[]>(
  `*[_type == "post"] | order(isPublished desc, publishedAt desc, _createdAt desc){
    title,
    "slug": slug.current,
    description,
    "isPublished": coalesce(isPublished, false),
    "category": category->name
  }`
);

const published = rows.filter((r) => r.isPublished);
const drafts = rows.filter((r) => !r.isPublished);

const fmt = (r: Row) =>
  `- ${r.title}${r.category ? `  [${r.category}]` : ''}${r.description ? `\n    ${r.description}` : ''}`;

console.log(`# Existing blog posts (${rows.length} total)\n`);
console.log(`## Published (${published.length})\n`);
console.log(published.map(fmt).join('\n') || '(none)');
console.log(`\n## Drafts (${drafts.length})\n`);
console.log(drafts.map(fmt).join('\n') || '(none)');
