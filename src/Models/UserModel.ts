import { Document, Schema, model } from "mongoose";

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
  isDeleted: boolean;
  createdAt: Date;
}

const userSchema: Schema<UserType> = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: {
      originalProfile: { type: String },
      thumbnail: { type: String },
    },
    admin: { type: Boolean, default: false },
    phone: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true } 
);

const User = model<UserType>("User", userSchema);

export default User;
