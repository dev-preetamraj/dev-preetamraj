import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';
import { Input } from './ui/input';

const NavbarSearch = () => {
  return (
    <>
      <Input
        type='text'
        placeholder='Search...'
        className='hidden lg:block w-[250px]'
      />
      <Button variant='ghost' className='lg:hidden'>
        <MagnifyingGlassIcon className='h-6 w-6' />
      </Button>
    </>
  );
};

export default NavbarSearch;
