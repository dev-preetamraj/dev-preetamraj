import { cn } from '@/lib/utils';
import Link from 'next/link';
import { LINK } from './roles';
import { ReactNode } from 'react';
import { MetaRow } from './Meta';

export type PageHeaderProps = {
  /** Mono uppercase label above the title (section or category). */
  eyebrow?: ReactNode;
  /** Makes the eyebrow a link (e.g. a post's category). */
  eyebrowHref?: string;
  title: ReactNode;
  /** Mono metadata row under the title (date, views, counts, links). */
  meta?: ReactNode;
  /** Full lead paragraph - never clamped. */
  lead?: ReactNode;
  /** Extra rows under the lead (chips, actions, filters). */
  children?: ReactNode;
};

type Props = PageHeaderProps & {
  /** Hide the meta row from lg up, where the article aside shows it. */
  metaInAside?: boolean;
};

/**
 * The one page header: eyebrow, h1, mono meta, full lead. Its width is the
 * width of the column PageLayout puts it in (full main column on index
 * pages, the measure column on article pages) - never set here.
 */
const PageHeader = ({
  eyebrow,
  eyebrowHref,
  title,
  meta,
  lead,
  children,
  metaInAside = false,
}: Props) => (
  <header className='flex min-w-0 flex-col gap-4'>
    {eyebrow && (
      <div className='text-eyebrow text-muted-foreground'>
        {eyebrowHref ? (
          <Link href={eyebrowHref} className={LINK.content}>
            {eyebrow}
          </Link>
        ) : (
          eyebrow
        )}
      </div>
    )}
    <h1 className='text-h1 text-foreground'>{title}</h1>
    {meta && (
      <div className={cn(metaInAside && 'lg:hidden')}>
        <MetaRow>{meta}</MetaRow>
      </div>
    )}
    {lead && <p className='text-lead text-muted-foreground'>{lead}</p>}
    {children}
  </header>
);

export default PageHeader;
