import { Request,Response,NextFunction } from "express";
import User from "../../Models/UserModel";
import CustomError from "../../utils/CustomError";

export const getUsers=async(req:Request,res:Response,next:NextFunction)=>{

    const users=await User.find({isDeleted:false})
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
