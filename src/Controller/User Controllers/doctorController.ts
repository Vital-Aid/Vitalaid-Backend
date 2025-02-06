import { Request, Response, NextFunction } from "express";
import Doctor from "../../Models/Doctor";
import CustomError from "../../utils/CustomError";

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