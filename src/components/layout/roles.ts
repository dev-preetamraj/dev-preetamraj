/*
 * Named interaction roles and icon sizes shared by every primitive, so the
 * same kind of link looks and behaves the same whichever component renders
 * it. Pick a role by what the link IS, never by where it sits.
 */

/** Visible keyboard focus, identical for every interactive element. */
export const FOCUS =
  'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export const LINK = {
  /**
   * Content destination (post/project/page title): keeps its text colour
   * at rest, turns primary on hover. Inside a card/row the whole surface
   * is the hit area, so the hover is driven by the `group`.
   */
  content: `transition-colors hover:text-primary ${FOCUS}`,
  /** Same role when the hover comes from a parent `group` (cards, rows). */
  contentGroup: 'transition-colors group-hover:text-primary',
  /** Taxonomy (category/tag chips): border + text strengthen on hover. */
  taxonomy:
    'transition-colors hover:border-input hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  /** Action / secondary navigation ("All posts", GitHub, Live): primary, underline on hover. */
  action: `text-primary underline-offset-4 transition-colors hover:underline ${FOCUS}`,
  /** Inline prose link (article body): primary, always underlined. */
  prose:
    'prose-a:text-primary prose-a:underline-offset-4 prose-a:decoration-primary/40 prose-a:transition-colors prose-a:hover:decoration-primary',
} as const;

/** Icon sizes by slot. */
export const ICON = {
  /** Inside mono meta rows and compact rows (views, date, read time). */
  meta: 'h-3.5 w-3.5 shrink-0',
  /** Inside buttons and action links. */
  action: 'h-4 w-4 shrink-0',
  /** Inside a card's icon tile. */
  tile: 'h-[18px] w-[18px] shrink-0',
  /** Inside a chip. */
  chip: 'h-3 w-3 shrink-0',
} as const;
