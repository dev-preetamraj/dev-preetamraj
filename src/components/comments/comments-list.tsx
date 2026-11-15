'use client';

import { useCallback } from 'react';

import { getApprovedComments } from '@/actions/sanity-comment';
import Text from '@/components/layout/Text';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { COMMENTS_BATCH_SIZE } from '@/lib/constants';
import { PostCommentThread } from '@/sanity/lib/queries';
import CommentNode from './comment-node';

type Props = {
  postId: string;
  initialComments: PostCommentThread[];
  totalCount: number;
};

/** Group descendants by parent id (Map.groupBy needs newer runtimes). */
function groupByParent(items: PostCommentThread['descendants']) {
  const map = new Map<string, PostCommentThread['descendants']>();
  for (const item of items) {
    const group = map.get(item.parentId);
    if (group) group.push(item);
    else map.set(item.parentId, [item]);
  }
  return map;
}

/** Skeleton placeholder shown while the next batch of comments loads. */
function CommentSkeleton() {
  return (
    <div className='flex gap-4'>
      <Skeleton className='h-10 w-10 shrink-0 rounded-full' />
      <div className='flex w-full flex-col gap-2'>
        <div className='flex items-center gap-2'>
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
    async (start: number, end: number) => {
      const result = await getApprovedComments(postId, start, end);
      if (!result.ok) throw new Error(result.error);
      return result.comments;
    },
    [postId]
  );

  const {
    items: comments,
    isLoading,
    error,
    retry,
    remaining,
  } = useInfiniteScroll<PostCommentThread>({
    initialItems: initialComments,
    totalCount,
    batchSize: COMMENTS_BATCH_SIZE,
    getKey: (comment) => comment._id,
    fetchPage,
  });

  if (comments.length === 0 && totalCount === 0) {
    return <Text>No comments yet. Be the first to comment.</Text>;
  }

  return (
    <div className='flex flex-col gap-8'>
      {comments.map((thread) => (
        <div key={thread._id} className='group/thread'>
          <CommentNode
            comment={{ ...thread, depth: 1 }}
            postId={postId}
            childrenByParent={groupByParent(thread.descendants)}
          />
        </div>
      ))}

      {error && (
        <div className='flex items-center gap-3' role='alert'>
          <Text variant='small'>
            Unable to load comments. Please try again.
          </Text>
          <Button type='button' variant='outline' size='sm' onClick={retry}>
            Retry
          </Button>
        </div>
      )}

      {isLoading &&
        Array.from({ length: Math.min(COMMENTS_BATCH_SIZE, remaining) }).map(
          (_, i) => <CommentSkeleton key={`skeleton-${i}`} />
        )}
    </div>
  );
};

export default CommentsList;
