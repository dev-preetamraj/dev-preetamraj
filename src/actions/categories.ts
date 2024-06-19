'use server';

import dbConnect from '@/lib/dbConnect';
import { IResponse } from '@/lib/types';
import { ServerResponse } from '@/lib/utils';
import Category, { ICategory } from '@/models/category';
import { currentUser } from '@clerk/nextjs/server';

const response_obj = new ServerResponse();

export const fetchCategories = async (): Promise<
  IResponse<Partial<ICategory>[] | null>
> => {
  try {
    await dbConnect();
    const response = await Category.find().sort({ createdAt: -1 });
    return response_obj.response(response, 'Categories fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const fetchTrendingCategories = async (): Promise<
  IResponse<Partial<ICategory>[] | null>
> => {
  try {
    await dbConnect();
    const response = await Category.find().limit(10).sort({ createdAt: -1 });
    return response_obj.response(response, 'Categories fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const createCategory = async (
  name: string
): Promise<IResponse<null>> => {
  try {
    await dbConnect();
    const user = await currentUser();
    if (!user) return response_obj.errorResponse('Unauthorized');

    const role = user.privateMetadata.role;
    if (role !== 'admin') return response_obj.errorResponse('Unauthorized');

    const existingcategory = await Category.findOne({ name });
    if (existingcategory)
      return response_obj.errorResponse(
        'Category with this name already exists'
      );

    await Category.create({ name });
    return response_obj.response(null, 'Category created successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const fetchAllCategoriesForSearch = async (
  keyword: string
): Promise<IResponse<Partial<ICategory>[] | null>> => {
  try {
    await dbConnect();

    const categories = await Category.find({
      name: { $regex: keyword, $options: 'i' },
    }).lean();
    return response_obj.response(categories, 'Categories fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};
