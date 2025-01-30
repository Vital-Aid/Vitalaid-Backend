import { Request, Response, NextFunction } from "express";
import Doctor from "../../Models/Doctor";
import CustomError from "../../utils/CustomError";

export const getDoctors=async(req:Request,res:Response,next:NextFunction)=>{
 

    const doctor= await Doctor.find({isDeleted:false})
    if (!doctor) {
        return next(new CustomError('Docter not found',404))
    } 
   
    res.status(200).json(doctor)
}

export const getDoctersById=async(req:Request,res:Response,next:NextFunction)=>{

   const{id}= req.params;

   const doctor =await Doctor.findById(id)
   if(!doctor){
    return next(new CustomError('Docter not found',404))

   }
   res.status(200).json(doctor)
    
}