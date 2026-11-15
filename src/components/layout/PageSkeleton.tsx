import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type Props = {
  /** `index` = header + list rows; `article` = header + prose lines. */
  variant?: 'index' | 'article';
};

/** Route loading state shaped like the PageLayout it stands in for. */
const PageSkeleton = ({ variant = 'index' }: Props) => (
  <div
    aria-busy
    aria-label='Loading'
    className={cn(
      'flex w-full flex-col gap-section-sm',
      variant === 'article' && 'max-w-measure'
    )}
  >
    <div className='flex flex-col gap-4'>
      <Skeleton className='h-3 w-24' />
      <Skeleton className='h-9 w-3/4' />
      <Skeleton className='h-5 w-full' />
    </div>
    <div className='flex flex-col gap-6'>
      {Array.from({ length: 4 }).map((_, index) => (
        <div className='flex flex-col gap-2' key={index}>
          <Skeleton className='h-5 w-2/3' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-1/3' />
        </div>
      ))}
    </div>
  </div>
);

export default PageSkeleton;
