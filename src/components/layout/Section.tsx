import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ICON, LINK } from './roles';

/*
 * Named heading variants:
 *  - `page`: a section of the main column. Same size and spacing as an
 *    article h2 (tailwind.config.ts prose h2), so pages and articles share
 *    one heading rhythm.
 *  - `rail`: a mono eyebrow label for the rail and the article aside.
 * Heading -> content uses the `heading` token; section -> section spacing
 * is owned by PageLayout (`section-sm`).
 */
const TITLE = {
  page: 'text-h2 text-foreground',
  rail: 'text-eyebrow text-muted-foreground',
} as const;

type Variant = keyof typeof TITLE;

type Props = {
  /** Section heading (an h2). Omit for an untitled block. */
  title?: ReactNode;
  /** Trailing link/action on the heading line. */
  action?: ReactNode;
  variant?: Variant;
  id?: string;
  /** Accessible name when there is no visible title. */
  label?: string;
  children: ReactNode;
};

const Section = ({
  title,
  action,
  variant = 'page',
  id,
  label,
  children,
}: Props) => (
  <section
    id={id}
    aria-label={title ? undefined : label}
    className={cn(
      'flex min-w-0 flex-col',
      variant === 'rail' ? 'gap-3' : 'gap-heading'
    )}
  >
    {title && <SectionTitle title={title} action={action} variant={variant} />}
    {children}
  </section>
);

/** Section heading line (h2 + optional trailing action). */
export const SectionTitle = ({
  title,
  action,
  variant = 'page',
}: Pick<Props, 'title' | 'action' | 'variant'>) => (
  <div className='flex items-baseline justify-between gap-4'>
    <h2 className={TITLE[variant]}>{title}</h2>
    {action}
  </div>
);

/** Action link (e.g. "All posts"): the action role plus an arrow. */
export const SectionLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <Link
    href={href}
    className={cn(
      'group inline-flex shrink-0 items-center gap-1 text-small',
      LINK.action
    )}
  >
    {children}
    <ArrowRight
      aria-hidden
      className={cn(
        ICON.meta,
        'transition-transform group-hover:translate-x-0.5'
      )}
    />
  </Link>
);

export default Section;
