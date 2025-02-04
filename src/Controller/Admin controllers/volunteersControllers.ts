import {Request,Response,NextFunction} from 'express'
import CustomError from '../../utils/CustomError'
import Volunteer from '../../Models/Volunteer'


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

export const addVolunteers=async(req:Request,res:Response,next:NextFunction)=>{
    const {name,phone,gender}=req.body
    const image=(req.file as file)?.location;
    const newvolunteers=new Volunteer({name,phone,gender,image})
    if(!newvolunteers){
        return next(new CustomError('detailes not recived',404))
    }
    await newvolunteers.save()
    res.status(200).json({error:false,message:'A new volunteer has been successfully added.',data:newvolunteers})

}

export const getVolunteers=async(req:Request,res:Response,next:NextFunction)=>{

    const page = Number(req.query.page)
    const limit = Number(req.query.limit)

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return next(new CustomError("Invalid pagination parameters", 400));
    }

    const totalvolunteer= await Volunteer.countDocuments({isDeleted:false})
    const volunteers=await Volunteer.find({isDeleted:false}).skip((page - 1) * limit).limit(limit);

    if(!volunteers ||volunteers.length==0){
        return next(new CustomError('Volunteers not found',404))
    }
    res.status(200).json({
        error:false,
        message:'all volunteers',
        allVolunteers:volunteers,
        totalPages: Math.ceil(totalvolunteer / limit), 
        currentPage: page,
        totalvolunteer
    })
}

export const getvolonteersById=async(req:Request,res:Response,next:NextFunction)=>{
    const{id}=req.params
    if(!id){
        return next(new CustomError('id not found',404))
    }
    const volunteer=await Volunteer.findById(id)
    if(!volunteer){
        return next(new CustomError('volunteer not found',404))
    }
    res.status(200).json({error:false,message:'volunteer by id',data:volunteer})
}

export const editvolunteers=async(req:Request,res:Response,next:NextFunction)=>{
    const {id}=req.params
    const {name,phone,gender}=req.body
    const image=(req.file as file)?.location;
    const editedDetailes={name,phone,gender,image}
    const editedvolunteer=await Volunteer.findByIdAndUpdate(id,editedDetailes,{new:true})
    res.status(200).json({error:false,message:'The volunteer has been edited successfully.',data:editedvolunteer})
}

export const deleteVolunteers=async(req:Request,res:Response,next:NextFunction)=>{
    const {id}=req.params
    const deletedvolunteer=await Volunteer.findByIdAndUpdate(id,{isDeleted:true},{new:true})
    res.status(200).json({error:false,message:'Volunteers have been deleted successfully.',data:deletedvolunteer})
}