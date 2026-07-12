import {
  CategoryListItem,
  CATEGORIES_QUERY,
  sanityFetch,
} from '@/sanity/lib/queries';
import { ArrowUpRight, FolderIcon } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Categories',
  description:
    'Browse posts by category - backend systems, APIs, cloud, and everything in between.',
};

const CategoriesPage = async () => {
  const categories = await sanityFetch<CategoryListItem[]>(CATEGORIES_QUERY);

  return (
    <div className='flex w-full flex-col space-y-8'>
      <section className='flex flex-col space-y-5'>
        <p className='text-sm font-medium uppercase tracking-wide text-primary'>
          The Blog
        </p>
        <h1 className='text-2xl font-bold leading-tight text-foreground md:text-3xl'>
          Browse by category
        </h1>
        <p className='max-w-2xl text-muted-foreground'>
          Every topic I write about, grouped in one place. Pick a category to
          see the posts inside it.
        </p>
      </section>

      {categories?.length ? (
        <>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-muted-foreground'>
              {categories.length}{' '}
              {categories.length === 1 ? 'category' : 'categories'}
            </span>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug}`}
                className='group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-card to-muted/20 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/[0.06]'
              >
                <div className='flex items-center gap-3'>
                  <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary/15'>
                    <FolderIcon className='h-5 w-5' />
                  </span>
                  <div className='min-w-0'>
                    <p className='truncate text-base font-semibold text-foreground transition-colors group-hover:text-primary'>
                      {category.name}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {category.postCount}{' '}
                      {category.postCount === 1 ? 'post' : 'posts'}
                    </p>
                  </div>
                  <ArrowUpRight className='ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary' />
                </div>
                {category.description && (
                  <p className='line-clamp-2 text-sm leading-6 text-muted-foreground'>
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </>
      ) : (
        <p className='text-muted-foreground'>
          No categories yet - check back soon.
        </p>
      )}
    </div>
  );
};

export default CategoriesPage;
