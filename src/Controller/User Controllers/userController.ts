import { Request, Response, NextFunction } from "express";
import User from "../../Models/UserModel";
import CustomError from "../../utils/CustomError";
import UserDetails from "../../Models/Userdetails";
import MedHistory from "../../Models/Medicalhistory";

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

