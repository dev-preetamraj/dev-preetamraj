'use client';
import { clickMenuButton } from '@/features/slices/navbarSlice';
import { AppDispatch, RootState } from '@/features/store';
import { Cross2Icon, TextAlignJustifyIcon } from '@radix-ui/react-icons';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from './Breadcrumb';
import NavbarSearch from './NavbarSearch';

const Navbar = () => {
  const clicked = useSelector((state: RootState) => state.navbar.clicked);
  const dispatch: AppDispatch = useDispatch();
  return (
    <div
      id='site-navbar'
      className='relative border-b border-border sticky z-50 top-0 backdrop-blur-md'
    >
      {/* Same centred cap + gutter as the layout content row, so the
          breadcrumb and search line up with the content and rail edges. */}
      <div className='mx-auto flex max-w-[1440px] items-center justify-between px-gutter py-2 md:py-4'>
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
        <Breadcrumb />
        <NavbarSearch />
      </div>
    </div>
  );
};

export default Navbar;
