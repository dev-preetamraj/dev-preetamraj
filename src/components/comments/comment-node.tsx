'use client';

import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

import CommentForm from '@/components/forms/comment-form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MAX_COMMENT_DEPTH } from '@/lib/constants';
import { CommentDescendant } from '@/sanity/lib/queries';

type CommentNodeData = {
  _id: string;
  authorName: string;
  content: string;
  _createdAt: string;
  depth: number;
};

type Props = {
  comment: CommentNodeData;
  postId: string;
  childrenByParent: Map<string, CommentDescendant[]>;
};

function formatDateToNow(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}

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
        (isReply
          ? " before:absolute before:left-[-29px] before:top-[17px] before:h-0.5 before:w-[29px] before:rounded-full before:bg-border before:content-[''] group-hover/thread:before:bg-primary/40"
          : '')
      }
    >
      <div className='flex flex-col items-center'>
        <Avatar className='relative z-[1] h-[34px] w-[34px]'>
          <AvatarFallback className='text-[0.8rem] font-semibold'>
            {initials(comment.authorName)}
          </AvatarFallback>
        </Avatar>
        {hasReplies && (
          <div className='mt-1.5 w-0.5 flex-1 rounded-full bg-border transition-colors group-hover/thread:bg-primary/40' />
        )}
      </div>

      <div className='min-w-0 pb-1'>
        <div className='flex items-baseline gap-2'>
          <p className='text-[0.95rem] font-semibold tracking-tight'>
            {comment.authorName}
          </p>
          <span className='font-mono text-xs text-muted-foreground'>
            {formatDateToNow(comment._createdAt)}
          </span>
        </div>
        <p className='mt-0.5 text-[0.95rem] leading-relaxed text-foreground/90'>
          {comment.content}
        </p>

        {replying ? (
          <div className='mt-3'>
            <CommentForm
              postId={postId}
              parentId={comment._id}
              compact
              onSuccess={() => setReplying(false)}
            />
          </div>
        ) : (
          <button
            type='button'
            onClick={() => setReplying(true)}
            className='mt-1 rounded text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          >
            Reply
          </button>
        )}

        {hasReplies && (
          <div className='mt-4 flex flex-col gap-4'>
            {children.map((child) => (
              <CommentNode
                key={child._id}
                comment={child}
                postId={postId}
                childrenByParent={childrenByParent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentNode;
