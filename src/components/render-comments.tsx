'use client';

import { IBlog } from '@/models/blog';
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CommentForm from './forms/comment-form';
import { Button } from './ui/button';

type Props = {
  userId?: string;
  blog: Partial<IBlog>;
  portfolioId?: string;
};

function formatDateToNow(dateString: Date): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

const RenderComments = ({ userId, blog, portfolioId }: Props) => {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div className='pb-12 space-y-4'>
      <div className='space-y-4'>
        <h1 className='text-4xl font-semibold'>Leave a comment</h1>
        <SignedIn>
          <p>
            Logged in as <span className='text-primary'>{user?.fullName}</span>
          </p>
        </SignedIn>
        <SignedOut>
          <Link
            href={{
              pathname: '/auth/login',
              query: {
                redirect: pathname,
              },
            }}
          >
            <Button variant='link' className='px-0 text-xl mt-2'>
              Login to comment
            </Button>
          </Link>
        </SignedOut>
      </div>
      <CommentForm
        userId={userId}
        blogId={blog?._id}
        portfolioId={portfolioId}
      />

      <div className='py-20 space-y-6'>
        {blog.comments?.map((comment) => {
          if (comment.isApproved) {
            return (
              <div key={comment._id} className='flex items-center space-x-4'>
                <Image
                  alt={comment.author.name ?? 'Image'}
                  src={comment.author.imageUrl ?? '/logo.png'}
                  height={50}
                  width={50}
                  className='w-12 h-12 rounded-full'
                />
                <div>
                  <div className='flex items-center space-x-2'>
                    <p className='text-lg font-semibold'>
                      {comment.author.name}
                    </p>
                    <span className='text-sm text-foreground/75'>
                      {formatDateToNow(comment.createdAt)}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            );
          }

          if (!comment.isApproved && comment.author.userId === userId) {
            return (
              <div
                key={comment._id}
                className='flex items-center space-x-4 relative p-4 rounded-lg'
              >
                <div className='top-0 left-0 w-full h-full absolute z-10 bg-black/50 rounded-lg' />
                <p className='absolute top-4 right-4 z-20'>Pending</p>
                <Image
                  alt={comment.author.name ?? 'Image'}
                  src={comment.author.imageUrl ?? '/logo.png'}
                  height={50}
                  width={50}
                  className='w-12 h-12 rounded-full'
                />
                <div>
                  <div className='flex items-center space-x-2'>
                    <p className='text-lg font-semibold'>
                      {comment.author.name}
                    </p>
                    <span className='text-sm text-foreground/75'>
                      {formatDateToNow(comment.createdAt)}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default RenderComments;
