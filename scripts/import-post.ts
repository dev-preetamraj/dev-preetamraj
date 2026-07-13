/**
 * Imports a local markdown file (frontmatter + body) into Sanity as a Studio
 * draft post. Converts the markdown body to Portable Text and resolves the
 * post's category + tags against existing documents, creating any that are
 * missing. Re-running on the same file overwrites the same draft.
 *
 * Usage: bun run scripts/import-post.ts content/drafts/<file>.md
 */
import { readFileSync } from 'node:fs';
import { basename, isAbsolute, resolve } from 'node:path';

import { createClient } from '@sanity/client';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

import { slugify } from '@/sanity/schemaTypes/slugify';

type Token = ReturnType<InstanceType<typeof MarkdownIt>['parse']>[number];

type Span = { _type: 'span'; _key: string; text: string; marks: string[] };
type MarkDef = { _type: 'link'; _key: string; href: string };
type Block =
  | {
      _type: 'block';
      _key: string;
      style: string;
      markDefs: MarkDef[];
      children: Span[];
      listItem?: 'bullet' | 'number';
      level?: number;
    }
  | {
      _type: 'code';
      _key: string;
      code: string;
      language?: string;
      filename?: string;
    };

const key = () => crypto.randomUUID().replace(/-/g, '').slice(0, 12);

const MAX_SLUG_LENGTH = 96; // matches the `maxLength` on the slug schema fields

/** Slugify like Studio's Generate button: strict slug + the schema's length cap. */
const toSlug = (input: string) =>
  slugify(input).slice(0, MAX_SLUG_LENGTH).replace(/-+$/, '');
const warn = (msg: string) => console.warn(`  ! ${msg}`);

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

const md = new MarkdownIt();

/** Convert one markdown-it `inline` token into Portable Text spans + link markDefs. */
function inlineToSpans(inline: Token | undefined): {
  children: Span[];
  markDefs: MarkDef[];
} {
  const children: Span[] = [];
  const markDefs: MarkDef[] = [];
  const marks: string[] = [];

  const removeMark = (m: string) => {
    const i = marks.lastIndexOf(m);
    if (i !== -1) marks.splice(i, 1);
  };

  const push = (text: string) => {
    if (!text) return;
    const current = [...marks];
    const last = children[children.length - 1];
    const sameMarks =
      last &&
      last.marks.length === current.length &&
      last.marks.every((m) => current.includes(m));
    if (sameMarks) last.text += text;
    else children.push({ _type: 'span', _key: key(), text, marks: current });
  };

  for (const t of inline?.children ?? []) {
    switch (t.type) {
      case 'text':
        push(t.content);
        break;
      case 'code_inline':
        marks.push('code');
        push(t.content);
        removeMark('code');
        break;
      case 'strong_open':
        marks.push('strong');
        break;
      case 'strong_close':
        removeMark('strong');
        break;
      case 'em_open':
        marks.push('em');
        break;
      case 'em_close':
        removeMark('em');
        break;
      case 's_open':
        marks.push('strike-through');
        break;
      case 's_close':
        removeMark('strike-through');
        break;
      case 'link_open': {
        const href = t.attrGet('href') ?? '';
        const linkKey = key();
        markDefs.push({ _type: 'link', _key: linkKey, href });
        marks.push(linkKey);
        break;
      }
      case 'link_close':
        marks.splice(marks.length - 1, 1);
        break;
      case 'softbreak':
      case 'hardbreak':
        push('\n');
        break;
      case 'image':
        warn(`dropped inline image: ${t.attrGet('src') ?? ''}`);
        break;
      default:
        // html_inline and anything unmapped: ignore silently.
        break;
    }
  }

  return { children, markDefs };
}

function parseFence(info: string): { language?: string; filename?: string } {
  const trimmed = info.trim();
  if (!trimmed) return {};
  const [language, ...rest] = trimmed.split(/\s+/);
  const meta = rest.join(' ');
  const match = meta.match(/(?:title|filename)=("([^"]*)"|'([^']*)'|(\S+))/);
  const filename = match ? match[2] ?? match[3] ?? match[4] : undefined;
  return { language: language || undefined, filename };
}

function markdownToPortableText(body: string): Block[] {
  const tokens = md.parse(body, {});
  const blocks: Block[] = [];
  const listStack: Array<'bullet' | 'number'> = [];
  let blockquoteDepth = 0;

  const makeTextBlock = (style: string, inline?: Token) => {
    const { children, markDefs } = inlineToSpans(inline);
    if (!children.length || children.every((s) => !s.text.trim())) return;
    const block: Block = {
      _type: 'block',
      _key: key(),
      style,
      markDefs,
      children,
    };
    if (listStack.length) {
      block.listItem = listStack[listStack.length - 1];
      block.level = listStack.length;
    }
    blocks.push(block);
  };

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    switch (t.type) {
      case 'heading_open': {
        const n = Math.min(Number(t.tag.slice(1)) || 1, 4);
        makeTextBlock(`h${n}`, tokens[i + 1]);
        break;
      }
      case 'paragraph_open':
        makeTextBlock(blockquoteDepth ? 'blockquote' : 'normal', tokens[i + 1]);
        break;
      case 'bullet_list_open':
        listStack.push('bullet');
        break;
      case 'ordered_list_open':
        listStack.push('number');
        break;
      case 'bullet_list_close':
      case 'ordered_list_close':
        listStack.pop();
        break;
      case 'blockquote_open':
        blockquoteDepth++;
        break;
      case 'blockquote_close':
        blockquoteDepth--;
        break;
      case 'fence':
      case 'code_block': {
        const { language, filename } = parseFence(t.info || '');
        const code = t.content.replace(/\n$/, '');
        const block: Block = { _type: 'code', _key: key(), code };
        if (language) block.language = language;
        if (filename) block.filename = filename;
        blocks.push(block);
        break;
      }
      case 'table_open':
        warn('dropped a table (Portable Text schema has no table type)');
        while (i < tokens.length && tokens[i].type !== 'table_close') i++;
        break;
      case 'hr':
        warn('dropped a horizontal rule (no matching block type)');
        break;
      default:
        break;
    }
  }

  return blocks;
}

