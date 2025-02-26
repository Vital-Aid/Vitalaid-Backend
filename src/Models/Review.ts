import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId
  doctorId: mongoose.Types.ObjectId
  rating: number
  comment?: string
  isDeleted:boolean
  createdAt: Date
  updatedAt: Date
}

const reviewSchema: Schema<IReview> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    isDeleted:{
        type:Boolean,
        required:true,
        default:false
    }
  },
  { timestamps: true }
);

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);
export default Review;
