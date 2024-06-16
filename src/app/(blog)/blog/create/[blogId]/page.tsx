import { getBlogById } from '@/actions/blog';
import { fetchCategories } from '@/actions/categories';
import BlogBuilder from '@/components/builder/blog-builder';

type Props = {
  params: {
    blogId: string;
  };
};

const CreateBlogPage = async ({ params: { blogId } }: Props) => {
  const blogResponse = await getBlogById(blogId);
  const categoryResponse = await fetchCategories();

  return (
    <div>
      <BlogBuilder
        blog={blogResponse.data}
        categories={categoryResponse.data}
      />
    </div>
  );
};

export default CreateBlogPage;
