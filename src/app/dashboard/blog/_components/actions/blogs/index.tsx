import { fetchAllBlogsForDashboard } from '@/actions/blog';
import CreateBlogDialog from '@/components/blog/create-blog-dialog';
import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import SearchBlog from './search-blog';

type Props = {
  keyword?: string;
};

const Blogs = async ({ keyword }: Props) => {
  const { data: blog } = await fetchAllBlogsForDashboard(keyword);
  if (!blog) return null;
  return (
    <div className=''>
      <div className='h-16 bg-muted px-12 flex items-center justify-between'>
        <CreateBlogDialog />
        <SearchBlog />
      </div>
      <div className='p-12'>
        <DataTable columns={columns} data={blog} />
      </div>
    </div>
  );
};

export default Blogs;
