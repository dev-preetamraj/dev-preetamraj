'use client';

import { IComment } from '@/models/comment';
import ReplyForm from './forms/reply-form';

type Props = {
  comments: IComment[] | undefined;
  blogId?: string;
  portfolioId?: string;
};

const RenderRecursiveComments = ({ comments, blogId, portfolioId }: Props) => {
  return (
    <div>
      {comments?.map((comment) => (
        <div key={comment._id} className='space-y-2'>
          <div>
            <p>{comment.author?.name}</p>
            <p>{comment.content}</p>
          </div>
          <ReplyForm
            author={comment.author._id}
            parentComment={comment._id}
            blogId={blogId}
          />
          <div className='ml-8'>
            {comment.replies?.length > 0 && (
              <RenderRecursiveComments
                comments={comment.replies}
                blogId={blogId}
                portfolioId={portfolioId}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderRecursiveComments;
