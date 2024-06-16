import { fetchTags } from '@/actions/tags';
import CreateTag from '@/components/forms/create-tag-form';
import { currentUser } from '@clerk/nextjs/server';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tags - Preetam Raj',
  description: 'A fullstack web developer',
};

const TagsPage = async () => {
  const user = await currentUser();
  const role = user?.privateMetadata.role;
  const tags = await fetchTags();

  return (
    <div>
      {role == 'admin' && (
        <div className='mb-8 border border-border p-8 rounded-md'>
          <CreateTag />
        </div>
      )}
      <div className='w-full flex flex-col space-y-4'>
        <h1 className='text-2xl'>Recent Tags</h1>
        <div className='flex flex-wrap items-center space-x-4'>
          {tags.data &&
            tags.data.map((tag) => (
              <div key={tag._id}>
                <Link
                  href={`/tags/${tag.name}`}
                  className='text-lg text-primary hover:underline'
                >
                  #{tag.name}
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TagsPage;
