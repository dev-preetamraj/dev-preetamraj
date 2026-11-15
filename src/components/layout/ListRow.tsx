import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ElementType, ReactNode } from 'react';
import { MetaRow } from './Meta';
import { FOCUS, LINK } from './roles';

type Variant = 'default' | 'compact';

/** List wrapper: hairline between rows, no outer borders. */
export const RowList = ({
  as: Tag = 'ul',
  variant = 'default',
  children,
}: {
  as?: 'ul' | 'ol';
  variant?: Variant;
  children: ReactNode;
}) => (
  <Tag
    className={cn(
      'flex min-w-0 flex-col',
      variant === 'default' && 'divide-y divide-border'
    )}
  >
    {children}
  </Tag>
);

type Props = {
  href: string;
  title: ReactNode;
  /** Heading level of the title (default rows only). */
  titleAs?: ElementType;
  description?: ReactNode;
  /** Mono meta row under the description (default rows). */
  meta?: ReactNode;
  /** Trailing element on the title line (compact rows, e.g. view count). */
  trailing?: ReactNode;
  external?: boolean;
  /**
   * `default` = post list row: h4 title, 2-line summary, meta row.
   * `compact` = rail/aside link: small muted title (2 lines) + trailing meta.
   */
  variant?: Variant;
};

/**
 * The one list row (post lists, Most Read, project links). The title link's
 * ::after covers the whole row, so the full row is clickable while chips in
 * the meta row stay separately focusable above it.
 */
const ListRow = ({
  href,
  title,
  titleAs: Title = 'h3',
  description,
  meta,
  trailing,
  external,
  variant = 'default',
}: Props) => {
  const linkProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  if (variant === 'compact') {
    return (
      <li className='group'>
        <Link
          href={href}
          {...linkProps}
          className={cn('flex items-start gap-3 py-2', FOCUS)}
        >
          <span
            className={cn(
              'line-clamp-2 flex-1 text-small text-foreground',
              LINK.contentGroup
            )}
          >
            {title}
          </span>
          {trailing && (
            <span className='shrink-0'>
              <MetaRow compact>{trailing}</MetaRow>
            </span>
          )}
        </Link>
      </li>
    );
  }

  return (
    <li className='group relative flex min-w-0 flex-col gap-2 py-5 first:pt-0 last:pb-0'>
      <Title className={cn('text-h4 text-foreground', LINK.contentGroup)}>
        <Link
          href={href}
          {...linkProps}
          className='after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-md focus-visible:after:ring-2 focus-visible:after:ring-ring'
        >
          {title}
        </Link>
      </Title>
      {description && (
        <p className='line-clamp-2 text-small text-muted-foreground'>
          {description}
        </p>
      )}
      {meta && <MetaRow>{meta}</MetaRow>}
    </li>
  );
};

export default ListRow;
