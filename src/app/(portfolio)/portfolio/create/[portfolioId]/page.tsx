import { fetchCategories } from '@/actions/categories';
import { getPortfolioById } from '@/actions/portfolio';
import PortfolioBuilder from '@/components/portfolio/portfolio-builder';
import { redirect } from 'next/navigation';
type Props = {
  params: {
    portfolioId: string;
  };
};
const PortfolioCreatePage = async ({ params: { portfolioId } }: Props) => {
  const portfolioResponse = await getPortfolioById(portfolioId);
  if (!portfolioResponse.success) return redirect('/portfolio');

  const categoriesResponse = await fetchCategories();
  return (
    <div>
      <PortfolioBuilder
        portfolio={portfolioResponse.data}
        categories={categoriesResponse.data}
      />
    </div>
  );
};

export default PortfolioCreatePage;
