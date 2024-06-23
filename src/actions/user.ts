'use server';

import { IResponse } from '@/lib/types';
import { ServerResponse } from '@/lib/utils';
import CustomUser, { IUser } from '@/models/user';

const response_obj = new ServerResponse();

export const createUser = async (
  userId: string,
  email: string,
  name: string | null = null,
  imageUrl: string | null = null
): Promise<IResponse<IUser | null>> => {
  try {
    const user = new CustomUser({
      userId,
      email,
      name,
      imageUrl,
    });
    await user.save();
    return response_obj.response(user, 'User fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const getUserByUserId = async (
  userId: string
): Promise<IResponse<IUser | null>> => {
  try {
    const user = await CustomUser.findOne({ userId }).lean();
    return response_obj.response(user, 'User fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};
