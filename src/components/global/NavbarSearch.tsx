'use client';
import { searchAll } from '@/actions/search';
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
import {
  DesktopIcon,
  MoonIcon,
  Share1Icon,
  SunIcon,
  TextAlignLeftIcon,
} from '@radix-ui/react-icons';
import { BookIcon, BookmarkIcon, SearchIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { CombinedSearchQueryResult } from '../../../sanity.types';

const EMPTY_RESULTS: CombinedSearchQueryResult = {
  blogs: [],
  projects: [],
  categories: [],
  tags: [],
};

const NavbarSearch = () => {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CombinedSearchQueryResult>(EMPTY_RESULTS);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query) {
      setResults(EMPTY_RESULTS);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const data = await searchAll(query);
      setResults(data);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

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
        <CommandInput
          placeholder='Type a command or search...'
          value={query}
          onChangeCapture={(e) => setQuery(e.currentTarget.value)}
        />
        <CommandList className='border-border'>
          <CommandEmpty>No results found.</CommandEmpty>

          {query !== '' && results.blogs.length > 0 && (
            <CommandGroup heading='Blog' className='border-border'>
              {results.blogs.map((blog) => (
                <CommandItem
                  key={blog._id}
                  onSelect={() => {
                    router.push(`/blog/${blog.slug?.current}`);
                    setOpen(false);
                  }}
                  value={blog.title || ''}
                >
                  <BookIcon className='mr-2 h-4 w-4' />
                  <span>{blog.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />

          {query !== '' && results.projects.length > 0 && (
            <CommandGroup heading='Portfolio' className='border-border'>
              {results.projects.map((project) => (
                <CommandItem
                  key={project._id}
                  onSelect={() => {
                    router.push(`/portfolio/${project.slug?.current}`);
                    setOpen(false);
                  }}
                  value={project.title || ''}
                >
                  <Share1Icon className='mr-2 h-4 w-4' />
                  <span>{project.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />

          {query !== '' && results.categories.length > 0 && (
            <CommandGroup heading='Category' className='border-border'>
              {results.categories.map((category) => (
                <CommandItem
                  key={category._id}
                  onSelect={() => {
                    router.push(`/categories/${category.slug?.current}`);
                    setOpen(false);
                  }}
                  value={category.name || ''}
                >
                  <TextAlignLeftIcon className='mr-2 h-4 w-4' />
                  <span>{category.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />

          {query !== '' && results.tags.length > 0 && (
            <CommandGroup heading='Tag' className='border-border'>
              {results.tags.map((tag) => (
                <CommandItem
                  key={tag._id}
                  onSelect={() => {
                    router.push(`/tags/${tag.slug?.current}`);
                    setOpen(false);
                  }}
                  value={tag.name || ''}
                >
                  <BookmarkIcon className='mr-2 h-4 w-4' />
                  <span>{tag.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />

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
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default NavbarSearch;
