import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  classGroups: {
    'font-size': [
      {
        text: [
          'display',
          'h1',
          'h2',
          'h3',
          'h4',
          'lead',
          'body',
          'small',
          'caption',
          'micro',
          'eyebrow',
        ],
      },
    ],
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Wall clock for server components that rank content (ranking takes it as
 * `nowMs`). Read through a function so render stays lint-pure
 * (react-hooks/purity rejects a bare Date.now() in render).
 */
export const currentTimeMs = () => Date.now();

/** "1 post", "3 posts"; pass the plural for irregular words. */
export const plural = (n: number, word: string, words = `${word}s`) =>
  `${n} ${n === 1 ? word : words}`;

export const slugToTitle = (slug: string) => {
  const words = slug.split('-');

  const title = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return title;
};

/**
 * Format a count into a compact Indian-system string, e.g. 4000 -> "4K",
 * 1_000_000 -> "10L", 200_000_000 -> "20Cr". Falls back to "0" for
 * missing/invalid values.
 */
const compactIndianFormatter = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export const formatViews = (value?: number | null) => {
  return compactIndianFormatter.format(value ?? 0);
};

export const capitalizeWord = (word: string) => {
  if (word.length === 0) {
    return word;
  }

  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

export const createURL = (array: string[], index: number) => {
  if (index < 1 || index >= array.length) {
    return '/';
  }

  const subarray = array.slice(0, index + 1);
  subarray.shift();

  const url = '/' + subarray.join('/');

  return url;
};
