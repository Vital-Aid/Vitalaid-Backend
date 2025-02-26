import mongoose, { Schema, Document } from "mongoose";

interface IUserReview extends Document {
  userId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  reviewText: string;
  createdAt: Date;
}

const UserReviewSchema = new Schema<IUserReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    reviewText: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUserReview>("UserReview", UserReviewSchema);
