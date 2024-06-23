import CreateCategoryDialog from '@/components/create-category-dialog';
import { Input } from '@/components/ui/input';
import { UserButton } from '@clerk/nextjs';
import { Search } from 'lucide-react';
import MobileSidebar from '../../_components/mobile-sidebar';

const CategoryNav = () => {
  return (
    <header className='flex h-14 items-center gap-4 border-b border-border bg-muted/40 px-4 lg:h-[60px] lg:px-6'>
      <MobileSidebar />
      <div className='w-full flex-1'>
        <form>
          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search something...'
              className='w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3'
            />
          </div>
        </form>
      </div>
      <div className='flex items-center gap-4'>
        <CreateCategoryDialog />
        <UserButton />
      </div>
    </header>
  );
};

export default CategoryNav;