/**
 * Turn a slug-style frontmatter value into a readable display name
 * ("clean-code" -> "Clean Code"). A value that already carries its own casing
 * or spaces (e.g. "Clean Code", "macOS", "iTerm2") is kept verbatim.
 */
function displayName(raw: string): string {
  const value = raw.trim();
  if (/[A-Z]/.test(value) || /\s/.test(value)) return value;
  return value
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Find a category/tag by slug, or create it. Returns its document _id. */
async function resolveRef(
  type: 'category' | 'tag',
  name: string
): Promise<string> {
  const slug = toSlug(name);
  const existing = await client.fetch<{ _id: string } | null>(
    '*[_type == $type && slug.current == $slug][0]{_id}',
    { type, slug }
  );
  if (existing?._id) {
    console.log(`  = ${type} "${name}" (reused)`);
    return existing._id;
  }
  const label = displayName(name);
  const created = await client.create({
    _type: type,
    name: label,
    slug: { _type: 'slug', current: slug },
  });
  console.log(`  + ${type} "${label}" (created)`);
  return created._id;
}

type FeaturedImage = {
  _type: 'image';
  asset: { _type: 'reference'; _ref: string };
  alt: string;
};

/**
 * Upload the local thumbnail as a Sanity image asset and return a `featuredImage`
 * value. Sanity dedupes assets by content hash, so re-importing the same file
 * reuses the existing asset instead of creating a duplicate. A missing file is a
 * warning, not a failure - the image is optional in the schema.
 */
async function uploadFeaturedImage(
  thumbnail: string,
  alt: string
): Promise<FeaturedImage | null> {
  const imgPath = isAbsolute(thumbnail)
    ? thumbnail
    : resolve(process.cwd(), thumbnail);
  let bytes: Buffer;
  try {
    bytes = readFileSync(imgPath);
  } catch {
    warn(`thumbnail not found, skipping featured image: ${thumbnail}`);
    return null;
  }
  const filename = basename(imgPath);
  const asset = await client.assets.upload('image', bytes, { filename });
  console.log(`  + featured image "${filename}" (uploaded)`);
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
    alt,
  };
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error(
      'Usage: bun run scripts/import-post.ts <path-to-markdown-file>'
    );
    process.exit(1);
  }

  let raw: string;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch {
    console.error(`Cannot read file: ${filePath}`);
    process.exit(1);
  }

  const { data, content } = matter(raw);
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const description =
    typeof data.description === 'string' ? data.description.trim() : '';
  const category =
    typeof data.category === 'string' ? data.category.trim() : '';
  const tags: string[] = Array.isArray(data.tags)
    ? data.tags.map((x) => String(x).trim()).filter(Boolean)
    : [];
  const thumbnail =
    typeof data.thumbnail === 'string' ? data.thumbnail.trim() : '';
  const imageAlt =
    typeof data.alt === 'string' && data.alt.trim() ? data.alt.trim() : title;

  const missing = [
    !title && 'title',
    !description && 'description',
    !category && 'category',
  ].filter(Boolean);
  if (missing.length) {
    console.error(
      `Frontmatter missing required field(s): ${missing.join(', ')}`
    );
    process.exit(1);
  }

  const slug = toSlug(title);

  console.log(`Importing "${title}" -> draft slug "${slug}"`);

  const portableText = markdownToPortableText(content);
  if (!portableText.length) {
    console.error('Converted content is empty - nothing to import.');
    process.exit(1);
  }

  console.log('Resolving references:');
  const categoryId = await resolveRef('category', category);
  const tagRefs = [];
  for (const tag of tags) {
    const id = await resolveRef('tag', tag);
    tagRefs.push({ _type: 'reference', _ref: id, _key: key() });
  }

  const featuredImage = thumbnail
    ? await uploadFeaturedImage(thumbnail, imageAlt)
    : null;

  const _id = `drafts.${slug}`;
  await client.createOrReplace({
    _id,
    _type: 'post',
    title,
    slug: { _type: 'slug', current: slug },
    description,
    ...(featuredImage ? { featuredImage } : {}),
    content: portableText,
    category: { _type: 'reference', _ref: categoryId },
    ...(tagRefs.length ? { tags: tagRefs } : {}),
    isPublished: false,
  });

  console.log(`\nDraft saved: ${_id}`);
  console.log(`Open in Studio: /studio/structure/post;${slug}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
