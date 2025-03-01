import CustomError from "../../utils/CustomError";
import Equiment from "../../Models/Equipment";
import EquipmentRequest from "../../Models/Request";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const makeRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user?.id;
  const { equipment, location } = req.body;
  const newrequest = new EquipmentRequest({
    user: user,
    equipment: equipment,
    location: location,
  });
  await newrequest.save();
  const item = await Equiment.findById(equipment);

  if (!item || typeof item.quantity !== "number") {
    return next(new CustomError("Equipment not found or has no quantity", 404));
  }
  const quantity = item?.quantity - 1;

  await Equiment.findByIdAndUpdate(
    equipment,
    { quantity: quantity },
    { new: true }
  );
  res
    .status(200)
    .json({
      error: false,
      message: "request added successfully",
      data: newrequest,
    });
};

export const getRequestbyuser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user?.id;
  console.log("User ID:", user);

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
    return next(new CustomError("Invalid pagination parameters", 400));
  }

  const totalRequests = await EquipmentRequest.countDocuments({ user });
  const requests = await EquipmentRequest.find({ user })
    .populate("equipment", "name description quantity image")
    .populate("user", "name email")
    .skip((page - 1) * limit)
    .limit(limit);

  console.log("Requests:", requests);

  if (!requests.length) {
    return next(new CustomError("No requests found", 404));
  }

  res.status(200).json({
    error: false,
    message: "User requests",
    data: requests,
    totalPages: Math.ceil(totalRequests / limit),
    currentPage: page,
    totalRequests,
  });
};

export const removeRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { equipment } = req.params;

  const deleteRequest = await EquipmentRequest.findByIdAndDelete(equipment);

  res
    .status(200)
    .json({ error: false, message: "Request deleted", data: deleteRequest });
};

export const updaterequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const status = req.body;
  const updatedrequest = await EquipmentRequest.findByIdAndUpdate(id, status, {
    new: true,
  });
  res
    .status(200)
    .json({ error: false, message: "request updated", data: updatedrequest });
};


export const totalEquipment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Total = await Equiment.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: null, totalCount: { $sum: "$quantity" } } },
  ]);

  res.status(200).json({
    status:true,
    message:"total equipment",
    data:Total
  })
};
