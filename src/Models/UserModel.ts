
import mongoose, { Document, Schema, model } from "mongoose";

interface UserType extends Document {
  name?: string;
  email: string;
  password: string;
  admin: boolean;
  phone: string;
  isDeleted: boolean;
  blocked:boolean
    User: mongoose.ObjectId,
}

const userSchema: Schema<UserType> = new Schema(
  {
    name: { type: String },
    User: {
            type: mongoose.Types.ObjectId, ref: "UserDetails",
            required: true
        },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false, },
    phone: { type: String },
    isDeleted: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model<UserType>("User", userSchema);

export default User;

