'use client';
import MobileSidebar from '@/app/dashboard/_components/mobile-sidebar';
import CreatePortfolioDialog from '@/components/portfolio/create-portfolio-dialog';
import { Input } from '@/components/ui/input';
import { UserButton } from '@clerk/nextjs';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ProjectsNav = () => {
  const router = useRouter();
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!value) router.replace('/dashboard/project');

    if (value) {
      setTimeout(() => {
        router.replace(`/dashboard/project?keyword=${value}`);
      }, 100);
    }
  }, [value, router]);

  return (
    <header className='flex h-14 items-center gap-4 border-b border-border bg-muted/40 px-4 lg:h-[60px] lg:px-6'>
      <MobileSidebar />
      <div className='w-full flex-1'>
        <form>
          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search blogs...'
              className='w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3'
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </form>
      </div>
      <div className='flex items-center gap-4'>
        <CreatePortfolioDialog />
        <UserButton />
      </div>
    </header>
  );
};

export default ProjectsNav;
