import Link from 'next/link';

const Rightbar = () => {
  return (
    <div className='w-full md:w-[380px] lg:w-[600px] xl:w-72 2xl:w-96 h-full'>
      <div className='flex flex-col space-y-10'>
        <div className='border-l pl-4 py-4 flex flex-col space-y-4'>
          <h1 className='text-lg text-foreground'>Recently Updated</h1>
          <div className='flex flex-col space-y-2'>
            <p className='truncate text-sm'>What is WebRTC</p>
            <p className='truncate text-sm'>
              Lorem ips quibusdam optio animi quid um dolor, sit amet
              consectetur adipisicing elit. Rem doloremem. Molestias
              perspiciatis quod impedit dolorem natus!
            </p>
            <p className='truncate text-sm'>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem
              dolorem quibusdam optio animi quidem. Molestias perspiciatis quod
              impedit dolorem natus!
            </p>
            <p className='truncate text-sm'>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem
              dolorem quibusdam optio animi quidem. Molestias perspiciatis quod
              impedit dolorem natus!
            </p>
          </div>
        </div>

        <div className='border-l pl-4 py-4 flex flex-col space-y-4'>
          <h1 className='text-lg text-foreground'>Trending Tags</h1>
          <div className='flex flex-wrap gap-2'>
            <Link
              href='/tags/python'
              className='px-4 py-1 rounded-full border text-sm'
            >
              Python
            </Link>
            <Link
              href='/tags/python'
              className='px-4 py-1 rounded-full border text-sm'
            >
              Python
            </Link>
            <Link
              href='/tags/react-js'
              className='px-4 py-1 rounded-full border text-sm'
            >
              ReactJS
            </Link>
            <Link
              href='/tags/next-js'
              className='px-4 py-1 rounded-full border text-sm'
            >
              NextJS
            </Link>
            <Link
              href='/tags/drf'
              className='px-4 py-1 rounded-full border text-sm'
            >
              Django Rest Framework
            </Link>
            <Link
              href='/tags/django'
              className='px-4 py-1 rounded-full border text-sm'
            >
              Django
            </Link>
            <Link
              href='/tags/aws'
              className='px-4 py-1 rounded-full border text-sm'
            >
              AWS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
