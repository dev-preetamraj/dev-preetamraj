import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

export const slugToTitle = (slug: string) => {
  const words = slug.split('-');

  const title = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return title;
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
