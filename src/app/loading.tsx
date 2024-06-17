import Image from 'next/image';

const Loading = () => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <Image
        alt='Loading...'
        src='/logo.svg'
        height={100}
        width={100}
        className='animate-pulse'
      />
    </div>
  );
};

export default Loading;
