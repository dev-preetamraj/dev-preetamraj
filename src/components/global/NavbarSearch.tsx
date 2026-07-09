'use client';
import { searchContent } from '@/actions/search';
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
import { SearchResults } from '@/sanity/lib/queries';
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
import { ComponentType, Fragment, useEffect, useRef, useState } from 'react';

type SearchLink = { _id: string; label: string; href: string };

type SearchItem = SearchLink & {
  // Recent posts nested under a matched category/tag; absent for blogs/projects.
  posts?: SearchLink[];
};

type SearchGroup = {
  heading: string;
  icon: ComponentType<{ className?: string }>;
  items: SearchItem[];
};

const EMPTY_RESULTS: SearchResults = {
  blogs: [],
  projects: [],
  categories: [],
  tags: [],
};

const SEARCH_DEBOUNCE_MS = 250;

const NavbarSearch = () => {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  // Monotonic id so a slow response can never overwrite a newer one.
  const requestId = useRef(0);

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
    const trimmed = query.trim();
    if (!trimmed) {
      setResults(EMPTY_RESULTS);
      return;
    }

    const currentRequest = ++requestId.current;
    const timeout = setTimeout(async () => {
      const { success, data } = await searchContent(trimmed);
      // Ignore stale responses that resolved after a newer keystroke.
      if (currentRequest !== requestId.current) return;
      if (success && data) setResults(data);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query]);

  const { blogs, projects, categories, tags } = results;

  // Nest a category/tag's recent posts only when the query didn't already match
  // any post title directly — i.e. it "strictly" resolved to a category/tag.
  // Otherwise the same posts would show twice (Blog group + nested).
  const nestPosts = blogs.length === 0;

  const groups: SearchGroup[] = [
    {
      heading: 'Blog',
      icon: BookIcon,
      items: blogs.map((b) => ({
        _id: b._id,
        label: b.title,
        href: `/blog/${b.slug}`,
      })),
    },
    {
      heading: 'Portfolio',
      icon: Share1Icon,
      items: projects.map((p) => ({
        _id: p._id,
        label: p.title,
        href: `/portfolio/${p.slug}`,
      })),
    },
    {
      heading: 'Category',
      icon: TextAlignLeftIcon,
      items: categories.map((c) => ({
        _id: c._id,
        label: c.name,
        href: `/categories/${c.slug}`,
        posts: nestPosts
          ? c.posts.map((p) => ({
              _id: p._id,
              label: p.title,
              href: `/blog/${p.slug}`,
            }))
          : undefined,
      })),
    },
    {
      heading: 'Tag',
      icon: BookmarkIcon,
      items: tags.map((t) => ({
        _id: t._id,
        label: t.name,
        href: `/tags/${t.slug}`,
        posts: nestPosts
          ? t.posts.map((p) => ({
              _id: p._id,
              label: p.title,
              href: `/blog/${p.slug}`,
            }))
          : undefined,
      })),
    },
  ];

  const visibleGroups =
    query.trim() === '' ? [] : groups.filter((group) => group.items.length > 0);

  // Theme commands are static/local, so they're filtered client-side against
  // the query (content results come pre-filtered from the server).
  const themeCommands: {
    value: 'dark' | 'light' | 'system';
    label: string;
    icon: ComponentType<{ className?: string }>;
  }[] = [
    { value: 'dark', label: 'Dark', icon: MoonIcon },
    { value: 'light', label: 'Light', icon: SunIcon },
    { value: 'system', label: 'System', icon: DesktopIcon },
  ];

  const themeQuery = query.trim().toLowerCase();
  const visibleThemes = themeQuery
    ? themeCommands.filter(
        (theme) =>
          theme.label.toLowerCase().includes(themeQuery) ||
          'theme'.includes(themeQuery)
      )
    : themeCommands;

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

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        commandProps={{ shouldFilter: false }}
      >
        <CommandInput
          placeholder='Type a command or search...'
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className='border-border'>
          <CommandEmpty>No results found.</CommandEmpty>

          {visibleGroups.map((group, index) => (
            <Fragment key={group.heading}>
              {index > 0 && <CommandSeparator />}
              <CommandGroup heading={group.heading} className='border-border'>
                {group.items.map((item) => (
                  <Fragment key={item._id}>
                    <CommandItem
                      value={`${group.heading}:${item.label}`}
                      onSelect={() => {
                        router.push(item.href);
                        setOpen(false);
                      }}
                    >
                      <group.icon className='mr-2 h-4 w-4' />
                      <span>{item.label}</span>
                    </CommandItem>

                    {item.posts?.map((post) => (
                      <CommandItem
                        key={post._id}
                        value={`${group.heading}:${item.label}:${post._id}`}
                        onSelect={() => {
                          router.push(post.href);
                          setOpen(false);
                        }}
                        className='text-muted-foreground'
                      >
                        {/* Left margin (not padding) indents past the item's
                            own px-2, giving a nested look the wrapper's
                            `[cmdk-item]:px-2` rule can't override. */}
                        <span className='ml-5 mr-2 flex h-4 w-4 shrink-0 items-center justify-center opacity-70'>
                          <BookIcon className='h-4 w-4' />
                        </span>
                        <span>{post.label}</span>
                      </CommandItem>
                    ))}
                  </Fragment>
                ))}
              </CommandGroup>
            </Fragment>
          ))}

          {visibleThemes.length > 0 && (
            <>
              {visibleGroups.length > 0 && <CommandSeparator />}
              <CommandGroup heading='Theme' className='border-border'>
                {visibleThemes.map((theme) => (
                  <CommandItem
                    key={theme.value}
                    value={`Theme:${theme.label}`}
                    onSelect={() => {
                      setTheme(theme.value);
                      setOpen(false);
                    }}
                  >
                    <theme.icon className='mr-2 h-4 w-4' />
                    <span>{theme.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default NavbarSearch;
