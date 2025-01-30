import { bool } from "aws-sdk/clients/signer";
import mongoose, { Document, Schema, model } from "mongoose";

interface UserType extends Document {
  name?: string;
  email: string;
  password: string;
  profileImage?: {
    originalProfile?: string;
    thumbnail?: string;
  };
  admin: boolean;
  phone: string;
  isVerified: boolean
  isDeleted: boolean;
  createdAt: Date;
  blocked:boolean
}

const userSchema: Schema<UserType> = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: {
      originalProfile: { type: String, default: 'https://i.pinimg.com/736x/ed/fe/67/edfe6702e44cfd7715a92390c7d8a418.jpg' },
      thumbnail: { type: String, default: 'https://i.pinimg.com/736x/ed/fe/67/edfe6702e44cfd7715a92390c7d8a418.jpg' },
    },

    admin: { type: Boolean, default: false, },
    phone: { type: String, required: true, },
    isVerified: { type: Boolean, required: true, default: false },
    isDeleted: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model<UserType>("User", userSchema);

export default User;

