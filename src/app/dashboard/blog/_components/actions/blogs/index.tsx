import { fetchAllBlogsForDashboard } from '@/actions/blog';
import { DataTable } from '@/components/data-table';
import BlogNav from './blog-nav';
import { columns } from './columns';

type Props = {
  keyword?: string;
};

const Blogs = async ({ keyword }: Props) => {
  const { data: blog } = await fetchAllBlogsForDashboard(keyword);
  if (!blog) return null;
  return (
    <div className=''>
      <BlogNav />
      <div className='p-4 lg:p-6'>
        <DataTable columns={columns} data={blog} />
      </div>
    </div>
  );
};

export default Blogs;
