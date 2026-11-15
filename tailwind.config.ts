const defaultTheme = require('tailwindcss/defaultTheme');

/** Token-backed color: `hsl(var(--name) / <alpha-value>)`. */
const token = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

const plugin = require('tailwindcss/plugin');

/*
 * Semantic type scale - the single source for UI (text-*) and prose.
 * Use these instead of text-xs..text-6xl or text-[Npx]. One family (Geist)
 * for every role: hierarchy is size + weight only (400 body, 500 UI
 * labels, 600 headings h1-h4, 700 display; nothing below 400).
 *
 * Compact, calm scale sized for the 3-column layout (left nav, main,
 * right rail): the main column is narrow, so headings stay modest.
 * Three explicit screens on a 16px body (px):
 *            display  h1  h2  h3  h4  lead  article
 *   mobile      36    28  24  20  17   17     16    (<768)
 *   tablet      40    30  25  20  18   17     16    (768-1023)
 * Tablet sits close to mobile on purpose: from 768 the 300px left nav is
 * visible, so the main column (~470px at 820) is barely wider than a phone.
 *   desktop     48    36  28  22  18   18     17    (>=1024)
 * Line-height tightens as size grows; tracking
 * tightens with size (Geist is drawn for slight negative tracking at
 * display sizes). UI text (small/caption/micro/eyebrow) does not scale;
 * 12px is the floor. `article` and `code` feed the prose plugin only.
 *
 * Each role becomes CSS variables (--text-<role>-size/-lh/-weight/-track)
 * set per breakpoint below, so `text-h1` is responsive with no md:/lg:.
 */
type Step = [px: number, lineHeight: number];
type Role = {
  weight: number;
  track: string;
  mobile: Step;
  tablet: Step;
  desktop: Step;
};
const roles: Record<string, Role> = {
  display: {
    weight: 700,
    track: '-0.025em',
    mobile: [36, 1.1],
    tablet: [40, 1.1],
    desktop: [48, 1.08],
  },
  h1: {
    weight: 600,
    track: '-0.02em',
    mobile: [28, 1.2],
    tablet: [30, 1.2],
    desktop: [36, 1.15],
  },
  h2: {
    weight: 600,
    track: '-0.015em',
    mobile: [24, 1.25],
    tablet: [25, 1.24],
    desktop: [28, 1.22],
  },
  h3: {
    weight: 600,
    track: '-0.01em',
    mobile: [20, 1.3],
    tablet: [20, 1.3],
    desktop: [22, 1.3],
  },
  h4: {
    weight: 600,
    track: '-0.005em',
    mobile: [17, 1.4],
    tablet: [18, 1.4],
    desktop: [18, 1.4],
  },
  lead: {
    weight: 400,
    track: '0em',
    mobile: [17, 1.55],
    tablet: [17, 1.6],
    desktop: [18, 1.6],
  },
  body: {
    weight: 400,
    track: '0em',
    mobile: [16, 1.6],
    tablet: [16, 1.6],
    desktop: [16, 1.6],
  },
  small: {
    weight: 400,
    track: '0em',
    mobile: [14, 1.5],
    tablet: [14, 1.5],
    desktop: [14, 1.5],
  },
  caption: {
    weight: 400,
    track: '0.01em',
    mobile: [12, 1.4],
    tablet: [12, 1.4],
    desktop: [12, 1.4],
  },
  // compact chips/badges/kbd: caption size, tighter leading, medium weight
  micro: {
    weight: 500,
    track: '0.01em',
    mobile: [12, 1.25],
    tablet: [12, 1.25],
    desktop: [12, 1.25],
  },
  // mono uppercase section label (family + case in globals.css)
  eyebrow: {
    weight: 500,
    track: '0.08em',
    mobile: [12, 1.3],
    tablet: [12, 1.3],
    desktop: [12, 1.3],
  },
  // long-form article body (prose only): grows for reading distance
  article: {
    weight: 400,
    track: '0em',
    mobile: [16, 1.7],
    tablet: [16, 1.7],
    desktop: [17, 1.75],
  },
  // code blocks (prose only), Geist Mono
  code: {
    weight: 400,
    track: '0em',
    mobile: [13, 1.65],
    tablet: [14, 1.65],
    desktop: [14, 1.7],
  },
};
const PROSE_ONLY = new Set(['article', 'code']);

const rem = (px: number) => `${px / 16}rem`;
const roleVars = (screen: 'mobile' | 'tablet' | 'desktop') =>
  Object.fromEntries(
    Object.entries(roles).flatMap(([name, r]) => {
      const [px, lh] = r[screen];
      const vars: [string, string][] = [
        [`--text-${name}-size`, rem(px)],
        [`--text-${name}-lh`, String(lh)],
      ];
      if (screen === 'mobile') {
        vars.push([`--text-${name}-weight`, String(r.weight)]);
        vars.push([`--text-${name}-track`, r.track]);
      }
      return vars;
    })
  );

/** CSS properties for a role, reading the responsive variables. */
const roleStyle = (name: string) => ({
  fontSize: `var(--text-${name}-size)`,
  lineHeight: `var(--text-${name}-lh)`,
  fontWeight: `var(--text-${name}-weight)`,
  letterSpacing: `var(--text-${name}-track)`,
});

const typeScale = Object.fromEntries(
  Object.keys(roles)
    .filter((name) => !PROSE_ONLY.has(name))
    .map((name) => {
      const { fontSize, ...rest } = roleStyle(name);
      return [name, [fontSize, rest]];
    })
);

