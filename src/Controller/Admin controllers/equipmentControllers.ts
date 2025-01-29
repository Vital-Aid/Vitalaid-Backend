import Equiment from "../../Models/Equipment";
import {Request,Response,NextFunction} from 'express'
import CustomError from "../../utils/CustomError";


interface file extends Express.Multer.File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    bucket: string;
    key: string;
    acl: string;
    contentType: string;
    location: string;  
};

export const addEquipment=async(req:Request,res:Response,next:NextFunction)=>{
    const {description,quantity,name}=req.body
    const image= (req.file as file)?.location;
    if(!image){
        return next(new CustomError('image not found',404))
    }
    const equipmentData={description,quantity,name,image}
    const newequipment=await new Equiment(equipmentData)
    await newequipment.save()
    res.status(200).json({error:false,message:'aquipment added successfully',data:newequipment})
}


export const getAllEquipments=async(req:Request,res:Response,next:NextFunction)=>{
    const equipments=await Equiment.find()
    if(!equipments){
        return next(new CustomError('equipments not found',404))
    }
    res.status(200).json({error:false,data:equipments})
}

export const getEquipmentBYId=async(req:Request,res:Response,next:NextFunction)=>{
    const{id}=req.params
    if(!id){
        return next(new CustomError('ID not provided',404)) 
    }
    const equipment=await Equiment.findById(id)
    if(!equipment){
        return next(new CustomError('equipment not found',404))
    }
    res.status(200).json({error:false,data:equipment})
}

export const editEquipments=async(req:Request,res:Response,next:NextFunction)=>{
    const{id}=req.params
    const {description,quantity,name}=req.body
    const image= (req.file as file)?.location;
   
    const equipmentData={description,quantity,name,image}
    const updateEquipment=await Equiment.findByIdAndUpdate(id,equipmentData,{new:true})
    
    res.status(200).json({error:false,message:'aquipment added successfully',data:updateEquipment})
}