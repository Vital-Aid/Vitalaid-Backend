import { Request, Response, NextFunction } from "express";
import User from "../../Models/UserModel";
import CustomError from "../../utils/CustomError";
import MedHistory from "../../Models/Medicalhistory";
import Token from "../../Models/token";
import mongoose from "mongoose";
import { Server } from "socket.io";
import Doctor from "../../Models/Doctor";
import path from "path";
import DrDetails, { DrDetailsType } from "../../Models/DoctorDetails";
import { DoctorType } from "../../Models/Doctor";
import UserDetails from "../../Models/Userdetails";

interface DoctorPopulated {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  drDetails?: DrDetailsType | null;
}

interface TokenWithDoctor {
  _id: mongoose.Types.ObjectId;
  date: string;
  status: string;
  tokenNumber: number;
  doctorId: DoctorPopulated;
}

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
    return next(new CustomError("Invalid pagination parameters", 400));
  }
  const totalusers = await User.countDocuments({
    isDeleted: false,
    blocked: false,
  });

  const users = await User.find({ isDeleted: false })
    .skip((page - 1) * limit)
    .limit(limit);

  if (!users) {
    return next(new CustomError("users not found", 404));
  }

  res.status(200).json({
    users: users,
    totalPages: Math.ceil(totalusers / limit),
    currentPage: page,
  });
};

export const getblockedUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await User.find({ isDeleted: false, blocked: true });
  if (!users) {
    return next(new CustomError("users not found", 404));
  }

  res.status(200).json({ users: users });
};
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const medHistory = await MedHistory.find({ User: id })
      .populate("User", "name email phone").lean();

  if (!medHistory || medHistory.length === 0) {
      return next(new CustomError("User not found", 404));
  }

  const userDetails = await UserDetails.findOne({ user: id }).lean();

  if (!userDetails) {
      return next(new CustomError("User details not found", 404));
  }

  const result = { medHistory, userDetails };

  res.status(200).json({
      status: true,
      message: "User medical history and details",
      data: result,
  });
};

export const blockUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { _id } = req.params;

  const blockedUser = await User.findById(_id);
  if (!blockedUser) {
    return next(new CustomError("blockeUser not found"));
  }
  blockedUser.blocked = !blockedUser.blocked;

  await blockedUser.save();

  res.status(200).json({
    message: blockedUser.blocked
      ? "User has been blocked"
      : "User has been unblocked",
    user: blockedUser,
  });
};

export const addDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { age, occupation, address, gender, bloodgroup, profileImage } =
    req.body;
  const user = req.params.id;

  const Details = new UserDetails({
    user,
    address,
    age,
    occupation,
    gender,
    bloodgroup,
    profileImage: {
      thumbnail: "",
      originalProfile: profileImage,
    },
  });

  const saveddetails = await Details.save();
  res.status(201).json({
    error: false,
    message: "Details added",
    data: saveddetails,
  });
};

export const getDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userDetails = await UserDetails.find({ user: req.params.id });
  if (!userDetails) {
    return next(new CustomError("No Details found for this user", 404));
  }
  res.status(200).json( userDetails );
};

type editDatas = {
  age: string;
  gender: string;
  bloodgroup: string;
  occupation: string;
  address: string;
  profileImage: {
    originalProfile?: string;
    thumbnail?: string;
  };
};

export const editDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { age, occupation, address, gender, bloodgroup, profileImage } =
    req.body;
  const userId = req.user?.id;

  const updateData: editDatas = {
    age,
    occupation,
    address,
    gender,
    bloodgroup,
    profileImage: {
      thumbnail: "",
      originalProfile: profileImage,
    },
  };

  const updatedDetails = await UserDetails.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true }
  );

  if (!updatedDetails) {
    return next(new CustomError("User details not found", 404));
  }

  res.status(200).json({
    error: false,
    message: "Details updated successfully",
    data: updatedDetails,
  });
};

export const searchDoctors = async (req: Request, res: Response) => {
  const doctors = await Doctor.find();
  const specialties = await DrDetails.find();

  res.status(200).json({ doctors, specialties });
};

export const createToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { date, doctorId, tokenNumber } = req.body;
  const patientId = req.user?.id;

  if (!patientId) {
    return next(new CustomError("Patient ID is required"));
  }

  const patientObjectId = new mongoose.Types.ObjectId(patientId);
  const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

  const oldToken = await Token.findOne({
    patientId: patientObjectId,
    date: date,
    doctorId: doctorObjectId,
    tokenNumber: tokenNumber,
  });

  if (oldToken) {
    return next(new CustomError("This token is already booked"));
  }

  // Create new token
  const newToken = new Token({
    date,
    doctorId: doctorObjectId,
    tokenNumber,
    patientId: patientObjectId,
  });

  await newToken.save();
  const io: Server = req.app.get("io");
  io.emit("tokenUpdated", newToken);
  res.status(200).json({
    status: true,
    message: "Token created successfully",
    data: newToken,
  });
};

export const getallTokenByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Fetching tokens for user...");

  const id = req.user?.id;
  const { date } = req.query;

  console.log("User ID:", id, "Date:", date);

  const tokens = (await Token.find({ patientId: id, date: date })
    .populate<{ doctorId: DoctorPopulated }>("doctorId", "name email phone")
    .lean()) as TokenWithDoctor[];

  if (!tokens || tokens.length === 0) {
    return next(new CustomError("Tokens not available."));
  }

  await Promise.all(
    tokens.map(async (token) => {
      if (token.doctorId?._id) {
        const drDetails = await DrDetails.findOne({
          doctor: token.doctorId._id,
        })
          .select(
            "qualification specialization availability profileImage description hospital address certificates"
          )
          .lean();
        token.doctorId.drDetails = drDetails || null;
      }
    })
  );

  console.log(
    "Tokens fetched with DrDetails:",
    JSON.stringify(tokens, null, 2)
  );

  res.status(200).json({
    status: true,
    message: "User's tokens fetched successfully.",
    data: tokens,
  });
};

export const getTokenByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const tokens = (await Token.find({ patientId: id })
    .populate<{ doctorId: DoctorPopulated }>("doctorId", "name email phone")
    .lean()) as TokenWithDoctor[];

  if (!tokens || tokens.length === 0) {
    return next(new CustomError("Tokens not available."));
  }

  res.status(200).json({
    status: true,
    message: "User's tokens fetched successfully.",
    data: tokens,
  });
};

export const getUsersUpdatedToday = async (req: Request, res: Response):Promise <void> => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(startOfDay.getDate() + 1);

  const count = await User.countDocuments({
    updatedAt: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  });

   res.status(200).json({
    success: true,
    count,
    date: startOfDay.toISOString().split("T")[0],
  });
};
