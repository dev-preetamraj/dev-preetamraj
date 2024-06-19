'use client';

import DeletePortfolioAlertDialog from '@/components/portfolio/delete-portfolio-alert-dialog';
import { Button } from '@/components/ui/button';
import { ICategory } from '@/models/category';
import { IPortfolio } from '@/models/portfolio';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import Link from 'next/link';

export const columns: ColumnDef<Partial<IPortfolio>>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const _id = row.original._id;
      const title: string = row.getValue('title');
      return (
        <div className='group h-16'>
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
          <div className='group-hover:flex hidden items-center space-x-4'>
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
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category: ICategory = row.getValue('category');
      return (
        <Link href={`/categories/${category.name}`}>
          <Button variant='link' className='px-0'>
            {category.name}
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      const blog = row.original;
      const date: Date = row.getValue('createdAt');
      const formatedDate = format(date, 'PPP');
      const formatedTime = format(date, 'hh:mm a');
      return (
        <div className='flex flex-col space-y-2'>
          <span>{blog.isPublished ? 'Published' : 'Last Modified'}</span>
          <span>
            {formatedDate} at {formatedTime}
          </span>
        </div>
      );
    },
  },
];
