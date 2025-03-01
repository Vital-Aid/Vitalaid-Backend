import { NextFunction, Request, Response } from "express";
import Doctor from "../../Models/Doctor";
import DrDetails, { DrDetailsType } from "../../Models/DoctorDetails";
import CustomError from "../../utils/CustomError";
import mongoose from "mongoose";
import Token from "../../Models/token";
import sendEmail from "../../utils/emailService";
import { Server } from "socket.io";

interface DoctorPopulated {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  drDetails?: DrDetailsType | null
}

interface TokenWithDoctor {
  _id: mongoose.Types.ObjectId;
  date: string;
  status: string;
  tokenNumber: number;
  doctorId: DoctorPopulated;
}

export const searchDoctors = async (req: Request, res: Response) => {
    const doctors = await Doctor.find();
    const specialties = await DrDetails.find();
  
    res.status(200).json({ doctors, specialties });
  };
  
  export const createToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { date, doctorId, tokenNumber } = req.body;
    const patientId = req.user?.id;
    if (!req.user || !req.user.id || !req.user.email) {
      return next(new CustomError("Unauthorized: User ID or Email is missing", 401));
    }
    const email = req.user?.email
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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
   
    const newToken = new Token({
      date,
      doctorId: doctorObjectId,
      tokenNumber,
      otp,
      patientId: patientObjectId
    });
    await newToken.save()
  
    const emailSubject = "Your OTP for Appointment Confirmation";
    const emailBody = `<p>Your OTP for confirming your appointment is: <strong>${otp}</strong></p>`;
    try {
      await sendEmail(email, emailSubject, emailBody)
      const io: Server = req.app.get("io")
      io.emit("tokenUpdated", newToken);
      res.status(200).json({ status: true, message: 'Token created successfully', data: newToken });
  
    } catch (error) {
      return next(new CustomError("Failed to send OTP email"));
    }
  
  
  };
  
  export const otpVerification = async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;
    console.log("otp:", otp);
    const io: Server = req.app.get("io")
    console.log("Socket instance in controller:", io)
    const token = await Token.findOne({ otp });
  
    if (!token) {
      return next(new CustomError("Invalid OTP"));
    }
  
    token.isVerified = true;
    token.otp = null;
    await token.save();
    io.emit("otpVerified", { userId: req.user?.id, status: "verified" });
  
  
    res.status(200).json({
      status: true,
      message: "OTP verification successful",
      data: token,
    });
  }
  
  
  export const getallTokenByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    
    if (!req.user || !req.user.id) {
      res.status(401).json({ status: false, message: "Unauthorized access" });
      return;
    }
    const id = req.user.id;
    const { date } = req.query;
  
    if (!date) {
      res.status(400).json({ status: false, message: "Date is required" });
      return;
    }
  
    const tokens = await Token.find({ patientId: id, date, isVerified: true })
      .populate<{ doctorId: DoctorPopulated }>("doctorId", "name email phone")
      .lean()
      .exec() as TokenWithDoctor[];
  
    await Promise.all(
      tokens.map(async (token) => {
        if (token.doctorId?._id) {
          const drDetails = await DrDetails.findOne({ doctor: token.doctorId._id })
            .select("qualification specialization availability profileImage description hospital address certificates")
            .lean()
            .exec();
  
          token.doctorId = { ...token.doctorId, drDetails: drDetails || null };
        }
      })
    );
  
    res.status(200).json({
      status: true,
      message: "User's tokens fetched successfully.",
      data: tokens,
    });
  
    return; 
  };
  
  export const getTokenByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    
    const id = req?.user?.id;
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