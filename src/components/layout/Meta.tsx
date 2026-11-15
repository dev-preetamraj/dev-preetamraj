import { formatViews } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { EyeIcon } from 'lucide-react';
import Link from 'next/link';
import { ComponentType, ReactNode } from 'react';
import { ICON, LINK } from './roles';

type IconType = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;

/**
 * The one mono metadata row (date, views, read time, counts, links).
 * `compact` is the rail/aside density: micro text, same icons.
 */
export const MetaRow = ({
  compact = false,
  children,
}: {
  compact?: boolean;
  children: ReactNode;
}) => (
  <div
    className={cn(
      'flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-muted-foreground',
      compact ? 'text-micro' : 'text-caption'
    )}
  >
    {children}
  </div>
);

type ItemProps = {
  icon?: IconType;
  /** Tooltip / accessible hint, e.g. "Views". */
  title?: string;
  children: ReactNode;
};

/** An external link inside a MetaRow (GitHub, live site): the action role. */
export const MetaLink = ({
  href,
  icon: Icon,
  children,
}: ItemProps & { href: string }) => (
  <Link
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    className={cn('inline-flex items-center gap-1', LINK.action)}
  >
    {Icon && <Icon className={ICON.meta} aria-hidden />}
    {children}
  </Link>
);

export const MetaItem = ({ icon: Icon, title, children }: ItemProps) => (
  <span className='inline-flex items-center gap-1' title={title}>
    {Icon && <Icon className={ICON.meta} aria-hidden />}
    {children}
  </span>
);

/**
 * The one view count: eye icon + number, with "views" spelled out for
 * screen readers everywhere and visibly only where there is room
 * (`label`, e.g. the article details).
 */
export const ViewCount = ({
  views,
  label = false,
}: {
  views?: number | null;
  label?: boolean;
}) => (
  <MetaItem icon={EyeIcon} title='Views'>
    {formatViews(views)}
    <span className={label ? undefined : 'sr-only'}> views</span>
  </MetaItem>
);
