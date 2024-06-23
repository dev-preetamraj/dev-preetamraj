'use client';

import { IBlog } from '@/models/blog';
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CommentForm from '../forms/comment-form';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import CommentsActionMenu from './comments-action-menu';

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
              <div key={comment._id} className='flex space-x-4'>
                <Image
                  alt={comment.author.name ?? 'Image'}
                  src={comment.author.imageUrl ?? '/logo.png'}
                  height={50}
                  width={50}
                  className='w-10 h-10 rounded-full'
                />
                <div className='w-full'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <p className='text-lg font-semibold'>
                        {comment.author.name}
                      </p>
                      <span className='text-sm text-foreground/75'>
                        {formatDateToNow(comment.createdAt)}
                      </span>
                    </div>
                    <SignedIn>
                      {comment.author.userId === userId && (
                        <div className='flex items-center space-x-4'>
                          <CommentsActionMenu
                            commentId={comment._id}
                            userId={comment.author.userId}
                          />
                        </div>
                      )}
                    </SignedIn>
                  </div>
                  <p className='text-foreground/75'>{comment.content}</p>
                </div>
              </div>
            );
          } else if (!comment.isApproved && comment.author.userId === userId) {
            return (
              <div key={comment._id} className='flex space-x-4'>
                <Image
                  alt={comment.author.name ?? 'Image'}
                  src={comment.author.imageUrl ?? '/logo.png'}
                  height={50}
                  width={50}
                  className='w-10 h-10 rounded-full'
                />
                <div className='w-full'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <p className='text-lg font-semibold'>
                        {comment.author.name}
                      </p>
                      <span className='text-sm text-foreground/75'>
                        {formatDateToNow(comment.createdAt)}
                      </span>
                    </div>
                    <div className='flex items-center space-x-4'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertTriangle className='h-4 w-4 text-yellow-600 cursor-pointer' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Pending for approval</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <CommentsActionMenu
                        commentId={comment._id}
                        userId={comment.author.userId}
                      />
                    </div>
                  </div>
                  <p className='text-foreground/75'>{comment.content}</p>
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
