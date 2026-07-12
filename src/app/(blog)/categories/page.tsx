import { Category, CATEGORIES_QUERY, sanityFetch } from '@/sanity/lib/queries';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'A fullstack web developer',
};

const CategoriesPage = async () => {
  const categories = await sanityFetch<Category[]>(CATEGORIES_QUERY);

  return (
    <div className='w-full flex flex-col space-y-4'>
      <h1 className='text-2xl'>Recent Categories</h1>
      <div className='flex flex-wrap items-center space-x-4'>
        {categories &&
          categories.map((categorie) => (
            <div key={categorie._id}>
              <Link
                href={`/categories/${categorie.slug}`}
                className='text-lg text-primary hover:underline'
              >
                {categorie.name}
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
