import { PostComment } from '@/sanity/lib/queries';
import CommentForm from '../forms/comment-form';
import CommentsList from './comments-list';

type Props = {
  postId: string;
  comments: PostComment[];
  commentsCount: number;
};

const RenderComments = ({ postId, comments = [], commentsCount }: Props) => {
  return (
    <div className='pb-12 space-y-4'>
      <div className='space-y-4'>
        <h1 className='text-4xl font-semibold'>Leave a comment</h1>
        <p className='text-foreground/75'>
          All fields are required. Your comment appears after approval.
        </p>
      </div>

      <CommentForm postId={postId} />

      <div className='py-20'>
        <CommentsList
          postId={postId}
          initialComments={comments}
          totalCount={commentsCount}
        />
      </div>
    </div>
  );
};

export default RenderComments;
