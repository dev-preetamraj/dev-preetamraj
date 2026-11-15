import { cn } from '@/lib/utils';
import { ElementType, ReactNode } from 'react';

/*
 * Text: the only way routes and domain components set type size and colour.
 * Variants map 1:1 onto the semantic type scale in tailwind.config.ts and
 * tones onto the semantic colour tokens in globals.css.
 */

const VARIANT = {
  lead: 'text-lead',
  body: 'text-body',
  small: 'text-small',
  caption: 'text-caption',
  micro: 'text-micro',
  eyebrow: 'text-eyebrow',
  /** Mono metadata (dates, counts, handles). */
  meta: 'font-mono text-caption',
  /** Mono value at reading size (e.g. an email address). */
  code: 'font-mono text-small',
} as const;

const TONE = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  primary: 'text-primary',
  destructive: 'text-destructive',
  inherit: '',
} as const;

const WEIGHT = {
  normal: '',
  medium: 'font-medium',
  semibold: 'font-semibold',
} as const;

export type TextVariant = keyof typeof VARIANT;
export type TextTone = keyof typeof TONE;

type Props = {
  as?: ElementType;
  variant?: TextVariant;
  tone?: TextTone;
  weight?: keyof typeof WEIGHT;
  /** Break long unspaced values (emails, URLs) instead of overflowing. */
  breakAll?: boolean;
  id?: string;
  children: ReactNode;
};

export const textClass = (
  variant: TextVariant = 'body',
  tone: TextTone = 'muted',
  weight: keyof typeof WEIGHT = 'normal'
) => cn(VARIANT[variant], TONE[tone], WEIGHT[weight]);

const Text = ({
  as: Tag = 'p',
  variant = 'body',
  tone = 'muted',
  weight = 'normal',
  breakAll = false,
  id,
  children,
}: Props) => (
  <Tag
    id={id}
    className={cn(textClass(variant, tone, weight), breakAll && 'break-all')}
  >
    {children}
  </Tag>
);

/** Inline emphasis inside muted copy: foreground colour, medium weight. */
export const Strong = ({ children }: { children: ReactNode }) => (
  <span className='font-medium text-foreground'>{children}</span>
);

export default Text;
