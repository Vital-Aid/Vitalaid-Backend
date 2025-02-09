import Equiment from "../Models/Equipment";
import Volunteer from "../Models/Volunteer";
import CustomError from "../utils/CustomError";
import {Request,Response,NextFunction} from 'express'

export const searchvolunteer=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    const query=req.query.q as string
    if(!query){
         res.json([])
         return
    }
    const result = await Volunteer.find({
        name: { $regex: query, $options: 'i' },
        isDeleted: false,
    }).limit(10).lean();  

    res.json(result);
}

export const searchEquipments=async(req:Request,res:Response,next:NextFunction)=>{
    const query=req.query.q as string
    if(!query||query==""){
        res.json([])
    }

    const result=await Equiment.find({
        name:{$regex:query,$options:'i'},
        isDeleted:false,

    }).limit(10).lean()
    res.json(result)
}