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
    className='group flex flex-col gap-3 rounded-2xl border border-border/70 bg-gradient-to-b from-card to-muted/20 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/[0.06]'
  >
    <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary/15'>
      <FolderIcon className='h-[18px] w-[18px]' />
    </span>
    <div className='space-y-0.5'>
      <p className='truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary'>
        {category.name}
      </p>
      <p className='text-xs text-muted-foreground'>
        {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
      </p>
    </div>
  </Link>
);

export default CategoryCard;