const proseRole = roleStyle;

/** Emits the per-screen type variables into the base layer. */
const typeScalePlugin = plugin(({ addBase }: any) => {
  addBase({
    ':root': roleVars('mobile'),
    '@media (min-width: 768px)': { ':root': roleVars('tablet') },
    '@media (min-width: 1024px)': { ':root': roleVars('desktop') },
  });
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: 'var(--space-gutter)',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // Bare `border`/`divide` would otherwise fall back to a light gray in dark mode.
      borderColor: { DEFAULT: token('border') },
      colors: {
        border: token('border'),
        input: token('input'),
        ring: token('ring'),
        background: token('background'),
        foreground: token('foreground'),
        primary: {
          DEFAULT: token('primary'),
          foreground: token('primary-foreground'),
        },
        secondary: {
          DEFAULT: token('secondary'),
          foreground: token('secondary-foreground'),
        },
        destructive: {
          DEFAULT: token('destructive'),
          foreground: token('destructive-foreground'),
        },
        muted: {
          DEFAULT: token('muted'),
          foreground: token('muted-foreground'),
        },
        accent: {
          DEFAULT: token('accent'),
          foreground: token('accent-foreground'),
        },
        popover: {
          DEFAULT: token('popover'),
          foreground: token('popover-foreground'),
        },
        card: {
          DEFAULT: token('card'),
          foreground: token('card-foreground'),
        },
        warning: {
          DEFAULT: token('warning'),
          foreground: token('warning-foreground'),
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
      },
      fontSize: typeScale,
      spacing: {
        gutter: 'var(--space-gutter)',
        section: 'var(--space-section)',
        'section-sm': 'var(--space-section-sm)',
        stack: 'var(--space-stack)',
      },
      maxWidth: {
        measure: '36em',
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        DEFAULT: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        overlay: 'var(--shadow-overlay)',
      },
      transitionDuration: {
        DEFAULT: 'var(--duration-fast)',
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        DEFAULT: 'var(--ease-standard)',
        standard: 'var(--ease-standard)',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'hsl(var(--foreground) / 0.9)',
            '--tw-prose-headings': 'hsl(var(--foreground))',
            '--tw-prose-lead': 'hsl(var(--muted-foreground))',
            '--tw-prose-links': 'hsl(var(--primary))',
            '--tw-prose-bold': 'hsl(var(--foreground))',
            '--tw-prose-counters': 'hsl(var(--muted-foreground))',
            '--tw-prose-bullets': 'hsl(var(--border))',
            '--tw-prose-hr': 'hsl(var(--border))',
            '--tw-prose-quotes': 'hsl(var(--foreground))',
            '--tw-prose-quote-borders': 'hsl(var(--border))',
            '--tw-prose-pre-bg': 'hsl(var(--code-block))',
            '--tw-prose-pre-code': 'hsl(var(--code-block-foreground))',
            '--tw-prose-captions': 'hsl(var(--muted-foreground))',
            '--tw-prose-code': 'hsl(var(--foreground))',
            '--tw-prose-th-borders': 'hsl(var(--border))',
            '--tw-prose-td-borders': 'hsl(var(--border))',
            '--tw-prose-invert-body': 'hsl(var(--foreground) / 0.9)',
            '--tw-prose-invert-headings': 'hsl(var(--foreground))',
            '--tw-prose-invert-lead': 'hsl(var(--muted-foreground))',
            '--tw-prose-invert-links': 'hsl(var(--primary))',
            '--tw-prose-invert-bold': 'hsl(var(--foreground))',
            '--tw-prose-invert-counters': 'hsl(var(--muted-foreground))',
            '--tw-prose-invert-bullets': 'hsl(var(--border))',
            '--tw-prose-invert-hr': 'hsl(var(--border))',
            '--tw-prose-invert-quotes': 'hsl(var(--foreground))',
            '--tw-prose-invert-quote-borders': 'hsl(var(--border))',
            '--tw-prose-invert-pre-bg': 'hsl(var(--code-block))',
            '--tw-prose-invert-pre-code': 'hsl(var(--code-block-foreground))',
            '--tw-prose-invert-captions': 'hsl(var(--muted-foreground))',
            '--tw-prose-invert-code': 'hsl(var(--foreground))',
            '--tw-prose-invert-th-borders': 'hsl(var(--border))',
            '--tw-prose-invert-td-borders': 'hsl(var(--border))',
            // Article sizes come from the same scale as the UI, not the
            // plugin's defaults (which jump to 36px h1 / 1.75 leading).
            ...proseRole('article'),
            maxWidth: '36em',
            p: { marginTop: '1.25em', marginBottom: '1.25em' },
            '[class~="lead"]': proseRole('lead'),
            h1: { ...proseRole('h1'), marginTop: '0', marginBottom: '0.75em' },
            h2: {
              ...proseRole('h2'),
              marginTop: '1.75em',
              marginBottom: '0.6em',
            },
            h3: {
              ...proseRole('h3'),
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
            h4: {
              ...proseRole('h4'),
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
            'h2 + *, h3 + *, h4 + *': { marginTop: '0' },
            small: proseRole('small'),
            figcaption: proseRole('caption'),
            code: { fontSize: '0.875em', fontWeight: '500' },
            pre: {
              ...proseRole('code'),
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius-md)',
            },
            blockquote: { fontStyle: 'normal', fontWeight: '400' },
            'pre code': { fontSize: 'inherit', fontWeight: 'inherit' },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
          },
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    typeScalePlugin,
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};
