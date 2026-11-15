import BlogList from '@/components/blog/BlogList';
import { PostListItem } from '@/sanity/lib/queries';
import { FC } from 'react';

type Props = {
  blogs: PostListItem[];
};

/** Home "Latest": the same post rows as /blog, titles as h3 under the Section. */
const LatestPostsList: FC<Props> = ({ blogs }) => (
  <BlogList blogs={blogs} titleAs='h3' />
);

export default LatestPostsList;
