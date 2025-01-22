import { Document, Schema, model } from "mongoose";
import { boolean } from "zod";

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
  isVerified:boolean
  isDeleted: boolean;
  createdAt: Date;
}

const userSchema: Schema<UserType> = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: {
      originalProfile: { type: String,default:'https://i.pinimg.com/736x/ed/fe/67/edfe6702e44cfd7715a92390c7d8a418.jpg' },
      thumbnail: { type: String,default:'https://i.pinimg.com/736x/ed/fe/67/edfe6702e44cfd7715a92390c7d8a418.jpg' },
    },
   
    admin: { type: Boolean, default: false, },
    phone: { type: String, required: true, },
    isVerified:{type:Boolean,required:true,default:false},
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true } 
);

const User = model<UserType>("User", userSchema);

export default User;

