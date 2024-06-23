import { Metadata } from 'next';
import DashboardNav from './_components/dashboard-nav';

export const metadata: Metadata = {
  title: 'Dashboard - Preetam Raj',
  description: 'A fullstack web developer',
};

const DashboardPage = () => {
  return (
    <div>
      <DashboardNav />
      <div className='p-4 lg:p-6'>Dashboard</div>
    </div>
  );
};

export default DashboardPage;
