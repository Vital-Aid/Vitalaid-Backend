import { Request,Response,NextFunction } from "express";
import User from "../../Models/UserModel";
import CustomError from "../../utils/CustomError";

export const getUsers=async(req:Request,res:Response,next:NextFunction)=>{
  
    const page = Number(req.query.page)
    const limit = Number(req.query.limit)

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return next(new CustomError("Invalid pagination parameters", 400));
    }
    const totalusers= await User.countDocuments({isDeleted:false,blocked:false})

    const users=await User.find({isDeleted:false,blocked:false}).skip((page - 1) * limit).limit(limit); 

    if(!users){
        return next(new CustomError('users not found',404))
    }

    res.status(200).json({
        users:users,
        totalPages: Math.ceil( totalusers / limit),
        currentPage: page,
        
    })
}

export const getblockedUsers=async(req:Request,res:Response,next:NextFunction)=>{

    const users=await User.find({isDeleted:false,blocked:true})
    if(!users){
        return next(new CustomError('users not found',404))
    }

    res.status(200).json({users:users})
}


export const getUserById=async(req:Request,res:Response,next:NextFunction)=>{

   const{_id}=req.params;
   const user=await User.findById(_id)
   if(!user){
    return next(new CustomError("user not found",404))

   }
   res.status(200).json({user:user})
}
export const blockUser=async(req:Request,res:Response,next:NextFunction)=>{

    const{_id}=req.params;
    
    const blockedUser=await User.findById(_id)
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