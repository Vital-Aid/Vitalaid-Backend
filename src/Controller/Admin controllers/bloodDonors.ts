import { Request, Response, NextFunction } from "express";
import BloodDonor from "../../Models/BloodDonors";
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

export const addDonor = async (req: Request, res: Response)=> {
    const image = (req.file as file)?.location;

    console.log("Image URL:", image);

    if (!image) {
      res.status(400).json({ error: true, message: 'Image is required' });
    }


        const { name, BloodGroup, Phone, Gender, Age, Address } = req.body;

        console.log('req.body',req.body);
        
        const existingDonor = await BloodDonor.findOne({ Phone });

        if (existingDonor) {
             res.status(409).json({
                error: true,
                message: "Donor with this phone number already exists.",
                donor: existingDonor,
                
            });
            return;
        }


        const newDonor = new BloodDonor({
            name,
            BloodGroup,
            Phone,
            Gender,
            Age,
            Address,
            image,  
        });

        await newDonor.save();

        res.status(201).json({
            error: false,
            success: true,
            message: "Donor added successfully",
            donor: newDonor,
        });
   
};

export const getDonors=async(req: Request, res: Response, next: NextFunction)=>{

    const donors= await BloodDonor.find({ isDeleted: false })
    if (!donors) {
        return next(new CustomError('donors not found', 404))
    }
    res.status(200).json({error:'false',donors:donors})

}

export const getDonorsById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const donors = await BloodDonor.findById(id)
    if (!donors) {
        return next(new CustomError('event not found', 404))
    }
    res.status(200).json({error:'false',donors:donors})
}
export const editDonors=async(req:Request,res:Response,next:NextFunction)=>{
  
    const {id}=req.params
    const{ name,BloodGroup,Phone,Gender,Age,Address}=req.body
    const image = (req.file as file)?.location;
    const eventData = {name,BloodGroup,Phone,Gender,Age,Address,image };
    const editedBloodDonor=await BloodDonor.findByIdAndUpdate(id,eventData,{new:true})
    res.status(200).json({error:'false',message:'donor edited successfully',donors:editedBloodDonor})
}

export const deleteDoner=async (req:Request,res:Response,next:NextFunction)=>{

    const { id } = req.params;
        const deletedoner = await BloodDonor.findById(id);

        if (!deletedoner) {
            return next(new CustomError("Event not found", 404));
        }

        deletedoner.isDeleted = !deletedoner.isDeleted; 
        await deletedoner.save();

        res.status(200).json({ error: false, event: deletedoner });

}