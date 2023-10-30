'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FunctionComponent } from 'react';

type Props = {
  imgUrl: string;
  title: string;
  slug: string;
};

const PortfolioCard: FunctionComponent<Props> = ({ imgUrl, title, slug }) => {
  const router = useRouter();
  return (
    <div
      className='relative group hover:cursor-pointer h-60'
      onClick={() => router.push(`/portfolio/${slug}`)}
    >
      <Image
        className='h-60 w-full object-cover'
        width={1080}
        height={1080}
        src={imgUrl}
        alt='Image'
      />
      <div className='z-20 bg-black/40 group-hover:bg-black/70 absolute top-0 h-60 w-full flex items-center justify-center p-4 text-center'>
        <h1 className='hidden group-hover:block z-20 text-white text-4xl font-bold tracking-wide'>
          {title}
        </h1>
      </div>
    </div>
  );
};

export default PortfolioCard;
