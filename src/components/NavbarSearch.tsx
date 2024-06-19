'use client';
import { fetchAllBlogsForSearch } from '@/actions/blog';
import { fetchAllCategoriesForSearch } from '@/actions/categories';
import { fetchAllProjectsForSearch } from '@/actions/portfolio';
import { fetchAllTagsForSearch } from '@/actions/tags';
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
import { IBlog } from '@/models/blog';
import { ICategory } from '@/models/category';
import { IPortfolio } from '@/models/portfolio';
import { ITag } from '@/models/tag';
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
import { useEffect, useState } from 'react';

const NavbarSearch = () => {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [blogs, setBlogs] = useState<Partial<IBlog>[] | null>(null);
  const [projects, setProjects] = useState<Partial<IPortfolio>[] | null>(null);
  const [categories, setCategories] = useState<Partial<ICategory>[] | null>(
    null
  );
  const [tags, setTags] = useState<Partial<ITag>[] | null>(null);
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

  useEffect(() => {
    const fetchBlogs = async () => {
      const { success, data } = await fetchAllBlogsForSearch(query);
      if (success) setBlogs(data);
    };

    const fetchProjects = async () => {
      const { success, data } = await fetchAllProjectsForSearch(query);
      if (success) setProjects(data);
    };

    const fetchCategories = async () => {
      const { success, data } = await fetchAllCategoriesForSearch(query);
      if (success) setCategories(data);
    };

    const fetchTags = async () => {
      const { success, data } = await fetchAllTagsForSearch(query);
      if (success) setTags(data);
    };

    if (query) {
      fetchBlogs();
      fetchProjects();
      fetchCategories();
      fetchTags();
    } else {
      setBlogs(null);
      setProjects(null);
      setCategories(null);
      setTags(null);
    }
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

          {blogs && blogs.length > 0 && (
            <CommandGroup heading='Blog' className='border-border'>
              {blogs.map((blog) => (
                <CommandItem
                  key={blog._id}
                  onSelect={() => {
                    router.push(`/blog/${blog.slug}`);
                    setOpen(false);
                  }}
                >
                  <BookIcon className='mr-2 h-4 w-4' />
                  {blog.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {projects && projects.length > 0 && (
            <CommandGroup heading='Portfolio' className='border-border'>
              {projects.map((project) => (
                <CommandItem
                  key={project._id}
                  onSelect={() => {
                    router.push(`/portfolio/${project.slug}`);
                    setOpen(false);
                  }}
                >
                  <Share1Icon className='mr-2 h-4 w-4' />
                  {project.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {categories && categories.length > 0 && (
            <CommandGroup heading='Category' className='border-border'>
              {categories.map((category) => (
                <CommandItem
                  key={category._id}
                  onSelect={() => {
                    router.push(`/categories/${category.name}`);
                    setOpen(false);
                  }}
                >
                  <TextAlignLeftIcon className='mr-2 h-4 w-4' />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {tags && tags.length > 0 && (
            <CommandGroup heading='Tag' className='border-border'>
              {tags.map((tag) => (
                <CommandItem
                  key={tag._id}
                  onSelect={() => {
                    router.push(`/tags/${tag.name}`);
                    setOpen(false);
                  }}
                >
                  <BookmarkIcon className='mr-2 h-4 w-4' />
                  {tag.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

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
