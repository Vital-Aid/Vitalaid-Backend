import { Request, Response, NextFunction } from "express";
import User from "../../Models/UserModel";
import CustomError from "../../utils/CustomError";
import UserDetails from "../../Models/Userdetails";
import Token from "../../Models/token";
import mongoose from "mongoose";
import { Server } from 'socket.io'
import Doctor from "../../Models/Doctor";
import path from "path";
import DrDetails, { DrDetailsType } from "../../Models/DoctorDetails";
import { DoctorType } from "../../Models/Doctor";


interface DoctorPopulated {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    drDetails?: DrDetailsType|null  
}

interface TokenWithDoctor {
    _id: mongoose.Types.ObjectId;
    date: string;
    status: string;
    tokenNumber: number;
    doctorId: DoctorPopulated;
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {

    const page = Number(req.query.page)
    const limit = Number(req.query.limit)

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return next(new CustomError("Invalid pagination parameters", 400));
    }
    const totalusers = await User.countDocuments({ isDeleted: false, })

    const users = await User.find({ isDeleted: false, }).skip((page - 1) * limit).limit(limit);

    if (!users) {
        return next(new CustomError('users not found', 404))
    }

    res.status(200).json({
        users: users,
        totalPages: Math.ceil(totalusers / limit),
        currentPage: page,
    })
}

export const getblockedUsers = async (req: Request, res: Response, next: NextFunction) => {

    const users = await User.find({ isDeleted: false, blocked: true })
    if (!users) {
        return next(new CustomError('users not found', 404))
    }

    res.status(200).json({ users: users })
}


export const getUserById = async (req: Request, res: Response, next: NextFunction) => {

    const {id}= req.params
    
    const medhistory = await MedHistory.find({User:id}).populate('User',"name email phone  occupation address gender bloodgroup age ")
    if (!medhistory) {
        return next(new CustomError("user not found", 404))

    }
    
    console.log(medhistory ,'medhistory');
    
    res.status(200).json({status:true,mesage:"medical history",data:medhistory })
}

export const blockUser = async (req: Request, res: Response, next: NextFunction) => {

    const { _id } = req.params;

    const blockedUser = await User.findById(_id)
    if (!blockedUser) {
        return next(new CustomError("blockeUser not found"))
    }
    blockedUser.blocked = !blockedUser.blocked;

    await blockedUser.save();

    res.status(200).json({
        message: blockedUser.blocked ? "User has been blocked" : "User has been unblocked",
        user: blockedUser,
    });
}

export const addDetails = async (req: Request, res: Response, next: NextFunction) => {
    const { age, occupation, address, gender, bloodgroup } = req.body
    const user = req.params.id

    const Details = new UserDetails({
        user,
        address,
        age,
        occupation,
        gender,
        bloodgroup
    })

    const saveddetails = await Details.save()
    res.status(201).json({
        error: false,
        message: "Details added",
        data: saveddetails
    })

}


export const getDetails = async (req: Request, res: Response, next: NextFunction) => {
    const userDetails = await UserDetails.find({ user: req.params.id })
    if (!userDetails) {
        return next(new CustomError("No Details found for this user", 404))
    }
    res.status(200).json(userDetails)
}

export const createToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        patientId: patientObjectId
    });

    await newToken.save()
    const io: Server = req.app.get("io")
    io.emit("tokenUpdated", newToken);
    res.status(200).json({ status: true, message: 'Token created successfully', data: newToken });
};


export const getallTokenByUser = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Fetching tokens for user...");

    const id = req.user?.id;
    const { date } = req.query;

    console.log("User ID:", id, "Date:", date);

    // Step 1: Fetch tokens and populate doctor details
    const tokens = await Token.find({ patientId: id, date: date })
        .populate<{ doctorId: DoctorPopulated }>("doctorId", "name email phone")
        .lean() as TokenWithDoctor[];

    if (!tokens || tokens.length === 0) {
        return next(new CustomError("Tokens not available."));
    }

    // Step 2: Fetch `DrDetails` for each doctor and append manually
    await Promise.all(
        tokens.map(async (token) => {
            if (token.doctorId?._id) {
                const drDetails = await DrDetails.findOne({ doctor: token.doctorId._id })
                    .select("qualification specialization availability profileImage description hospital address certificates")
                    .lean();

                token.doctorId.drDetails = drDetails || null;
            }
        })
    );

    console.log("Tokens fetched with DrDetails:", JSON.stringify(tokens, null, 2));

    res.status(200).json({
        status: true,
        message: "User's tokens fetched successfully.",
        data: tokens,
    });
};
