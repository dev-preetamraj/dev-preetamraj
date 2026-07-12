import { cn } from '@/lib/utils';
import { ArrowTrendingUpIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export type SortKey = 'latest' | 'top';

type Props = {
  active: SortKey;
};

const OPTIONS = [
  { key: 'latest', label: 'Latest', href: '/blog', Icon: ClockIcon },
  {
    key: 'top',
    label: 'Top ranking',
    href: '/blog?sort=top',
    Icon: ArrowTrendingUpIcon,
  },
] as const;

const SortToggle = ({ active }: Props) => (
  <div className='inline-flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1'>
    {OPTIONS.map(({ key, label, href, Icon }) => {
      const isActive = key === active;
      return (
        <Link
          key={key}
          href={href}
          scroll={false}
          aria-current={isActive ? 'true' : undefined}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            isActive
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon className='h-4 w-4' />
          {label}
        </Link>
      );
    })}
  </div>
);

export default SortToggle;
