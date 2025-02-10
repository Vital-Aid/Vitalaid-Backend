import { Request, Response, NextFunction } from "express";
import Doctor from "../../Models/Doctor";
import CustomError from "../../utils/CustomError";
import DrDetails from "../../Models/DoctorDetails";
import Slot from "../../Models/Slotes";

export const getDoctors = async (req: Request, res: Response, next: NextFunction) => {

    const page = Number(req.query.page)
    const limit = Number(req.query.limit)

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return next(new CustomError("Invalid pagination parameters", 400));
    }

    const totalDoctors = await Doctor.countDocuments({ isDeleted: false });
    const doctors = await Doctor.find({ isDeleted: false })
        .skip((page - 1) * limit)
        .limit(limit);

    if (!doctors.length) {
        return next(new CustomError("No doctors found", 404));
    }

    res.status(200).json({
        status: 200,
        message: "Doctors Data",
        data: doctors,
        totalPages: Math.ceil(totalDoctors / limit),
        currentPage: page,
        totalDoctors
    });
}



export const getDoctersById = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;

    const doctor = await Doctor.findById(id)
    if (!doctor) {
        return next(new CustomError('Docter not found', 404))

    }
    res.status(200).json(doctor)

}

export const getDoctersByIdfordoctor = async (req: Request, res: Response, next: NextFunction) => {

    const id = req.user?.id;

    const doctor = await DrDetails.findOne({doctor:id}).populate('doctor', 'name email phone ')
    if (!doctor) {
        return next(new CustomError('Docter not found', 404))

    }
    res.status(200).json({error:false,data:doctor})

}

export const addSlotes=async(req: Request, res: Response, next: NextFunction)=>{
   const doctor=req.user?.id
    const{startingTme,endingTime}=req.body
    const newSlot=new Slot({doctor,startingTme,endingTime})
    await newSlot.save()
    res.status(200).json({error:false,message:"solt added",data:newSlot})
}

export const getSlots=async(req: Request, res: Response, next: NextFunction)=>{
    const id=req.user?.id
    const allSlots=await Slot.find({doctor:id,isDeleted:false})
    if(!allSlots){
        next(new CustomError("Slots not found"))
    }
    res.status(200).json({error:false,data:allSlots})
}