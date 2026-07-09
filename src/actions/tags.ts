'use server';

import dbConnect from '@/lib/dbConnect';
import { IResponse } from '@/lib/types';
import { ServerResponse } from '@/lib/utils';
import Tag, { ITag } from '@/models/tag';
import { currentUser } from '@clerk/nextjs/server';

const response_obj = new ServerResponse();

/**
 * @deprecated Public tag listing now reads from Sanity. Use `TAGS_QUERY`
 * with `sanityFetch` from `@/sanity/lib/queries` instead. Kept only until the
 * MongoDB read path is fully retired.
 */
export const fetchTags = async (): Promise<
  IResponse<Partial<ITag>[] | null>
> => {
  try {
    await dbConnect();
    const response = await Tag.find().sort({ createdAt: -1 });
    return response_obj.response(response, 'Tags fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

/**
 * @deprecated Public tag pages now read from Sanity. Use `TAG_BY_SLUG_QUERY`
 * with `sanityFetch` from `@/sanity/lib/queries` instead. Kept only until the
 * MongoDB read path is fully retired.
 */
export const fetchTagBySlug = async (
  slug: string
): Promise<IResponse<Partial<ITag> | null>> => {
  try {
    await dbConnect();
    const response = await Tag.findOne({ slug });
    return response_obj.response(response, 'Tag fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const createTag = async (name: string): Promise<IResponse<null>> => {
  try {
    await dbConnect();
    const user = await currentUser();
    if (!user) return response_obj.errorResponse('Unauthorized');

    const role = user.privateMetadata.role;
    if (role !== 'admin') return response_obj.errorResponse('Unauthorized');

    const existingTag = await Tag.findOne({ name });
    if (existingTag)
      return response_obj.errorResponse('Tag with this name already exists');

    await Tag.create({ name });
    return response_obj.response(null, 'Tag created successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

/**
 * @deprecated Global search now reads from Sanity in a single query. Use
 * `searchContent` from `@/actions/search` instead. Kept only until the MongoDB
 * read path is fully retired.
 */
export const fetchAllTagsForSearch = async (
  keyword: string
): Promise<IResponse<Partial<ITag>[] | null>> => {
  try {
    await dbConnect();

    const tags = await Tag.find({
      name: { $regex: keyword, $options: 'i' },
    }).lean();
    return response_obj.response(tags, 'Tags fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};
