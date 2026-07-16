'use client';

import { useCallback } from 'react';

import { getApprovedComments } from '@/actions/sanity-comment';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import {
  COMMENTS_BATCH_SIZE,
  COMMENTS_SCROLL_TRIGGER_RATIO,
} from '@/lib/constants';
import { CommentDescendant, PostCommentThread } from '@/sanity/lib/queries';
import CommentNode from './comment-node';

type Props = {
  postId: string;
  initialComments: PostCommentThread[];
  totalCount: number;
};

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

/** Bucket a thread's flat descendants by their immediate parent for tree rendering. */
function groupByParent(
  descendants: CommentDescendant[],
): Map<string, CommentDescendant[]> {
  const map = new Map<string, CommentDescendant[]>();
  for (const descendant of descendants) {
    const bucket = map.get(descendant.parentId);
    if (bucket) bucket.push(descendant);
    else map.set(descendant.parentId, [descendant]);
  }
  return map;
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
  } = useInfiniteScroll<PostCommentThread>({
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
    <div ref={containerRef} className='space-y-8'>
      {comments.map((thread) => (
        <div key={thread._id} className='group/thread'>
          <CommentNode
            comment={{
              _id: thread._id,
              authorName: thread.authorName,
              content: thread.content,
              _createdAt: thread._createdAt,
              depth: 1,
            }}
            postId={postId}
            childrenByParent={groupByParent(thread.descendants)}
          />
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
