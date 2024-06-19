import { ScrollArea } from '@/components/ui/scroll-area';
import { currentUser } from '@clerk/nextjs/server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import Sidebar from './_components/sidebar';

export const metadata: Metadata = {
  title: 'Dashboard - Preetam Raj',
  description: 'A fullstack web developer',
};

type Props = { children: ReactNode };

const DashboardLayout = async ({ children }: Props) => {
  const user = await currentUser();
  if (!user) return redirect('/');

  const role = user.privateMetadata.role;
  if (role !== 'admin') return redirect('/');
  return (
    <div className='flex min-w-[1080px]'>
      <Sidebar />
      <ScrollArea className='w-full h-screen overflow-y-auto'>
        {children}
      </ScrollArea>
    </div>
  );
};

export default DashboardLayout;
