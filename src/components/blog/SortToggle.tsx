import { cn } from '@/lib/utils';
import { Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export type SortKey = 'latest' | 'top';

type Props = {
  active: SortKey;
};

const OPTIONS = [
  { key: 'latest', label: 'Latest', href: '/blog', icon: Clock },
  {
    key: 'top',
    label: 'Top ranking',
    href: '/blog?sort=top',
    icon: TrendingUp,
  },
] as const;

/** Latest / Top ranking switch on /blog: a segmented link control. */
const SortToggle = ({ active }: Props) => (
  <nav
    aria-label='Sort posts'
    className='inline-flex w-fit items-center gap-1 rounded-lg border border-border bg-muted/40 p-1'
  >
    {OPTIONS.map(({ key, label, href, icon: Icon }) => {
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
          <Icon aria-hidden className='h-4 w-4' />
          {label}
        </Link>
      );
    })}
  </nav>
);

export default SortToggle;
