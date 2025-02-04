import CustomError from "../../utils/CustomError";
import Equiment from "../../Models/Equipment";
import EquipmentRequest from "../../Models/Request";
import { Request, Response, NextFunction } from "express";


export const makeRequest = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user?.id
    const { equipment, location } = req.body
    const newrequest = new EquipmentRequest({ user: user, equipment: equipment, location: location })
    await newrequest.save()
    const item = await Equiment.findById(equipment)

    if (!item || typeof item.quantity !== "number") {
        return next(new CustomError("Equipment not found or has no quantity", 404))
    }
    const quantity = item?.quantity - 1

    await Equiment.findByIdAndUpdate(equipment, { quantity: quantity }, { new: true })
    res.status(200).json({ error: false, message: "request added successfully", data: newrequest })
}



export const getRequestbyuser=async(req: Request, res: Response, next: NextFunction)=>{
    const user=req.user?.id
    console.log('dyugsyugu',user);
    
    const request=await EquipmentRequest.find({user}).populate("equipment", "name description quantity") 
    console.log('req:',request);
    
    if(!request){
        return next(new CustomError("request not found",404))
    }
    res.status(200).json({error:false,message:'user requests',data:request})
}

export const removeRequest=async(req: Request, res: Response, next: NextFunction)=>{
    const user=req.user?.id
    const equipment=req.params
    const deleteRquest=await EquipmentRequest.deleteOne({user,equipment})
    res.status(200).json({error:false,message:'request deleted',data:deleteRquest})
}