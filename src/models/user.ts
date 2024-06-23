import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  __v: number;
  userId: string;
  name?: string;
  email: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const CustomUser =
  mongoose.models.CustomUser || mongoose.model<IUser>('CustomUser', userSchema);

export default CustomUser;
