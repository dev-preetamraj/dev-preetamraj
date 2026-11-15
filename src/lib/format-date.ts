/**
 * The site's single date format: short, day-first, in IST
 * (e.g. "13 Jul 2026"). Used by every list, card and page header so a post
 * shows the same date everywhere.
 *
 * Returns '' for missing or unparseable input, so callers can render the
 * result directly without ever showing "Invalid Date".
 */
export const formatDate = (value?: string | number | Date | null): string => {
  if (value === undefined || value === null || value === '') return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/** Machine-readable form for `<time dateTime>`; '' when invalid. */
export const toISODate = (value?: string | number | Date | null): string => {
  if (value === undefined || value === null || value === '') return '';
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
};
