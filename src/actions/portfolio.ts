'use server';

import dbConnect from '@/lib/dbConnect';
import { IResponse } from '@/lib/types';
import { ServerResponse } from '@/lib/utils';
import Category from '@/models/category';
import Portfolio, { IPortfolio } from '@/models/portfolio';
import { currentUser } from '@clerk/nextjs/server';

const response_obj = new ServerResponse();

export const fetchProjects = async (): Promise<
  IResponse<Partial<IPortfolio>[] | null>
> => {
  try {
    await dbConnect();

    const projects = await Portfolio.find();
    return response_obj.response(projects, 'Projects fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const getPortfolioById = async (
  portfolioId: string
): Promise<IResponse<Partial<IPortfolio> | null>> => {
  try {
    await dbConnect();

    const portfolio = await Portfolio.findById(portfolioId)
      .populate('category')
      .lean();

    return response_obj.response(portfolio, 'Portfolio fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const deletePortfolioById = async (
  portfolioId: string
): Promise<IResponse<null>> => {
  try {
    await dbConnect();

    await Portfolio.deleteOne({ _id: portfolioId });

    return response_obj.response(null, 'Portfolio deleted successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const getPortfolioBySlug = async (
  slug: string
): Promise<IResponse<Partial<IPortfolio> | null>> => {
  try {
    await dbConnect();

    const portfolio = await Portfolio.findOne({ slug })
      .populate('category')
      .lean();

    return response_obj.response(portfolio, 'Portfolio fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const createPortfolio = async (
  title: string,
  description: string,
  featuredImage?: string
): Promise<IResponse<Partial<IPortfolio> | null>> => {
  try {
    await dbConnect();
    const user = await currentUser();
    if (!user) return response_obj.errorResponse('Unauthorized');

    const role = user.privateMetadata.role;
    if (role !== 'admin') return response_obj.errorResponse('Unauthorized');

    const existingTitle = await Portfolio.findOne({ title });
    if (existingTitle)
      return response_obj.errorResponse('Duplicate titles are not allowed');

    const category = await Category.findOne({ name: 'uncategorized' });

    const response = await Portfolio.create({
      title,
      description,
      content: 'Write here...',
      category: category._id,
    });
    if (featuredImage) {
      response.featuredImage = featuredImage;
      await response.save();
    }

    return response_obj.response(
      response,
      'Portfolio created successfully. Redirecting...'
    );
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const updatePortfolioMetadata = async (
  portfolioId: string,
  metadata: any
) => {
  try {
    await dbConnect();
    const user = await currentUser();
    if (!user) return response_obj.errorResponse('Unauthorized');

    const role = user.privateMetadata.role;
    if (role !== 'admin') return response_obj.errorResponse('Unauthorized');

    const category = await Category.findOne({ name: metadata.category });
    if (!category)
      return response_obj.errorResponse('Invalid category selection');

    await Portfolio.findOneAndUpdate(
      { _id: portfolioId },
      {
        title: metadata.title,
        description: metadata.description,
        featuredImage: metadata.featuredImage,
        category: category._id,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return response_obj.response(null, 'Metadata updated successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const updatePortfolioContent = async (
  portfolioId: string,
  content: string
) => {
  try {
    await dbConnect();
    const user = await currentUser();
    if (!user) return response_obj.errorResponse('Unauthorized');

    const role = user.privateMetadata.role;
    if (role !== 'admin') return response_obj.errorResponse('Unauthorized');

    await Portfolio.findOneAndUpdate(
      { _id: portfolioId },
      {
        content,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return response_obj.response(null, 'Content updated successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};

export const fetchFeaturedProjects = async (): Promise<
  IResponse<Partial<IPortfolio>[] | null>
> => {
  try {
    await dbConnect();

    const projects = await Portfolio.find().limit(5);
    return response_obj.response(projects, 'Projects fetched successfully');
  } catch (error: any) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};
