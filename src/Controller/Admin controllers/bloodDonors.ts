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

export const addDonor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  
    const { name, BloodGroup, Phone, Gender, Age, Address, imageUrl } = req.body;
  

    if (!imageUrl) {
        return next(new CustomError("Image URL is required", 400))
    }

    const existingDonor = await BloodDonor.findOne({ Phone });

    if (existingDonor) {
        return next(new CustomError("Donor with this phone number already exists.", 409))
    }

    const newDonor = new BloodDonor({
        name,
        BloodGroup,
        Phone,
        Gender,
        Age,
        Address,
        image: imageUrl,
    });

    await newDonor.save();
    res.status(201).json({ success: true, message: "Donor added successfully!", donor: newDonor });
};


export const getDonors = async (req: Request, res: Response, next: NextFunction) => {

    const page = Number(req.query.page)
    const limit = Number(req.query.limit)

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return next(new CustomError("Invalid pagination parameters", 400));
    }

    const totaldonor = await BloodDonor.countDocuments({ isDeleted: false })

    const donors = await BloodDonor.find({ isDeleted: false }).skip((page - 1) * limit).limit(limit);

    if (!donors) {
        return next(new CustomError('donors not found', 404))
    }
    res.status(200).json({
        error: 'false',
        donors: donors,
        totalPages: Math.ceil(totaldonor / limit),
        currentPage: page,
        totaldonor
    })
}

export const getDonorsById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const donors = await BloodDonor.findById(id)
    if (!donors) {
        return next(new CustomError('event not found', 404))
    }
    res.status(200).json({ error: 'false', donors: donors })
}
export const editDonors = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params
    const { name, BloodGroup, Phone, Gender, Age, Address } = req.body
    const image = (req.file as file)?.location;
    const eventData = { name, BloodGroup, Phone, Gender, Age, Address, image };
    const editedBloodDonor = await BloodDonor.findByIdAndUpdate(id, eventData, { new: true })
    res.status(200).json({ error: 'false', message: 'donor edited successfully', donors: editedBloodDonor })
}

export const deleteDoner = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;
    const deletedoner = await BloodDonor.findById(id);

    if (!deletedoner) {
        return next(new CustomError("Event not found", 404));
    }

    deletedoner.isDeleted = !deletedoner.isDeleted;
    await deletedoner.save();

    res.status(200).json({ error: false, event: deletedoner });

}