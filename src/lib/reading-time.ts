import type { PortableTextBlock } from '@portabletext/types';

// This estimates time to READ AND UNDERSTAND a technical post, not to skim it.
// Rates are deliberately below typical "reading speed" widgets (skim ~250 wpm):
// the reader is following an argument and working through code, not scanning.

/** Attentive reading speed for technical prose, in words per minute. */
export const WORDS_PER_MINUTE = 160;

/**
 * Seconds spent per non-blank line of code — reading it AND understanding what
 * it does, which is far slower than prose. Per-line is a steadier proxy than
 * per-word (a lone `}` and a dense one-liner both count as one line) and tracks
 * a snippet's complexity better than its character count.
 */
export const SECONDS_PER_CODE_LINE = 8;

/** Seconds to parse and absorb a figure/diagram. */
export const SECONDS_PER_IMAGE = 15;

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

/** Count non-blank lines across every `code` block in the content. */
export function countCodeLines(content: PortableTextBlock[] | null | undefined): number {
  if (!content?.length) return 0;

  let lines = 0;
  for (const block of content) {
    if (block?._type !== 'code') continue;
    const code = typeof (block as { code?: unknown }).code === 'string'
      ? ((block as { code: string }).code)
      : '';
    for (const line of code.split('\n')) {
      if (line.trim()) lines += 1;
    }
  }
  return lines;
}

/** Count top-level image blocks in the content. */
export function countImages(content: PortableTextBlock[] | null | undefined): number {
  if (!content?.length) return 0;
  return content.reduce((n, block) => (block?._type === 'image' ? n + 1 : n), 0);
}

/**
 * Estimated time in whole minutes to read and understand the content, blending
 * attentive prose reading, code comprehension, and figure dwell time.
 * Returns 0 for empty content, otherwise never less than 1.
 */
export function readingTimeMinutes(
  content: PortableTextBlock[] | null | undefined,
): number {
  const words = countWords(content);
  const codeLines = countCodeLines(content);
  const images = countImages(content);

  const seconds =
    (words / WORDS_PER_MINUTE) * 60 +
    codeLines * SECONDS_PER_CODE_LINE +
    images * SECONDS_PER_IMAGE;

  if (seconds === 0) return 0;
  return Math.max(1, Math.round(seconds / 60));
}
