import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ComponentType, ReactNode } from 'react';
import { ICON, LINK } from './roles';

type IconType = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;

/*
 * Two chip variants, chosen by meaning:
 *  - `meta`: compact inline badge (card labels, skills, a row's category).
 *    Passive unless given an href.
 *  - `nav`:  an item in a navigable collection (tag index, topics, home
 *    topics). Bigger hit area, sans label, separated count, always a link.
 */
const VARIANT = {
  meta: 'gap-1 rounded-xs px-2 py-0.5 font-mono text-micro',
  nav: 'gap-2 rounded-md px-2.5 py-1 text-small',
} as const;

type Props = {
  variant?: keyof typeof VARIANT;
  /** Makes the chip a link (taxonomy role). Required for `nav`. */
  href?: string;
  /** Trailing count (nav chips), set apart from the label. */
  count?: number;
  /** `strong` = foreground text, for labels like "Featured". */
  tone?: 'default' | 'strong';
  icon?: IconType;
  children: ReactNode;
};

const Chip = ({
  variant = 'meta',
  href,
  count,
  tone = 'default',
  icon: Icon,
  children,
}: Props) => {
  const className = cn(
    'inline-flex w-fit items-center border border-border bg-muted',
    VARIANT[variant],
    tone === 'strong' ? 'text-foreground' : 'text-muted-foreground',
    href && cn('relative z-10', LINK.taxonomy)
  );
  const content = (
    <>
      {Icon && <Icon className={ICON.chip} aria-hidden />}
      <span>{children}</span>
      {count !== undefined && (
        <span className='border-l border-border pl-2 font-mono text-micro text-muted-foreground'>
          {count}
        </span>
      )}
    </>
  );

  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <span className={className}>{content}</span>
  );
};

export default Chip;
