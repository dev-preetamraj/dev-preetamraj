import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Preetam Raj',
  description: 'A fullstack web developer',
};

const DashboardPage = () => {
  return (
    <div>
      <div className='h-16 px-12 bg-muted flex items-center justify-between'>
        <h1 className='text-lg font-semibold'>Dashboard</h1>
        <div className='flex items-center space-x-4'>
          <Input
            className='bg-background border border-primary'
            placeholder='Search something...'
          />
          <Button className='w-40'>Search</Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
