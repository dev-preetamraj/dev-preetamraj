import { fetchTags } from '@/actions/tags';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tags - Preetam Raj',
  description: 'A fullstack web developer',
};

const TagsPage = async () => {
  const tags = await fetchTags();

  return (
    <div className='w-full flex flex-col space-y-4'>
      <h1 className='text-2xl'>Recent Tags</h1>
      <div className='flex flex-wrap items-center space-x-4'>
        {tags &&
          tags.map((tag) => (
            <div key={tag._id}>
              <Link
                href={`/tags/${tag.slug?.current}`}
                className='text-lg text-primary hover:underline'
              >
                #{tag.name}
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TagsPage;
