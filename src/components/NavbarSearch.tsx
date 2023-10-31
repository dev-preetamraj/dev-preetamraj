import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';

const NavbarSearch = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline' className='flex items-center space-x-20'>
            <span>Search</span>
            <div className='flex items-center space-x-2'>
              <AdjustmentsHorizontalIcon className='h-4 w-4' />
              <span>k</span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px] p-0'>
          <div className='flex items-center space-x-2 border-b border-primary p-4'>
            <MagnifyingGlassIcon className='h-6 w-6' />
            <input
              type='text'
              className='bg-transparent outline-none'
              placeholder='Search...'
            />
          </div>
          <div className='p-4 pt-0'>search results</div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NavbarSearch;
