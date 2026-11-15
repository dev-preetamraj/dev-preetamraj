import Section from '@/components/layout/Section';
import { Stack } from '@/components/layout/Stack';
import Text from '@/components/layout/Text';
import { PostCommentThread } from '@/sanity/lib/queries';
import CommentForm from '../forms/comment-form';
import CommentsList from './comments-list';

type Props = {
  postId: string;
  comments: PostCommentThread[];
  commentsCount: number;
};

const RenderComments = ({ postId, comments = [], commentsCount }: Props) => (
  <Section title='Leave a comment' id='comments'>
    <Stack gap='section'>
      <Stack gap='stack'>
        <Text>
          All fields are required. Your comment appears after approval.
        </Text>
        <CommentForm postId={postId} />
      </Stack>
      <CommentsList
        postId={postId}
        initialComments={comments}
        totalCount={commentsCount}
      />
    </Stack>
  </Section>
);

export default RenderComments;
