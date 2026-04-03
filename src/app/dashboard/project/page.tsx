import Link from 'next/link';

const Page = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] space-y-4'>
      <h1 className='text-2xl font-semibold'>Project Management</h1>
      <p className='text-muted-foreground'>
        Portfolio projects are now managed in Sanity Studio.
      </p>
      <Link
        href='/studio'
        className='px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90'
      >
        Open Sanity Studio
      </Link>
    </div>
  );
};

export default Page;
