import type { PortableTextBlock } from '@portabletext/types';

/** Average adult reading speed for prose, in words per minute. */
export const WORDS_PER_MINUTE = 200;

/** Count words in the plain text carried by Portable Text block children. */
export function countWords(content: PortableTextBlock[] | null | undefined): number {
  if (!content?.length) return 0;

  let words = 0;
  for (const block of content) {
    if (block?._type !== 'block' || !Array.isArray(block.children)) continue;
    for (const child of block.children) {
      const text = typeof child?.text === 'string' ? child.text : '';
      const matches = text.trim().match(/\S+/g);
      if (matches) words += matches.length;
    }
  }
  return words;
}

/** Estimated reading time in whole minutes, never less than 1 for non-empty content. */
export function readingTimeMinutes(
  content: PortableTextBlock[] | null | undefined,
): number {
  const words = countWords(content);
  if (words === 0) return 0;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
