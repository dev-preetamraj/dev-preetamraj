import { buildLegacyTheme } from 'sanity';

const props = {
  white: '#d1d5db',
  black: 'hsl(20 14.3% 4.1%)',
  brand: 'hsl(142.1 70.6% 45.3%)',
  red: 'hsl(0 62.8% 30.6%)',
  yellow: '#f4b400',
};

export const sanityTheme = buildLegacyTheme({
  '--black': props['black'],
  '--white': props['white'],
  '--gray': '#9ca3af',
  '--gray-base': '#9ca3af',
  '--component-bg': props['black'],
  '--component-text-color': '#9ca3af',
  '--brand-primary': props['brand'],
  '--default-button-color': props['brand'],
  '--default-button-danger-color': props['red'],
  '--default-button-success-color': props['brand'],
  '--default-button-warning-color': props['yellow'],
  '--state-danger-color': props['red'],
  '--state-info-color': '#0284c7',
  '--state-success-color': props['brand'],
  '--state-warning-color': props['yellow'],
});
