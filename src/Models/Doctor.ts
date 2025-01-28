import mongoose, { Document, Schema } from "mongoose";

interface DoctorType extends Document {
  name?: string;
  email: string;
  password: string;
  profileImage?: {
    originalProfile?: string;
    thumbnail?: string;
  };
  admin: boolean;
  phone: string;
  isVerified: boolean;
  isDeleted: boolean;
}

const DoctorSchema: Schema<DoctorType> = new Schema(
  {
    name: {
      type: String,
      required:true
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      originalProfile: {
        type: String,
        default:
          "https://i.pinimg.com/736x/ed/fe/67/edfe6702e44cfd7715a92390c7d8a418.jpg",
      },
      thumbnail: {
        type: String,
        default:
          "https://i.pinimg.com/736x/ed/fe/67/edfe6702e44cfd7715a92390c7d8a418.jpg",
      },
    },
    phone: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model<DoctorType>("Doctor", DoctorSchema);
export default Doctor;
