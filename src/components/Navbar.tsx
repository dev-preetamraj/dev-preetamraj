'use client';
import { clickMenuButton } from '@/features/slices/navbarSlice';
import { AppDispatch, RootState } from '@/features/store';
import { Cross2Icon, TextAlignJustifyIcon } from '@radix-ui/react-icons';
import { useDispatch, useSelector } from 'react-redux';
import NavbarSearch from './NavbarSearch';

const Navbar = () => {
  const clicked = useSelector((state: RootState) => state.navbar.clicked);
  const dispatch: AppDispatch = useDispatch();
  return (
    <div className='border-b border-muted px-2 sm:px-4 md:px-10 py-2 md:py-4 sticky top-0 backdrop-blur-md flex items-center justify-between'>
      <h1 className='hidden md:block'>Home</h1>
      {!clicked ? (
        <TextAlignJustifyIcon
          className='block md:hidden h-6 w-6 cursor-pointer'
          onClick={() => dispatch(clickMenuButton(true))}
        />
      ) : null}
      {clicked ? (
        <Cross2Icon
          className='block md:hidden h-6 w-6 cursor-pointer'
          onClick={() => dispatch(clickMenuButton(false))}
        />
      ) : null}
      <NavbarSearch />
    </div>
  );
};

export default Navbar;
