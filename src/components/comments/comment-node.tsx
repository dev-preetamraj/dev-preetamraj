'use client';

import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

import CommentForm from '@/components/forms/comment-form';
import { Stack } from '@/components/layout/Stack';
import Text from '@/components/layout/Text';
import { Button } from '@/components/ui/button';
import { MAX_COMMENT_DEPTH } from '@/lib/constants';
import { CommentDescendant, PostComment } from '@/sanity/lib/queries';

type Props = {
  comment: PostComment & { depth: number };
  postId: string;
  childrenByParent: Map<string, CommentDescendant[]>;
};

function initials(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}

/**
 * A comment and, recursively, its replies. Threads stay visually connected: a
 * "trunk" line drops from each avatar and every reply hooks into its parent's
 * trunk with an elbow. Geometry (34px avatar, 12px gap) is verified in the
 * elbow offsets below — keep them in sync if the avatar size changes.
 */
const CommentNode = ({ comment, postId, childrenByParent }: Props) => {
  const [replying, setReplying] = useState(false);
  const children = childrenByParent.get(comment._id) ?? [];
  // Depth is capped server-side; this also guards against runaway recursion.
  const hasReplies = comment.depth < MAX_COMMENT_DEPTH && children.length > 0;
  const isReply = comment.depth > 1;

  return (
    <div
      className={
        'relative grid grid-cols-[34px_1fr] gap-x-3' +
        (isReply ? ' thread-elbow' : '')
      }
    >
      <div className='flex flex-col items-center gap-1.5'>
        <span className='relative z-[1] flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-muted text-micro'>
          {initials(comment.authorName)}
        </span>
        {hasReplies && <div className='thread-trunk' />}
      </div>

      <Stack gap='md'>
        <Stack gap='xs'>
          <div className='flex items-baseline gap-2'>
            <Text tone='default' weight='semibold'>
              {comment.authorName}
            </Text>
            <Text as='span' variant='meta'>
              {formatDistanceToNow(new Date(comment._createdAt), {
                addSuffix: true,
              })}
            </Text>
          </div>
          <Text tone='default'>{comment.content}</Text>
          {!replying && (
            <div>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='-ml-3'
                onClick={() => setReplying(true)}
              >
                Reply
              </Button>
            </div>
          )}
        </Stack>

        {replying && (
          <CommentForm
            postId={postId}
            parentId={comment._id}
            onSuccess={() => setReplying(false)}
          />
        )}

        {hasReplies &&
          children.map((child) => (
            <CommentNode
              key={child._id}
              comment={child}
              postId={postId}
              childrenByParent={childrenByParent}
            />
          ))}
      </Stack>
    </div>
  );
};

export default CommentNode;
