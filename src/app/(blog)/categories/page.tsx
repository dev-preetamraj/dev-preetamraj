import { getCategories } from '@/server-actions/category';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Categories - Preetam Raj',
  description: 'A fullstack web developer',
};

const CategoriesPage = async () => {
  const categories = await getCategories();

  return (
    <div className='w-full flex flex-col space-y-4'>
      <h1 className='text-2xl'>Recent Categories</h1>
      <div className='flex flex-wrap items-center space-x-4'>
        {categories.data &&
          categories.data.map((categorie) => (
            <div key={categorie.id}>
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
