import { getBlogById } from '@/actions/blog';
import { fetchCategories } from '@/actions/categories';
import Wrapper from './wrapper';

type Props = {
  _id: string;
};

const EditBlog = async ({ _id }: Props) => {
  const { data: blog } = await getBlogById(_id);
  const { data: categories } = await fetchCategories();

  if (!blog) return null;
  return <Wrapper blog={blog} categories={categories} />;
};

export default EditBlog;
