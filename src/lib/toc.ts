/**
 * Table of contents for long-form Portable Text (blog posts, projects).
 *
 * Pure: the article page builds the TOC from the same blocks the renderer
 * uses, and the renderer looks heading ids up by block `_key`, so the anchor
 * ids and the TOC links always agree.
 */

export type TocLevel = 2 | 3;

export type TocItem = {
  /** Portable Text block key; the renderer uses it to find the id. */
  key: string;
  /** Anchor id put on the heading element. */
  id: string;
  text: string;
  level: TocLevel;
};

type SpanLike = { text?: unknown };
type BlockLike = {
  _type?: unknown;
  _key?: unknown;
  style?: unknown;
  children?: unknown;
};

// h1 in content is rendered as h2 (the page owns the only h1), so it is a
// top-level TOC entry too.
const LEVELS: Record<string, TocLevel> = { h1: 2, h2: 2, h3: 3 };

/** URL-safe anchor slug: lowercase ascii words joined by '-'. */
export const slugifyHeading = (text: string): string => {
  const slug = text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'section';
};

const blockText = (children: unknown): string =>
  Array.isArray(children)
    ? children
        .map((child: SpanLike) =>
          typeof child?.text === 'string' ? child.text : ''
        )
        .join('')
        .trim()
    : '';

/** h2/h3 headings in document order with unique, stable anchor ids. */
export const buildToc = (blocks: readonly unknown[] | null | undefined) => {
  const items: TocItem[] = [];
  const used = new Map<string, number>();

  (blocks ?? []).forEach((raw, index) => {
    const block = raw as BlockLike;
    if (block?._type !== 'block' || typeof block.style !== 'string') return;
    const level = LEVELS[block.style];
    if (!level) return;
    const text = blockText(block.children);
    if (!text) return;

    const base = slugifyHeading(text);
    const seen = used.get(base) ?? 0;
    used.set(base, seen + 1);
    const id = seen === 0 ? base : `${base}-${seen + 1}`;
    const key = typeof block._key === 'string' ? block._key : `h-${index}`;
    items.push({ key, id, text, level });
  });

  return items;
};

/** Block key -> anchor id, for the heading renderer. */
export const tocIdsByKey = (items: readonly TocItem[]) =>
  new Map(items.map((item) => [item.key, item.id]));
