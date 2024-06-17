'use client';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DesktopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { SearchIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const NavbarSearch = () => {
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Button
        variant='outline'
        size={isDesktop ? 'default' : 'icon'}
        onClick={() => setOpen(true)}
        className='flex items-center md:space-x-4 xl:space-x-10 group'
      >
        <span className='text-muted-foreground group-hover:text-foreground hidden md:inline-block'>
          Search project, blog or settings...
        </span>
        <div>
          <SearchIcon className='icon block md:hidden' />
          <kbd className='pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 text-muted-foreground group-hover:text-foreground'>
            <span className='text-xs'>⌘</span>K
          </kbd>
        </div>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Type a command or search...' />
        <CommandList className='border-border'>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading='Theme' className='border-border'>
            <CommandItem
              onSelect={() => {
                setTheme('dark');
                setOpen(false);
              }}
            >
              <MoonIcon className='mr-2 h-4 w-4' />
              <span>Dark</span>
            </CommandItem>

            <CommandItem
              onSelect={() => {
                setTheme('light');
                setOpen(false);
              }}
            >
              <SunIcon className='mr-2 h-4 w-4' />
              <span>Light</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setTheme('system');
                setOpen(false);
              }}
            >
              <DesktopIcon className='mr-2 h-4 w-4' />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default NavbarSearch;
