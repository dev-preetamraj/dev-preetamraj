import { getBlogById } from '@/actions/blog';
import { fetchCategories } from '@/actions/categories';
import BlogBuilder from '@/components/builder/blog-builder';
import { redirect } from 'next/navigation';

type Props = {
  params: {
    blogId: string;
  };
};

const CreateBlogPage = async ({ params: { blogId } }: Props) => {
  const blogResponse = await getBlogById(blogId);
  if (!blogResponse.success) return redirect('/blog');
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
