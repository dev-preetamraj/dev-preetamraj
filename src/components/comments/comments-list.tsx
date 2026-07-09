'use client';

import { formatDistanceToNow } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getApprovedComments } from '@/actions/sanity-comment';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
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
  const [comments, setComments] = useState<PostComment[]>(initialComments);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // Guards against firing multiple loads for the same scroll gesture.
  const loadingRef = useRef(false);

  const hasMore = comments.length < totalCount;

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsLoading(true);

    const start = comments.length;
    const next = await getApprovedComments(
      postId,
      start,
      start + COMMENTS_BATCH_SIZE,
    );

    setComments((prev) => {
      const seen = new Set(prev.map((c) => c._id));
      const fresh = next.filter((c) => !seen.has(c._id));
      return fresh.length ? [...prev, ...fresh] : prev;
    });

    setIsLoading(false);
    loadingRef.current = false;
  }, [comments.length, postId]);

  useEffect(() => {
    if (!hasMore) return;

    // The page scrolls inside a Radix ScrollArea viewport, not the window —
    // find it, falling back to the window if the layout ever changes.
    const scroller: HTMLElement | Window =
      containerRef.current?.closest<HTMLElement>(
        '[data-radix-scroll-area-viewport]',
      ) ?? window;

    const isReached = () => {
      if (scroller instanceof Window) {
        const scrolled = window.scrollY + window.innerHeight;
        const total = document.documentElement.scrollHeight;
        return scrolled >= total * COMMENTS_SCROLL_TRIGGER_RATIO;
      }
      const scrolled = scroller.scrollTop + scroller.clientHeight;
      return scrolled >= scroller.scrollHeight * COMMENTS_SCROLL_TRIGGER_RATIO;
    };

    const onScroll = () => {
      if (loadingRef.current) return;
      if (isReached()) loadMore();
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    // In case the list is already short enough to be past the threshold.
    onScroll();
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [hasMore, loadMore]);

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
        Array.from({ length: Math.min(COMMENTS_BATCH_SIZE, totalCount - comments.length) }).map(
          (_, i) => <CommentSkeleton key={`skeleton-${i}`} />,
        )}
    </div>
  );
};

export default CommentsList;
