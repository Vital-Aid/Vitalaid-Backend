import CustomError from "../../utils/CustomError";
import userReview from "../../Models/userReview";
import { NextFunction,Request,Response } from "express";
import DrDetails from "../../Models/DoctorDetails";

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

export const adduserReview=async(req: Request, res: Response, next: NextFunction)=>{
    const doctorId=req.user?.id
    const{reviewText,userId}=req.body
    const newreview=new userReview({doctorId,userId,reviewText})
    if(!newreview){
        return next(new CustomError("failed to add new review"))
    }
    await newreview.save()
    res.status(200).json({status:true,message:"review added successfully",data:newreview})

} 

export const getUsersReview = async (req: Request, res: Response, next: NextFunction) => {
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
      const doctorIds = reviews.map(review => review.doctorId._id.toString());
      const drDetails = await DrDetails.find({ doctor: { $in: doctorIds } }, "doctor profileImage").lean();
      const doctorProfileMap = new Map(
      drDetails.map(doctor => [doctor.doctor.toString(), doctor.profileImage || null])
    );
      const updatedReviews = reviews.map(review => ({
      ...review,
      doctorId: {
        ...review.doctorId,
        profileImage: doctorProfileMap.get(review.doctorId._id.toString()) || null
      }
    }));
  
    res.status(200).json({
      status: true,
      message: "User reviews fetched successfully",
      data: updatedReviews
    });
  };
  
  export const getUsersReviewforusers = async (req: Request, res: Response, next: NextFunction) => {
    const id  = req.user?.id;
  
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
      const doctorIds = reviews.map(review => review.doctorId._id.toString());
      const drDetails = await DrDetails.find({ doctor: { $in: doctorIds } }, "doctor profileImage").lean();
      const doctorProfileMap = new Map(
      drDetails.map(doctor => [doctor.doctor.toString(), doctor.profileImage || null])
    );
      const updatedReviews = reviews.map(review => ({
      ...review,
      doctorId: {
        ...review.doctorId,
        profileImage: doctorProfileMap.get(review.doctorId._id.toString()) || null
      }
    }));
  
    res.status(200).json({
      status: true,
      message: "User reviews fetched successfully",
      data: updatedReviews
    });
  };
  