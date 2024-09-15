'use server';

import db from '@/db';
import { tagSchema } from '@/db/schema';
import { IResponse } from '@/lib/types';
import { CustomResponse } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import slugify from 'slugify';

const response = new CustomResponse();

export const createTag = async (name: string) => {
  try {
    const { userId } = auth();

    if (!userId) return response.error('Unauthorized');
    const slug = slugify(name, { lower: true, strict: true });

    await db.insert(tagSchema).values({
      name,
      slug,
    });

    return response.success(null, 'Tag created successfully');
  } catch (error) {
    console.log(error);
    return response.internalServerError();
  }
};

export const getTags = async (): Promise<
  IResponse<(typeof tagSchema.$inferSelect)[] | null>
> => {
  try {
    const { userId } = auth();
    if (!userId) return response.error('Unauthorized');

    const tags = await db.select().from(tagSchema);
    return response.success(tags, 'Tags fetched successfully');
  } catch (error) {
    console.log(error);
    return response.internalServerError();
  }
};

export const getTagBySlug = async (
  slug: string
): Promise<IResponse<typeof tagSchema.$inferSelect | null>> => {
  try {
    const { userId } = auth();
    if (!userId) return response.error('Unauthorized');

    const tags = await db
      .select()
      .from(tagSchema)
      .where(eq(tagSchema.slug, slug));
    return response.success(tags[0], 'Tag fetched successfully');
  } catch (error) {
    console.log(error);
    return response.internalServerError();
  }
};
