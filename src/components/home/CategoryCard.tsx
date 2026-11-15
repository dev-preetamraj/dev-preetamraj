import { CategoryStat } from '@/sanity/lib/queries';
import { FolderIcon } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  category: CategoryStat;
};

const CategoryCard: FC<Props> = ({ category }) => (
  <Link
    href={`/categories/${category.slug}`}
    className='group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-base hover:-translate-y-1 hover:border-input hover:shadow-md'
  >
    <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground'>
      <FolderIcon className='h-[18px] w-[18px]' />
    </span>
    <div className='space-y-0.5'>
      <p className='truncate text-small font-medium text-foreground transition-colors group-hover:text-primary'>
        {category.name}
      </p>
      <p className='text-caption text-muted-foreground'>
        {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
      </p>
    </div>
  </Link>
);

export default CategoryCard;
