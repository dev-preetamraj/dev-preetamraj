import { fetchCategories } from '@/actions/categories';
import CreateCategory from '@/components/forms/create-category-form';
import { currentUser } from '@clerk/nextjs/server';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Categories - Preetam Raj',
  description: 'A fullstack web developer',
};

const CategoriesPage = async () => {
  const user = await currentUser();
  const role = user?.privateMetadata.role;
  const categories = await fetchCategories();

  return (
    <div>
      {role == 'admin' && (
        <div className='mb-8 border border-border p-8 rounded-md'>
          <CreateCategory />
        </div>
      )}
      <div className='w-full flex flex-col space-y-4'>
        <h1 className='text-2xl'>Recent Categories</h1>
        <div className='flex flex-wrap items-center space-x-4'>
          {categories.data &&
            categories.data.map((categorie) => (
              <div key={categorie._id}>
                <Link
                  href={`/categories/${categorie.name}`}
                  className='text-lg text-primary hover:underline'
                >
                  {categorie.name}
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
