import { fetchAllProjectsForDashboard } from '@/actions/portfolio';
import { DataTable } from '@/components/data-table';
import CreatePortfolioDialog from '@/components/portfolio/create-portfolio-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { columns } from './columns';

const Projects = async () => {
  const { data: projects } = await fetchAllProjectsForDashboard();
  if (!projects) return null;
  return (
    <div className=''>
      <div className='py-4 px-12 flex items-center justify-between'>
        <CreatePortfolioDialog />
        <div className='flex items-center space-x-4'>
          <Input />
          <Button variant='outline' className='w-48'>
            Search Projects
          </Button>
        </div>
      </div>
      <div className='p-12'>
        <DataTable columns={columns} data={projects} />
      </div>
    </div>
  );
};

export default Projects;
