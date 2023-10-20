import { Input } from './ui/input';

const NavbarSearch = () => {
  return (
    <Input
      type='text'
      placeholder='Search...'
      className='hidden lg:block max-w-[250px]'
    />
  );
};

export default NavbarSearch;
