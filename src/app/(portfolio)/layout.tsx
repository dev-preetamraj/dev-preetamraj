import SiteShell from '@/components/layout/SiteShell';
import '@/styles/globals.css';

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
