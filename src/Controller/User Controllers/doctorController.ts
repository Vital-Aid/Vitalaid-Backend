import { Request, Response, NextFunction } from "express";
import Doctor from "../../Models/Doctor";
import CustomError from "../../../utils/CustomError";

export const getDoctors=async(req:Request,res:Response,next:NextFunction)=>{
 

    const docter= await Doctor.find({isDeleted:false})
    if (!docter) {
        return next(new CustomError('Docter not found',404))
    } 
   
    res.status(200).json({docter})
}

export const getDoctersById=async(req:Request,res:Response,next:NextFunction)=>{

   const{_id}= req.params;

   const docter =await Doctor.findById(_id)
   if(!docter){
    return next(new CustomError('Docter not found',404))

   }
   res.status(200).json({docter})
    
}