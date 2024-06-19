import { fetchCategories } from '@/actions/categories';
import { getPortfolioById } from '@/actions/portfolio';
import Wrapper from './wrapper';

type Props = {
  _id: string;
};

const EditProject = async ({ _id }: Props) => {
  const { data: project } = await getPortfolioById(_id);
  const { data: categories } = await fetchCategories();

  if (!project) return null;
  return <Wrapper project={project} categories={categories} />;
};

export default EditProject;
