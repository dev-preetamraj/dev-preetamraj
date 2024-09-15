'use server';

import db from '@/db';
import { categorySchema } from '@/db/schema';
import { IResponse } from '@/lib/types';
import { CustomResponse } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import slugify from 'slugify';

const response = new CustomResponse();

export const createCategory = async (name: string) => {
  try {
    const { userId } = auth();
    if (!userId) return response.error('Unauthorized');

    const slug = slugify(name, { lower: true, strict: true });

    await db.insert(categorySchema).values({
      name,
      slug,
    });

    return response.success(null, 'Category created successfully');
  } catch (error) {
    console.log(error);
    return response.internalServerError();
  }
};

export const getCategories = async (): Promise<
  IResponse<(typeof categorySchema.$inferSelect)[] | null>
> => {
  try {
    const { userId } = auth();
    if (!userId) return response.error('Unauthorized');

    const categories = await db.select().from(categorySchema);
    return response.success(categories, 'Categories fetched successfully');
  } catch (error) {
    console.log(error);
    return response.internalServerError();
  }
};

export const getCategoryBySlug = async (
  slug: string
): Promise<IResponse<typeof categorySchema.$inferSelect | null>> => {
  try {
    const { userId } = auth();
    if (!userId) return response.error('Unauthorized');

    const categories = await db
      .select()
      .from(categorySchema)
      .where(eq(categorySchema.slug, slug));
    return response.success(categories[0], 'Categories fetched successfully');
  } catch (error) {
    console.log(error);
    return response.internalServerError();
  }
};
