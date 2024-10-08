'use client';

import DeletePortfolioAlertDialog from '@/components/portfolio/delete-portfolio-alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ICategory } from '@/models/category';
import { IPortfolio } from '@/models/portfolio';
import { ITag } from '@/models/tag';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

export const columns: ColumnDef<Partial<IPortfolio>>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const _id = row.original._id;
      const title: string = row.getValue('title');
      return (
        <Link
          href={{
            pathname: `/dashboard/project`,
            query: {
              action: 'edit',
              _id,
            },
          }}
        >
          <Button variant='link' className='p-0'>
            {title}
          </Button>
        </Link>
      );
    },
  },

  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category: ICategory = row.getValue('category');
      return (
        <Link href={`/categories/${category?.name}`}>
          <Button variant='link' className='px-0'>
            {category?.name}
          </Button>
        </Link>
      );
    },
  },

  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags: ITag[] = row.getValue('tags');

      return (
        <div>
          <span>{tags.length === 0 ? '[]' : 'Something'}</span>
        </div>
      );
    },
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const blog = row.original;
      const date: Date = row.getValue('createdAt');
      const formatedDate = format(date, 'PPP');
      const formatedTime = format(date, 'hh:mm a');
      return (
        <div className='flex flex-col space-y-1'>
          <span>{blog.isPublished ? 'Published' : 'Last Modified'}</span>
          <span>
            {formatedDate} at {formatedTime}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const _id = row.original._id;

      return (
        <div className='flex items-center space-x-4'>
          <Link
            href={{
              pathname: `/dashboard/project`,
              query: {
                action: 'edit',
                _id,
              },
            }}
          >
            <Button variant='link' className='p-0'>
              Edit
            </Button>
          </Link>

          <Link
            href={{
              pathname: `/dashboard/project`,
              query: {
                action: 'preview',
                _id,
              },
            }}
          >
            <Button variant='link' className='p-0'>
              Preview
            </Button>
          </Link>

          <DeletePortfolioAlertDialog portfolioId={_id!} />
        </div>
      );
    },
  },
];
