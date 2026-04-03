import { fetchCategories } from '@/actions/categories';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Categories - Preetam Raj',
  description: 'A fullstack web developer',
};

const CategoriesPage = async () => {
  const categories = await fetchCategories();

  return (
    <div className='w-full flex flex-col space-y-4'>
      <h1 className='text-2xl'>Recent Categories</h1>
      <div className='flex flex-wrap items-center space-x-4'>
        {categories &&
          categories.map((category) => (
            <div key={category._id}>
              <Link
                href={`/categories/${category.slug?.current}`}
                className='text-lg text-primary hover:underline'
              >
                {category.name}
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
