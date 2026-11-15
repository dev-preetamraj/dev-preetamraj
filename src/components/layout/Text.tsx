import { cn } from '@/lib/utils';
import { ElementType, ReactNode } from 'react';

/*
 * Text: the only way routes and domain components set type size and colour.
 * Variants map 1:1 onto the semantic type scale in tailwind.config.ts and
 * tones onto the semantic colour tokens in globals.css.
 */

const VARIANT = {
  body: 'text-body',
  small: 'text-small',
  caption: 'text-caption',
  /** Mono metadata (dates, counts, handles). */
  meta: 'font-mono text-caption',
  /** Mono value at reading size (e.g. an email address). */
  code: 'font-mono text-small',
} as const;

const TONE = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  destructive: 'text-destructive',
} as const;

const WEIGHT = {
  normal: '',
  medium: 'font-medium',
  semibold: 'font-semibold',
} as const;

type Props = {
  as?: ElementType;
  variant?: keyof typeof VARIANT;
  tone?: keyof typeof TONE;
  weight?: keyof typeof WEIGHT;
  /** Break long unspaced values (emails, URLs) instead of overflowing. */
  breakAll?: boolean;
  children: ReactNode;
};

const Text = ({
  as: Tag = 'p',
  variant = 'body',
  tone = 'muted',
  weight = 'normal',
  breakAll = false,
  children,
}: Props) => (
  <Tag
    className={cn(
      VARIANT[variant],
      TONE[tone],
      WEIGHT[weight],
      breakAll && 'break-all'
    )}
  >
    {children}
  </Tag>
);

/** Inline emphasis inside muted copy: foreground colour, medium weight. */
export const Strong = ({ children }: { children: ReactNode }) => (
  <span className='font-medium text-foreground'>{children}</span>
);

export default Text;
