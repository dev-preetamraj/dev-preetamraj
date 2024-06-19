import { fetchAllBlogsForDashboard } from '@/actions/blog';
import CreateBlogDialog from '@/components/blog/create-blog-dialog';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { columns } from './columns';

const Blogs = async () => {
  const { data: blog } = await fetchAllBlogsForDashboard();
  if (!blog) return null;
  return (
    <div className=''>
      <div className='h-16 bg-muted px-12 flex items-center justify-between'>
        <CreateBlogDialog />
        <div className='flex items-center space-x-4'>
          <Input
            className='bg-background border border-primary'
            placeholder='Search something...'
          />
          <Button className='w-48'>Search Blogs</Button>
        </div>
      </div>
      <div className='p-12'>
        <DataTable columns={columns} data={blog} />
      </div>
    </div>
  );
};

export default Blogs;
