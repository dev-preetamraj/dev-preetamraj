import { PostCommentThread } from '@/sanity/lib/queries';
import CommentForm from '../forms/comment-form';
import CommentsList from './comments-list';

type Props = {
  postId: string;
  comments: PostCommentThread[];
  commentsCount: number;
};

const RenderComments = ({ postId, comments = [], commentsCount }: Props) => {
  return (
    <div className='pb-section-sm space-y-4'>
      <div className='space-y-4'>
        <h2 className='text-h3 text-foreground'>Leave a comment</h2>
        <p className='text-body text-muted-foreground'>
          All fields are required. Your comment appears after approval.
        </p>
      </div>

      <CommentForm postId={postId} />

      <div className='py-section'>
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
