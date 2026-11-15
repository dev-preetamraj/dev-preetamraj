import { RowList } from '@/components/layout/ListRow';
import { PostListItem } from '@/sanity/lib/queries';
import { FC } from 'react';
import BlogCard from './BlogCard';

type Props = {
  blogs: PostListItem[] | null;
  titleAs?: 'h2' | 'h3';
};

const BlogList: FC<Props> = ({ blogs, titleAs }) => (
  <RowList>
    {(blogs ?? []).map((blog) => (
      <BlogCard key={blog._id} blog={blog} titleAs={titleAs} />
    ))}
  </RowList>
);

export default BlogList;
