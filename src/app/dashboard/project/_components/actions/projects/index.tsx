import { fetchAllProjectsForDashboard } from '@/actions/portfolio';
import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import ProjectsNav from './projects-nav';

type Props = {
  keyword?: string;
};

const Projects = async ({ keyword }: Props) => {
  const { data: projects } = await fetchAllProjectsForDashboard(keyword);
  if (!projects) return null;
  return (
    <div className=''>
      <ProjectsNav />
      <div className='p-4 lg:p-6'>
        <DataTable columns={columns} data={projects} />
      </div>
    </div>
  );
};

export default Projects;
