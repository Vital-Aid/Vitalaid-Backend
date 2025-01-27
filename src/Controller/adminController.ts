import {Response,Request,NextFunction} from 'express'
import Event from '../Models/Event'
import CustomError from '../../utils/CustomError'


export const addEvent=async(req:Request,res:Response,next:NextFunction)=>{
    const{organization,location,image,date,description,title}=req.body
    const newEvent=new Event({title,organization,location,image,date,description})
    await newEvent.save()
    res.status(200).json({error:false,message:'event added successfully',event:newEvent})
}

export const getEvents=async(req:Request,res:Response,next:NextFunction)=>{
    const events=await Event.find()
    if(!events){
        return next(new CustomError("Events not found",404))
    }
    res.status(200).json({error:'false',events:events})
}

export const getEventById=async(req:Request,res:Response,next:NextFunction)=>{
    const {id}=req.params
    const event=await Event.findById(id)
    if(!event){
        return next(new CustomError('event not found',404))
    }
    res.status(200).json({error:'false',event:event})
}