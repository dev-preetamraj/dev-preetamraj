import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import Sidebar from './_components/sidebar';

type Props = { children: ReactNode };

const DashboardLayout = async ({ children }: Props) => {
  const user = await currentUser();
  if (!user) return redirect('/');

  const role = user.privateMetadata.role;
  if (role !== 'admin') return redirect('/');
  return (
    <div className='grid h-screen overflow-hidden w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
      <Sidebar />
      <main className='flex flex-1 flex-col gap-4 lg:gap-6 overflow-auto'>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
