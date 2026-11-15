import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ComponentType } from 'react';

export type SegmentedOption = {
  key: string;
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
};

type Props = {
  options: readonly SegmentedOption[];
  active: string;
  label: string;
};

/** Segmented link control (e.g. Latest / Top ranking on /blog). */
const SegmentedLinks = ({ options, active, label }: Props) => (
  <nav
    aria-label={label}
    className='inline-flex w-fit items-center gap-1 rounded-lg border border-border bg-muted/40 p-1'
  >
    {options.map(({ key, label: text, href, icon: Icon }) => {
      const isActive = key === active;
      return (
        <Link
          key={key}
          href={href}
          scroll={false}
          aria-current={isActive ? 'page' : undefined}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-small font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            isActive
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {Icon && <Icon aria-hidden className='h-4 w-4' />}
          {text}
        </Link>
      );
    })}
  </nav>
);

export default SegmentedLinks;
