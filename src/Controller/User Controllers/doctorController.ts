import { Request, Response, NextFunction } from "express";
import Doctor from "../../Models/Doctor";
import CustomError from "../../utils/CustomError";
import DrDetails from "../../Models/DoctorDetails";
import Token from "../../Models/token";
import TokenPerDay from "../../Models/totalToken";

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
    res.status(200).json({status:true, message:"docur by id" ,data:doctor})

}

export const getDoctersByIdfordoctor = async (req: Request, res: Response, next: NextFunction) => {

    const id = req.user?.id;

    const doctor = await DrDetails.findOne({ doctor: id }).populate('doctor', 'name email phone ')
    if (!doctor) {
        return next(new CustomError('Docter not found', 404))

    }
    res.status(200).json({
        status: true,
        message: "dr data",
        data: doctor,
    })

}


export const getallTokens = async (req: Request, res: Response, next: NextFunction) => {
    const {id}=req.params
    const tokens = await Token.find({doctorId:id,isVerified:true}).populate("patientId","name email phone")

    if (!tokens) {
        return next(new CustomError('tokens not available'))
    }

    res.status(200).json({ status: true, message: 'all tokens', data: tokens })
}

export const getallTokensofEachDoctor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user || !req.user.id) {
        res.status(401).json({ status: false, message: "Unauthorized access" });
        return;
    }

    const doctorId = req.user.id;
    const { date } = req.query;

    if (!date) {
        res.status(400).json({ status: false, message: "Date is required" });
        return;
    }

    const tokens = await Token.find({
        doctorId,
        date,
        isVerified: true,
    }).populate("patientId", "name email phone profileImage").lean().exec();

    if (!tokens || tokens.length === 0) {
        res.status(404).json({ status: false, message: "No tokens found" });
        return;
    }

    res.status(200).json({ status: true, message: "All tokens", data: tokens });
};


export const editTokenStatus=async(req: Request, res: Response, next: NextFunction)=>{
   console.log('jsdvchgs');
   
    const {status}=req.body
    const{id}=req.params
    console.log("id",id);
    console.log(status);
    
    
    const updateToken=await Token.findByIdAndUpdate(id,{status:status},{new:true})
    res.status(200).json({status:true,message:'token status updated successfully',data:updateToken})
}

export const editAvailability=async(req: Request, res: Response, next: NextFunction)=>{
    const id=req.user?.id
    const {endingTime,startingTme}=req.body
    console.log(typeof(endingTime),typeof(startingTme));
    
    const newavailability=`${startingTme}-${endingTime}`
    console.log(newavailability);
    
    const editedavailability=await DrDetails.findOneAndUpdate({doctor:id},{availability:newavailability},{new:true})
    res.status(200).json({status:true,message:'availability edited successfully',data:editedavailability})

}


export const searchDoctors = async (req: Request, res: Response) => {
    const doctors = await Doctor.find() 
    const specialties = await DrDetails.find()
  
    res.status(200).json({ doctors, specialties });
  };

  export const addTokenPerDay=async(req: Request, res: Response)=>{
    const id=req.user?.id
    const {numberoftoken}=req.body
    const newtokennumber=await TokenPerDay.findByIdAndUpdate(id,{tokenPerDay:numberoftoken},{new:true})
    res.status(200).json({status:true,message:"token number updated",data:newtokennumber})
  }


