"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.edittokenPerDay = exports.gettokenNumber = exports.addtokenPerDay = exports.deleteDr = exports.editDetails = exports.getallDetails = exports.getdrDetails = exports.addDetails = exports.viewDRbyId = exports.viewalldoctors = void 0;
const Doctor_1 = __importDefault(require("../../Models/Doctor"));
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const DoctorDetails_1 = __importDefault(require("../../Models/DoctorDetails"));
const totalToken_1 = __importDefault(require("../../Models/totalToken"));
;
const viewalldoctors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { page = 1, limit = 8 } = req.query;
    page = Number(page);
    limit = Number(limit);
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return next(new CustomError_1.default("Invalid pagination parameters", 400));
    }
    const totalDoctors = yield Doctor_1.default.countDocuments({ isDeleted: false });
    const doctors = yield Doctor_1.default.find({ isDeleted: false })
        .skip((page - 1) * limit)
        .limit(limit);
    if (!doctors.length) {
        return next(new CustomError_1.default("No doctors found", 404));
    }
    res.status(200).json({
        status: 200,
        message: "Doctors Data",
        data: doctors,
        totalPages: Math.ceil(totalDoctors / limit),
        currentPage: page,
        totalDoctors
    });
});
exports.viewalldoctors = viewalldoctors;
const viewDRbyId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield Doctor_1.default.findById(req.params.id);
    if (!doctor) {
        return next(new CustomError_1.default("There is any doctor found with this ID", 404));
    }
    res.status(200).json({
        message: "One doctor data",
        Data: doctor
    });
});
exports.viewDRbyId = viewDRbyId;
const addDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctor, qualification, specialization, availability, description, address, profileImage, certificates } = req.body;
    const newDetails = new DoctorDetails_1.default({
        doctor,
        qualification: qualification,
        specialization: specialization,
        availability,
        profileImage,
        description,
        address,
        certificates,
    });
    yield newDetails.save();
    res.status(201).json({
        message: "Details added successfully",
        data: newDetails,
    });
});
exports.addDetails = addDetails;
const getdrDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Details = yield DoctorDetails_1.default.find({ doctor: req.params.id }).populate("doctor", "name email phone _id");
    if (!Details) {
        return next(new CustomError_1.default("there is no details find about this doctor", 404));
    }
    res.status(200).json({
        Message: "Doctor details",
        data: Details
    });
});
exports.getdrDetails = getdrDetails;
const getallDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Details = yield DoctorDetails_1.default.find().populate({
        path: "doctor",
        select: "name email phone"
    });
    if (!Details || Details.length === 0) {
        return next(new CustomError_1.default("No doctor details found", 404));
    }
    res.status(200).json({
        Message: "Doctor details",
        data: Details
    });
});
exports.getallDetails = getallDetails;
const editDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = req.params.id;
    const { qualification, specialization, availability, description, address } = req.body;
    if (!qualification || !specialization || !availability || !description || !address) {
        return next(new CustomError_1.default("All required fields must be provided", 400));
    }
    const files = req.files;
    const existingDetails = yield DoctorDetails_1.default.findOne({ doctor });
    if (!existingDetails) {
        return next(new CustomError_1.default("Doctor details not found", 404));
    }
    existingDetails.qualification = JSON.parse(qualification);
    existingDetails.specialization = JSON.parse(specialization);
    existingDetails.availability = availability;
    existingDetails.description = description;
    existingDetails.address = address;
    if (files["profileImage"] && files["profileImage"].length > 0) {
        existingDetails.profileImage = files["profileImage"][0].location;
    }
    if (files["certificates"] && files["certificates"].length > 0) {
        existingDetails.certificates = existingDetails.certificates.concat(files["certificates"].map(file => file.location));
    }
    yield existingDetails.save();
    res.status(200).json({
        message: "Details updated successfully",
        data: existingDetails,
    });
});
exports.editDetails = editDetails;
const deleteDr = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield Doctor_1.default.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!doctor) {
        return next(new CustomError_1.default("Doctor not found", 404));
    }
    res.status(200).json({
        message: "Doctor marked as deleted successfully",
        data: doctor,
    });
});
exports.deleteDr = deleteDr;
const addtokenPerDay = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { tokenperday } = req.body;
    const addtokennumber = new totalToken_1.default({ doctorId: id, tokenPerDay: tokenperday });
    yield addtokennumber.save();
    res.status(200).json({ status: true, message: "number of token add successfully", data: addtokennumber });
});
exports.addtokenPerDay = addtokenPerDay;
const gettokenNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const totaltokens = yield totalToken_1.default.findOne({ doctorId: id });
    res.status(200).json({ status: true, message: 'total token', data: totaltokens });
});
exports.gettokenNumber = gettokenNumber;
const edittokenPerDay = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!id) {
        return next(new CustomError_1.default("user not found", 404));
    }
    const { tokenperday } = req.body;
    const addtokennumber = yield totalToken_1.default.findOneAndUpdate({ doctorId: id }, { tokenPerDay: tokenperday }, { new: true });
    if (!addtokennumber) {
        return next(new CustomError_1.default("Doctor not found", 404));
    }
    res.status(200).json({ status: true, message: "number of token updated successfully", data: addtokennumber });
});
exports.edittokenPerDay = edittokenPerDay;
