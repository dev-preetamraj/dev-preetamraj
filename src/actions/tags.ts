'use server';

import dbConnect from '@/lib/dbConnect';
import { IResponse } from '@/lib/types';
import { ServerResponse } from '@/lib/utils';
import Tag, { ITag } from '@/models/tag';
import { currentUser } from '@clerk/nextjs/server';

const response_obj = new ServerResponse();

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
