import { getPortfolioById } from '@/actions/portfolio';
import PortfolioBuilder from '@/components/portfolio/portfolio-builder';
type Props = {
  params: {
    portfolioId: string;
  };
};
const PortfolioCreatePage = async ({ params: { portfolioId } }: Props) => {
  const portfolioResponse = await getPortfolioById(portfolioId);
  return (
    <div>
      <PortfolioBuilder portfolio={portfolioResponse.data} />
    </div>
  );
};

export default PortfolioCreatePage;
