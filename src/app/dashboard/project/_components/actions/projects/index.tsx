import { fetchAllProjectsForDashboard } from '@/actions/portfolio';
import { DataTable } from '@/components/data-table';
import CreatePortfolioDialog from '@/components/portfolio/create-portfolio-dialog';
import { columns } from './columns';
import SearchProject from './search-project';

type Props = {
  keyword?: string;
};

const Projects = async ({ keyword }: Props) => {
  const { data: projects } = await fetchAllProjectsForDashboard(keyword);
  if (!projects) return null;
  return (
    <div className=''>
      <div className='h-16 bg-muted px-12 flex items-center justify-between'>
        <CreatePortfolioDialog />
        <SearchProject />
      </div>
      <div className='p-12'>
        <DataTable columns={columns} data={projects} />
      </div>
    </div>
  );
};

export default Projects;
