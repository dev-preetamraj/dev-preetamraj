'use client';
import { clickMenuButton } from '@/features/slices/navbarSlice';
import { AppDispatch, RootState } from '@/features/store';
import { Cross2Icon, TextAlignJustifyIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from './Breadcrumb';
import NavbarSearch from './NavbarSearch';

const Navbar = () => {
  const clicked = useSelector((state: RootState) => state.navbar.clicked);
  const dispatch: AppDispatch = useDispatch();
  return (
    <div className='border-b border-muted px-4 sm:px-8 md:px-10 py-2 md:py-4 sticky z-50 top-0 backdrop-blur-md flex items-center justify-between'>
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
      <Link
        href='/'
        className='hidden md:block lg:hidden text-primary underline underline-offset-2'
      >
        Home
      </Link>
      <Breadcrumb />
      <NavbarSearch />
    </div>
  );
};

export default Navbar;
