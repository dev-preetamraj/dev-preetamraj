'use client';

import { formatDistanceToNow } from 'date-fns';
import { useCallback } from 'react';

import { getApprovedComments } from '@/actions/sanity-comment';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import {
  COMMENTS_BATCH_SIZE,
  COMMENTS_SCROLL_TRIGGER_RATIO,
} from '@/lib/constants';
import { PostComment } from '@/sanity/lib/queries';

type Props = {
  postId: string;
  initialComments: PostComment[];
  totalCount: number;
};

function formatDateToNow(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}

function initials(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}

/** Skeleton placeholder shown while the next batch of comments loads. */
function CommentSkeleton() {
  return (
    <div className='flex space-x-4'>
      <Skeleton className='h-10 w-10 shrink-0 rounded-full' />
      <div className='w-full space-y-2'>
        <div className='flex items-center space-x-2'>
          <Skeleton className='h-5 w-32' />
          <Skeleton className='h-4 w-20' />
        </div>
        <Skeleton className='h-4 w-3/4' />
      </div>
    </div>
  );
}

const CommentsList = ({ postId, initialComments, totalCount }: Props) => {
  const fetchPage = useCallback(
    (start: number, end: number) => getApprovedComments(postId, start, end),
    [postId],
  );

  const {
    items: comments,
    isLoading,
    remaining,
    containerRef,
  } = useInfiniteScroll<PostComment>({
    initialItems: initialComments,
    totalCount,
    batchSize: COMMENTS_BATCH_SIZE,
    getKey: (comment) => comment._id,
    fetchPage,
    triggerRatio: COMMENTS_SCROLL_TRIGGER_RATIO,
  });

  if (comments.length === 0) {
    return (
      <p className='text-foreground/60'>
        No comments yet. Be the first to comment.
      </p>
    );
  }

  return (
    <div ref={containerRef} className='space-y-6'>
      {comments.map((comment) => (
        <div key={comment._id} className='flex space-x-4'>
          <Avatar>
            <AvatarFallback>{initials(comment.authorName)}</AvatarFallback>
          </Avatar>
          <div className='w-full'>
            <div className='flex items-center space-x-2'>
              <p className='text-lg font-semibold'>{comment.authorName}</p>
              <span className='text-sm text-foreground/75'>
                {formatDateToNow(comment._createdAt)}
              </span>
            </div>
            <p className='text-foreground/75'>{comment.content}</p>
          </div>
        </div>
      ))}

      {isLoading &&
        Array.from({ length: Math.min(COMMENTS_BATCH_SIZE, remaining) }).map(
          (_, i) => <CommentSkeleton key={`skeleton-${i}`} />,
        )}
    </div>
  );
};

export default CommentsList;
