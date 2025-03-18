import CustomError from "../../utils/CustomError";
import userReview from "../../Models/userReview";
import { NextFunction, Request, Response } from "express";
import DrDetails from "../../Models/DoctorDetails";
import Review from "../../Models/Review";
import UserDetails from "../../Models/Userdetails";

interface DoctorType {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ReviewType {
  _id: string;
  userId: string;
  doctorId: DoctorType;
  reviewText: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const adduserReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const doctorId = req.user?.id;
  const { reviewText, userId } = req.body;
  const newreview = new userReview({ doctorId, userId, reviewText });
  if (!newreview) {
    return next(new CustomError("failed to add new review"));
  }
  await newreview.save();
  res.status(200).json({
    status: true,
    message: "review added successfully",
    data: newreview,
  });
};

export const getUsersReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id) {
    return next(new CustomError("User ID is not provided"));
  }

  const reviews = await userReview
    .find({ userId: id })
    .populate("doctorId", "name email phone")
    .lean();

  if (!reviews.length) {
    return next(new CustomError("Reviews not found"));
  }
  const doctorIds = reviews.map((review) => review.doctorId._id.toString());
  const drDetails = await DrDetails.find(
    { doctor: { $in: doctorIds } },
    "doctor profileImage"
  ).lean();
  const doctorProfileMap = new Map(
    drDetails.map((doctor) => [
      doctor.doctor.toString(),
      doctor.profileImage || null,
    ])
  );
  const updatedReviews = reviews.map((review) => ({
    ...review,
    doctorId: {
      ...review.doctorId,
      profileImage:
        doctorProfileMap.get(review.doctorId._id.toString()) || null,
    },
  }));

  res.status(200).json({
    status: true,
    message: "User reviews fetched successfully",
    data: updatedReviews,
  });
};

export const getUsersReviewforusers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.user?.id;

  if (!id) {
    return next(new CustomError("User ID is not provided"));
  }

  const reviews = await userReview
    .find({ userId: id })
    .populate("doctorId", "name email phone")
    .lean();

  const doctorIds = reviews.map((review) => review.doctorId._id.toString());
  const drDetails = await DrDetails.find(
    { doctor: { $in: doctorIds } },
    "doctor profileImage"
  ).lean();
  const doctorProfileMap = new Map(
    drDetails.map((doctor) => [
      doctor.doctor.toString(),
      doctor.profileImage || null,
    ])
  );
  const updatedReviews = reviews.map((review) => ({
    ...review,
    doctorId: {
      ...review.doctorId,
      profileImage:
        doctorProfileMap.get(review.doctorId._id.toString()) || null,
    },
  }));

  res.status(200).json({
    status: true,
    message: "User reviews fetched successfully",
    data: updatedReviews,
  });
};

export const addReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.user?.id;
  const { doctorId, rating, comment } = req.body;
  const newReview = new Review({ userId: id, doctorId, rating, comment });
  await newReview.save();
  res
    .status(200)
    .json({
      status: true,
      message: "review added successfully",
      data: newReview,
    });
};

export const getReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id) {
    return next(new CustomError("Doctor id is not provided"));
  }

  const reviews = await Review.find({ doctorId: id, isDeleted: false })
    .populate("userId", "name")
    .lean();

  if (!reviews.length) {
    return next(new CustomError("Reviews not found"));
  }

  const userIds = reviews.map((review) => review.userId._id.toString());
  const userDetails = await UserDetails.find(
    { user: { $in: userIds } },
    "user profileImage"
  ).lean();

  const userProfileMap = new Map(
    userDetails.map((user) => [
      user.user.toString(),
      user?.profileImage?.originalProfile,
    ])
  );

  const updatedReviews = reviews.map((review) => ({
    ...review,
    userId: {
      ...review.userId,
      profileImage: userProfileMap.get(review.userId._id.toString()) || null,
    },
  }));

  res.status(200).json({
    status: true,
    message: "Doctor reviews",
    data: updatedReviews,
  });
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const deletedreview = await Review.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  res
    .status(200)
    .json({
      status: true,
      message: "review deleted successfully",
      data: deletedreview,
    });
};
