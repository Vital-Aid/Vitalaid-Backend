import mongoose, { Document, Schema } from "mongoose";

interface DoctorType extends Document {
  name?: string;
  email: string;
  password: string;
  phone: string;
  isDeleted: boolean;
  drDetails: mongoose.ObjectId;
}

const DoctorSchema: Schema<DoctorType> = new Schema(
  {
    drDetails: {
      type: mongoose.Types.ObjectId,
      ref: "DrDetails",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
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
