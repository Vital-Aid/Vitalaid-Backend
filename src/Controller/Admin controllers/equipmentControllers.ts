import Equiment from "../../Models/Equipment";
import { Request, Response, NextFunction } from 'express'
import CustomError from "../../utils/CustomError";
import EquipmentRequest from "../../Models/Request";

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

export const addEquipment = async (req: Request, res: Response, next: NextFunction) => {
    const { description, quantity, name, imageUrl } = req.body

    const equipmentData = { description, quantity, name, image: imageUrl }

    const newequipment = await new Equiment(equipmentData)

    await newequipment.save()
    res.status(200).json({ error: false, message: 'aquipment added successfully', data: newequipment })
}


export const getAllEquipments=async(req:Request,res:Response,next:NextFunction)=>{
    const page = Number(req.query.page)
    const limit = Number(req.query.limit)

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return next(new CustomError("Invalid pagination parameters", 400));
    }
    const totalequipment= await Equiment.countDocuments({isDeleted:false})
    const equipments=await Equiment.find({isDeleted:false}).skip((page - 1) * limit).limit(limit);

    if(!equipments){
        return next(new CustomError('equipments not found',404))
    }
    res.status(200).json({
        error: false,
        allEquipment: equipments,
        totalPages: Math.ceil(totalequipment / limit),
        currentPage: page,
        totalequipment
    })
}

export const getEquipmentBYId = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    if (!id) {
        return next(new CustomError('ID not provided', 404))
    }
    const equipment = await Equiment.findById(id)
    if (!equipment) {
        return next(new CustomError('equipment not found', 404))
    }
    res.status(200).json({ error: false, data: equipment })
}

export const editEquipments = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { description, quantity, name } = req.body
    const image = (req.file as file)?.location;

    const equipmentData = { description, quantity, name, image }
    const updateEquipment = await Equiment.findByIdAndUpdate(id, equipmentData, { new: true })

    res.status(200).json({ error: false, message: 'aquipment added successfully', data: updateEquipment })
}

export const deleteEquipments = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params
    const deletedeuipment = await Equiment.findByIdAndUpdate(id, { isDeleted: true }, { new: true })

    if (!deletedeuipment) {
        return next(new CustomError('equipment not found', 404))
    }
    res.status(200).json({error:false,message:'equipment updated',data:deletedeuipment})
}



export const getAllequipmetRequests=async(req: Request, res: Response, next: NextFunction)=>{
    const requests=await EquipmentRequest.find().populate("user", "name email").populate("equipment", "name description quantity") 
    if(!requests){
        return next(new CustomError("requenst not found",404))
    }
    res.status(200).json({error:false,message:'all requests',data:requests})
}  
   